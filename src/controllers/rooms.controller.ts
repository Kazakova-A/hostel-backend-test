import { Body, Controller, Query, Req, Res, Get, Post } from '@nestjs/common';

import { RESPONSE_STATUSES as rs, SERVER_MESSAGES as sm } from '../config';
import { RoomsService } from '../services/rooms.servise';
import response from '../utilities/response';
import { VALIDATED_WEEK_DAYS, DISCOUNTS } from '../utilities/constants';
import countDaysDifference from '../utilities/countTimeDifference';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async getFreeRooms(@Req() req, @Res() res, @Query() query) {
    try {
      const { startDate, endDate } = query;

      if (!(startDate && endDate)) {
        return response(req, res, rs[400], sm.missingData);
      }
      const result = await this.roomsService.getFreeRooms(
        Number(startDate),
        Number(endDate),
      );

      return response(req, res, rs[200], sm.ok, result);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }

  @Post()
  async bookRoom(@Req() req, @Res() res, @Body() body) {
    try {
      const { startDate, endDate, roomId, email } = body;

      if (!(startDate && endDate && roomId && email)) {
        return response(req, res, rs[400], sm.missingData);
      }

      // check if room record exists in the database
      const roomRecord = await this.roomsService.getRoomById(roomId);

      if (!roomRecord) {
        return response(req, res, rs[404], sm.notFound);
      }

      //check if start and end date are valid
      const startWeekDay = new Date(startDate * 1000).getDay();
      const endWeekDay = new Date(endDate * 1000).getDay();

      if (
        VALIDATED_WEEK_DAYS[startWeekDay] ||
        VALIDATED_WEEK_DAYS[endWeekDay]
      ) {
        return response(req, res, rs[400], sm.incorrectBookingDates);
      }

      const diffInDays = countDaysDifference(startDate, endDate, 'days');

      const discount =
        10 <= diffInDays && diffInDays < 20
          ? DISCOUNTS[10]
          : diffInDays > 20
          ? DISCOUNTS[20]
          : 1;

      const totalPrice = roomRecord.price * diffInDays * discount;

      const bookedRooms = await this.roomsService.getBookedRooms(
        startDate,
        endDate,
      );

      const isRoomBooked = bookedRooms.includes(roomId);

      if (isRoomBooked) {
        return response(req, res, rs[400], sm.alreadyExists);
      }

      await this.roomsService.bookRoom({
        startDate,
        endDate,
        roomId,
        email,
        price: totalPrice,
      });

      return response(req, res, rs[201], sm.ok);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }
}
