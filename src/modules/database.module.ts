import { Module } from '@nestjs/common';

import { DatabaseService } from 'src/services/database.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseService],
})
export class SeederModule {}
