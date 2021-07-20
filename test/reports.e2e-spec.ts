import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/modules/app.module';
import { BookRecord } from '../src/utilities/types';

describe('RoomsController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/reports (GET). Should return client side error', async () => {
    const result = await request(app.getHttpServer()).get('/reports');
    expect(400);
    expect(result.body.message).toEqual('MISSING_DATA');
  });

  it('/rooms (GET)', async () => {
    const query = {
      start_date: 1633068135,
      end_date: 1633845735,
    };

    const result = await request(app.getHttpServer())
      .get('/reports')
      .query(query);

    const {
      body: { status, message, data },
    } = result;

    expect(status).toBe(200);
    expect(message).toEqual('OK');
    expect(data.october.length).toBe(0);
  });

  it('/rooms (GET)', async () => {
    const query = {
      start_date: 1633068135,
      end_date: 1639116135,
    };

    const result = await request(app.getHttpServer())
      .get('/reports')
      .query(query);

    const {
      body: { status, message, data },
    } = result;

    // checking that statistics returned for all required months
    const expectansions = ['october', 'november', 'december'];
    const months = Object.keys(data);

    const check = months.reduce((accum, item) => {
      const res = !!expectansions.find((elem) => elem === item);
      accum = accum && res;
      return accum;
    }, true);

    expect(status).toBe(200);
    expect(message).toEqual('OK');
    expect(check).toBe(true);
  });
});
