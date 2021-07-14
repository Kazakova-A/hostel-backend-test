import { NestFactory } from '@nestjs/core';

import { SeederModule } from 'src/modules/database.module';
import { DatabaseService } from 'src/services/database.service';

async function bootstrap() {
  const client = await NestFactory.createApplicationContext(SeederModule);
  const seeder = client.get(DatabaseService);

  const TABLES = [
    {
      name: 'hotel_rooms',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'floor', type: 'int' },
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
      { name: 'Single room', floor: 1 },
      { name: 'Double room', floor: 1 },
      { name: 'Quad room', floor: 3 },
      { name: 'Twin room', floor: 3 },
      { name: 'President room', floor: 4 },
    ],
  });

  await seeder.seed({
    tableName: 'booking',
    lines: [
      {
        room_id: 1,
        client_email: 'user@mail.ru',
        start_date: 1626426763,
        end_date: 1626599563,
        total_price: 2000,
      },
      {
        room_id: 2,
        client_email: 'user2@mail.ru',
        start_date: 1626426763,
        end_date: 1626599563,
        total_price: 2000,
      },
      {
        room_id: 2,
        client_email: 'user3@mail.ru',
        start_date: 1626772363,
        end_date: 1626858763,
        total_price: 1000,
      },
    ],
  });
}

bootstrap();
