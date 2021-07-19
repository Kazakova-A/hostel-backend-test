import { Module } from '@nestjs/common';

import { DatabaseService } from '../services/database.service';
import { RoomsService } from 'src/services/rooms.servise';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseService, RoomsService],
})
export class SeederModule {}
