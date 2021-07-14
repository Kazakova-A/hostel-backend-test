import { Module } from '@nestjs/common';

import { RoomsService } from 'src/services/rooms.servise';

@Module({
  imports: [],
  controllers: [],
  providers: [RoomsService],
})
export class RoomModule {}
