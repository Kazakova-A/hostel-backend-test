import { Module } from '@nestjs/common';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { RoomsController } from '../controllers/rooms.controller';
import { RoomsService } from '../services/rooms.servise';

@Module({
  imports: [],
  controllers: [AppController, RoomsController],
  providers: [AppService, RoomsService],
})
export class AppModule {}
