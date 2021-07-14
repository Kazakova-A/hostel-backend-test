import { Module } from '@nestjs/common';

import { AppController } from 'src/controllers/app.controller';
import { AppService } from 'src/services/app.service';
import { RoomsController } from 'src/controllers/rooms.controller';
import { RoomsService } from 'src/services/rooms.servise';

@Module({
  imports: [],
  controllers: [AppController, RoomsController],
  providers: [AppService, RoomsService],
})
export class AppModule {}
