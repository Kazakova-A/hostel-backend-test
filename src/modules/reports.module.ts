import { Module } from '@nestjs/common';

import { ReportsService } from '../services/reports.servise';

@Module({
  imports: [],
  controllers: [],
  providers: [ReportsService],
})
export class ReportsModule {}
