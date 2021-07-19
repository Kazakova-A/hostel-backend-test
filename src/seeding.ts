import { NestFactory } from '@nestjs/core';

import { SeederModule } from './modules/database.module';
import { DatabaseService } from './services/database.service';

async function bootstrap() {
  const client = await NestFactory.createApplicationContext(SeederModule);
  const seeder = client.get(DatabaseService);

  const rooms = [
    { name: 'Single room', floor: 1, price: 1000 },
    { name: 'Double room', floor: 1, price: 1000 },
    { name: 'Quad room', floor: 3, price: 1000 },
    { name: 'Twin room', floor: 3, price: 1000 },
    { name: 'President room', floor: 4, price: 1000 },
  ];

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
        { name: 'start_date', type: 'bigint' },
        { name: 'end_date', type: 'bigint' },
        { name: 'total_price', type: 'int' },
      ],
    },
  ];

  await seeder.createTables(TABLES);

  await seeder.seed({
    tableName: 'hotel_rooms',
    lines: rooms,
  });

  for (let i = 1; i <= 5; i++) {
    await seeder.seedBooking(i);
  }
}

bootstrap();
