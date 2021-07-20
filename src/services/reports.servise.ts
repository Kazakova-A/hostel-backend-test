import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { DATABASE } from '../config';
import { BookedRoomInfo } from '../utilities/types';

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

  async getBookedRoomByQuery(query): Promise<BookedRoomInfo[]> {
    try {
      const { rows } = await this.client.query(query);
      return rows;
    } catch (error) {
      throw new Error(error);
    }
  }
}
