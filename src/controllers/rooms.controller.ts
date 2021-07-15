import { Body, Controller, Query, Req, Res, Get, Post } from '@nestjs/common';
import * as moment from 'moment';

import { RESPONSE_STATUSES as rs, SERVER_MESSAGES as sm } from 'src/config';
import { RoomsService } from 'src/services/rooms.servise';
import response from 'src/utilities/response';

enum WeekDays {
  monday = 1,
  tuesday = 2,
  wednesday = 3,
  thursday = 4,
  friday = 5,
  saturday = 6,
  sunday = 7,
}

const discounts = {
  [10]: 0.9,
  [20]: 0.8,
};

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
      const startWeekDay = moment(startDate * 1000).isoWeekday();
      const endWeekDay = moment(endDate * 1000).isoWeekday();

      if (
        startWeekDay === WeekDays.monday ||
        startWeekDay === WeekDays.thursday ||
        endWeekDay === WeekDays.monday ||
        endWeekDay === WeekDays.thursday
      ) {
        return response(req, res, rs[400], sm.incorrectBookingDates);
      }

      const diff = moment(endDate * 1000).diff(startDate * 1000);
      const diffInDays = moment.duration(diff).days();

      const discount =
        10 <= diffInDays && diffInDays < 20
          ? discounts[10]
          : diffInDays > 20
          ? discounts[20]
          : 1;

      const totalPrice = roomRecord.price * diffInDays * discount;

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
