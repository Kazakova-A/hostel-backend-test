import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomsService {
  getFreeRooms(): string {
    return 'Get free room request';
  }
}
