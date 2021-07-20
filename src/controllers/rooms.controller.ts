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
      const { start_date, end_date } = query;

      if (!(start_date && end_date)) {
        return response(req, res, rs[400], sm.missingData);
      }
      const result = await this.roomsService.getFreeRooms(
        Number(start_date),
        Number(end_date),
      );

      return response(req, res, rs[200], sm.ok, result);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }

  @Post()
  async bookRoom(@Req() req, @Res() res, @Body() body) {
    try {
      const { start_date, end_date, room_id, client_email } = body;

      if (!(start_date && end_date && room_id && client_email)) {
        return response(req, res, rs[400], sm.missingData);
      }

      // check if room record exists in the database
      const roomRecord = await this.roomsService.getRoomById(room_id);

      if (!roomRecord) {
        return response(req, res, rs[404], sm.notFound);
      }

      //check if start and end date are valid
      const startWeekDay = new Date(start_date * 1000).getDay();
      const endWeekDay = new Date(end_date * 1000).getDay();

      if (
        VALIDATED_WEEK_DAYS[startWeekDay] ||
        VALIDATED_WEEK_DAYS[endWeekDay]
      ) {
        return response(req, res, rs[400], sm.incorrectBookingDates);
      }

      const diffInDays = countDaysDifference(start_date, end_date, 'days');

      const discount =
        10 <= diffInDays && diffInDays < 20
          ? DISCOUNTS[10]
          : diffInDays > 20
          ? DISCOUNTS[20]
          : 1;

      const totalPrice = roomRecord.price * diffInDays * discount;

      const bookedRooms = await this.roomsService.getBookedRooms(
        start_date,
        end_date,
      );

      const isRoomBooked = bookedRooms.includes(room_id);

      if (isRoomBooked) {
        return response(req, res, rs[400], sm.alreadyExists);
      }

      const result = await this.roomsService.bookRoom({
        start_date,
        end_date,
        room_id,
        client_email,
        total_price: totalPrice,
      });

      return response(req, res, rs[201], sm.ok, result);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }
}
