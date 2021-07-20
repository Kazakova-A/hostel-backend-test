import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/modules/app.module';
import { BookRecord } from '../src/utilities/types';
import { DatabaseService } from '../src/services/database.service';

describe('RoomsController', () => {
  let app: INestApplication;
  let newBookRecord: BookRecord;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseService],
    }).compile();

    databaseService = await module.resolve(DatabaseService);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await databaseService.deleteRecord('booking', newBookRecord.id);
    await app.close();
  });

  it('/rooms (GET). Should return client side error', async () => {
    const result = await request(app.getHttpServer()).get('/rooms');
    expect(400);
    expect(result.body.message).toEqual('MISSING_DATA');
  });

  it('/rooms (GET)', async () => {
    const query = {
      start_date: 1633068135,
      end_date: 1634104935,
    };

    const result = await request(app.getHttpServer())
      .get('/rooms')
      .query(query);

    const {
      body: { status, message, data },
    } = result;

    expect(status).toBe(200);
    expect(message).toEqual('OK');
    expect(data.length).toBe(5);
  });

  it('/rooms (POST)', async () => {
    const req = {
      room_id: 5,
      client_email: 'user@mail.ru',
      start_date: 1633068135,
      end_date: 1633154535,
      total_price: 1000,
    };

    const result = await request(app.getHttpServer()).post('/rooms').send(req);

    const {
      body: { status, message, data },
    } = result;

    newBookRecord = data;

    expect(status).toBe(201);
    expect(message).toEqual('OK');
    expect(data.room_id).toBe(5);
  });

  it('/rooms (POST). Should return client side error', async () => {
    const result = await request(app.getHttpServer()).post('/rooms');

    expect(result.body.status).toBe(400);
    expect(result.body.message).toEqual('MISSING_DATA');
  });
});
