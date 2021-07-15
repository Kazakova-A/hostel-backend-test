import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { DATABASE } from 'src/config';
import { HotelRoomRecord, BookRoom } from 'src/utilities/types';

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

  async getBookedRooms(startDate: number, endDate: number) {
    const bookingQuery = `
      SELECT *
      FROM "booking" b
      WHERE (b."start_date" >= ${startDate} AND b."end_date" <= ${endDate})
      OR (b."start_date" >= ${startDate} AND b."start_date" <= ${endDate} AND b."end_date" >= ${endDate})
      OR (
        b."start_date" <= ${startDate} AND b."end_date" <= ${endDate} AND b."end_date" >= ${startDate}
      )
      OR (
        b."start_date" <= ${startDate} AND b."end_date" >= ${endDate}
      )
    `;

    // get booked rooms for this date interval
    const { rows } = await this.client.query(bookingQuery);
    const bookedRooms = rows.map((item) => item.room_id);
    return bookedRooms;
  }

  async getFreeRooms(startDate: number, endDate: number) {
    const bookedRooms = await this.getBookedRooms(startDate, endDate);
    const roomsQuery = `SELECT * FROM "hotel_rooms"`;
    const { rows: rooms } = await this.client.query(roomsQuery);
    const freeRooms = rooms.filter(({ id }) => !bookedRooms.includes(id));

    return freeRooms;
  }

  async bookRoom({ startDate, endDate, roomId, email, price }: BookRoom) {
    const query = `
      INSERT INTO "booking" (start_date, end_date, room_id, client_email, total_price)
      VALUES (${startDate}, ${endDate}, ${roomId}, '${email}', ${price})
    `;

    return this.client.query(query);
  }

  async getRoomById(id: number): Promise<HotelRoomRecord | void> {
    const query = `
      SELECT * FROM "hotel_rooms" h
      WHERE h."id" = ${id}
    `;

    const { rows } = await this.client.query(query);

    return rows[0];
  }
}
