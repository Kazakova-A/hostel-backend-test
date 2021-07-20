import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import * as moment from 'moment';

import { DATABASE } from '../config';
import { Tables } from '../utilities/types';

import { VALIDATED_WEEK_DAYS, DISCOUNTS } from '../utilities/constants';
import countDaysDifference from '../utilities/countTimeDifference';

@Injectable()
export class DatabaseService {
  client: any;
  constructor() {
    this.client = new Client({
      user: DATABASE.username,
      host: DATABASE.host,
      database: DATABASE.database,
      password: DATABASE.password,
      port: DATABASE.port,
    });

    this.client.connect();
  }

  async checkTable(tableName: string) {
    try {
      const request = `SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'`;

      const { rows } = await this.client.query(request);
      const tableList = rows.map((item) => item.table_name);
      return tableList.includes(tableName);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createTableQueries(tables: Tables[]) {
    try {
      const arr = await tables.reduce(async (promisedAcc, item) => {
        const queryFields = item.fields
          .map(({ name, type, link, key }) => {
            const query =
              link && key
                ? `${name} ${type} REFERENCES ${link} (${key})`
                : `${name} ${type}`;
            return query;
          })
          .join(', ');
        const query = `CREATE TABLE ${item.name} (id SERIAL PRIMARY KEY, ${queryFields});`;
        const accum = await promisedAcc;
        const isTableExist = await this.checkTable(item.name);

        if (isTableExist) {
          return accum;
        }

        return [...accum, query];
      }, Promise.resolve([]));

      return arr;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createTables(tables: Tables[]) {
    try {
      const queries = await this.createTableQueries(tables);
      const promises = queries.map((query) => this.client.query(query));
      await Promise.all(promises);
    } catch (error) {
      throw new Error(error);
    }
  }

  async insertLine({
    tableName,
    data,
  }: {
    tableName: string;
    data: { [key: string]: string | number };
  }) {
    const exist = await this.checkTable(tableName);
    if (!exist) {
      return;
    }

    const keys = Object.keys(data)
      .map((item) => `"${item.toLowerCase()}"`)
      .join(', ');
    const values = Object.values(data)
      .map((item) => `'${item}'`)
      .join(', ');
    const query = `insert into public."${tableName.toLowerCase()}"
      (${keys})
      values (${values})
    `;

    try {
      await this.client.query(query);
    } catch (error) {
      throw new Error(error);
    }
  }

  async seed({
    tableName,
    lines,
  }: {
    tableName: string;
    lines: { [key: string]: string | number }[];
  }) {
    const exist = await this.checkTable(tableName);

    if (!exist) {
      return;
    }

    const promises = lines.map((line) =>
      this.insertLine({ tableName, data: line }),
    );

    await Promise.all(promises);
  }

  async seedBooking(id: number) {
    try {
      let startDate = 1634450303;

      const BOOK_FOR_EACH_ROOM = 15;
      const DELAY = 5;
      const PRICE = 1000;

      for (let i = 1; i <= BOOK_FOR_EACH_ROOM; i++) {
        const bookDuration = Math.floor(Math.random() * 9 + 1);
        let endDate = Number(
          moment(startDate * 1000)
            .add(bookDuration, 'days')
            .format('X'),
        );

        //check if start and end date are valid
        const startWeekDay = new Date(startDate * 1000).getDay();
        const endWeekDay = new Date(endDate * 1000).getDay();

        if (
          VALIDATED_WEEK_DAYS[startWeekDay] ||
          VALIDATED_WEEK_DAYS[endWeekDay]
        ) {
          startDate = VALIDATED_WEEK_DAYS[startWeekDay]
            ? Number(moment(startDate).add(1, 'days').format('X')) * 1000
            : startDate;

          endDate = VALIDATED_WEEK_DAYS[startWeekDay]
            ? Number(moment(startDate).add(1, 'days').format('X')) * 1000
            : endDate;
        }

        const diffInDays = countDaysDifference(startDate, endDate, 'days');

        const discount =
          10 <= diffInDays && diffInDays < 20
            ? DISCOUNTS[10]
            : diffInDays > 20
            ? DISCOUNTS[20]
            : 1;

        const total = PRICE * diffInDays * discount;

        const payload = {
          room_id: id,
          client_email: `user${bookDuration}@mail.ru`,
          start_date: startDate,
          end_date: endDate,
          total_price: total,
        };

        this.seed({
          tableName: 'booking',
          lines: [payload],
        });

        startDate = Number(
          moment(endDate * 1000)
            .add(DELAY, 'days')
            .format('X'),
        );
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteRecord(table: string, id: number) {
    try {
      const query = `
      DELETE FROM ${table}
      WHERE id = ${id}`;

      return await this.client.query(query);
    } catch (error) {
      throw new Error(error);
    }
  }
}
