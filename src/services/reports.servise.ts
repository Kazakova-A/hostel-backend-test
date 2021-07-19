import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

import { DATABASE } from '../config';

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

  async getBookedRoomByQuery(query) {
    const { rows } = await this.client.query(query);
    return rows;
  }
}
