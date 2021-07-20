import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { DATABASE } from '../config';
import { HotelRoomRecord, BookRoom, BookRecord } from '../utilities/types';

@Injectable()
export class RoomsService {
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

  async getBookedRooms(
    start_date: number,
    end_date: number,
  ): Promise<string[]> {
    try {
      const bookingQuery = `
        SELECT *
        FROM "booking" b
        WHERE (b."start_date" >= ${start_date} AND b."end_date" <= ${end_date})
        OR (b."start_date" >= ${start_date} AND b."start_date" <= ${end_date} AND b."end_date" >= ${end_date})
        OR (
          b."start_date" <= ${start_date} AND b."end_date" <= ${end_date} AND b."end_date" >= ${start_date}
        )
        OR (
          b."start_date" <= ${start_date} AND b."end_date" >= ${end_date}
        )
      `;

      // get booked rooms for this date interval
      const { rows } = await this.client.query(bookingQuery);
      const bookedRooms = rows.map((item) => item.room_id);

      return bookedRooms;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFreeRooms(
    start_date: number,
    end_date: number,
  ): Promise<HotelRoomRecord[]> {
    try {
      const bookedRooms = await this.getBookedRooms(start_date, end_date);
      const roomsQuery = `SELECT * FROM "hotel_rooms"`;
      const { rows: rooms } = await this.client.query(roomsQuery);
      const freeRooms = rooms.filter(({ id }) => !bookedRooms.includes(id));

      return freeRooms;
    } catch (error) {
      throw new Error(error);
    }
  }

  async bookRoom({
    start_date,
    end_date,
    room_id,
    client_email,
    total_price,
  }: BookRoom): Promise<BookRecord> {
    try {
      const query = `
        INSERT INTO "booking" (start_date, end_date, room_id, client_email, total_price)
        VALUES (${start_date}, ${end_date}, ${room_id}, '${client_email}', ${total_price})
        RETURNING *
      `;
      const { rows } = await this.client.query(query);

      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRoomById(id: number): Promise<HotelRoomRecord | void> {
    try {
      const query = `
        SELECT * FROM "hotel_rooms" h
        WHERE h."id" = ${id}
      `;

      const { rows } = await this.client.query(query);

      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }
}
