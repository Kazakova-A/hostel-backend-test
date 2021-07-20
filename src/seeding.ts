import { NestFactory } from '@nestjs/core';

import { SeederModule } from './modules/database.module';
import { DatabaseService } from './services/database.service';
import { ROOMS_FIELDS, ROOMS, BOOKED_ROOMS_FIELD } from './utilities/constants';

async function bootstrap() {
  const client = await NestFactory.createApplicationContext(SeederModule);
  const seeder = client.get(DatabaseService);

  const TABLES = [
    {
      name: 'hotel_rooms',
      fields: ROOMS_FIELDS,
    },
    {
      name: 'booking',
      fields: BOOKED_ROOMS_FIELD,
    },
  ];

  await seeder.createTables(TABLES);

  await seeder.seed({
    tableName: 'hotel_rooms',
    lines: ROOMS,
  });

  for (let i = 1; i <= 5; i++) {
    await seeder.seedBooking(i);
  }
}

bootstrap();
