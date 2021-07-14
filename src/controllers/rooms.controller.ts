import { Controller, Get } from '@nestjs/common';
import { RoomsService } from 'src/services/rooms.servise';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  getFreeRooms(): string {
    return this.roomsService.getFreeRooms();
  }
}
