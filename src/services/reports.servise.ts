import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { DATABASE } from '../config';
import { MONTHS } from '../utilities/constants';

@Injectable()
export class ReportsService {
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

  getReports(start: number, end: number) {
    return `start: ${start}
            end: ${end}    
      `;
  }

  async getBookedRoomByQuery(query) {
    const { rows } = await this.client.query(query);
    return rows;
  }
}
