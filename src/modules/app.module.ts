import { Module } from '@nestjs/common';

import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { RoomsController } from '../controllers/rooms.controller';
import { RoomsService } from '../services/rooms.servise';
import { ReportsController } from '../controllers/reports.controller';
import { ReportsService } from '../services/reports.servise';

@Module({
  imports: [],
  controllers: [AppController, RoomsController, ReportsController],
  providers: [AppService, RoomsService, ReportsService],
})
export class AppModule {}
