import { NestFactory } from '@nestjs/core';

import { SeederModule } from './modules/database.module';
import { DatabaseService } from './services/database.service';

async function bootstrap() {
  const client = await NestFactory.createApplicationContext(SeederModule);
  const seeder = client.get(DatabaseService);

  const TABLES = [
    {
      name: 'hotel_rooms',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'floor', type: 'int' },
        { name: 'price', type: 'int' },
      ],
    },
    {
      name: 'booking',
      fields: [
        { name: 'room_id', type: 'int', link: 'hotel_rooms', key: 'id' },
        { name: 'client_email', type: 'text' },
        { name: 'start_date', type: 'int' },
        { name: 'end_date', type: 'int' },
        { name: 'total_price', type: 'int' },
      ],
    },
  ];

  await seeder.createTables(TABLES);

  await seeder.seed({
    tableName: 'hotel_rooms',
    lines: [
      { name: 'Single room', floor: 1, price: 1000 },
      { name: 'Double room', floor: 1, price: 1000 },
      { name: 'Quad room', floor: 3, price: 1000 },
      { name: 'Twin room', floor: 3, price: 1000 },
      { name: 'President room', floor: 4, price: 1000 },
    ],
  });

  await seeder.seed({
    tableName: 'booking',
    lines: [
      {
        room_id: 1,
        client_email: 'user@mail.ru',
        start_date: 1626094709,
        end_date: 1626440309,
        total_price: 2000,
      },
      {
        room_id: 2,
        client_email: 'user2@mail.ru',
        start_date: 1625662709,
        end_date: 1625662709,
        total_price: 2000,
      },
      {
        room_id: 2,
        client_email: 'user3@mail.ru',
        start_date: 1625835509,
        end_date: 1626440309,
        total_price: 1000,
      },
      {
        room_id: 3,
        client_email: 'user3@mail.ru',
        start_date: 1627045109,
        end_date: 1627045109,
        total_price: 1000,
      },
      {
        room_id: 5,
        client_email: 'user5@mail.ru',
        start_date: 1627451465,
        end_date: 1627624265,
        total_price: 1000,
      },
    ],
  });
}

bootstrap();
