import { Controller, Query, Req, Res, Get } from '@nestjs/common';
import * as moment from 'moment';

import { ReportsService } from '../services/reports.servise';
import response from '../utilities/response';
import { BookedRoomInfo } from '../utilities/types';
import getMonthList from '../utilities/getMonthList';
import { RESPONSE_STATUSES as rs, SERVER_MESSAGES as sm } from '../config';
import createStatsForMonth from '../utilities/createStatsForMonth';
import countTimeDifference from '../utilities/countTimeDifference';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getFreeRooms(@Req() req, @Res() res, @Query() query) {
    try {
      //1637473541
      const { startDate = 1634190341, endDate = 1642743941 } = query;
      const defaultQuery = `
        SELECT b.*, h."name"
              FROM "booking" b
              LEFT JOIN "hotel_rooms" h ON b."room_id" = h."id"
      `;

      if (!(startDate && endDate)) {
        return response(req, res, rs[400], sm.missingData);
      }

      const startMonthDate = new Date(startDate * 1000).getMonth();
      const endMonthDate = new Date(endDate * 1000).getMonth();
      const diff = countTimeDifference(startDate, endDate, 'months');

      // get month, which should be in the report
      const keys = getMonthList(startMonthDate, endMonthDate);
      console.log('keys----', keys);

      if (diff === 0) {
        const query = `
              ${defaultQuery}
              WHERE (b."start_date" >= ${startDate} AND b."end_date" <= ${endDate})
          `;

        const bookedRooms: BookedRoomInfo[] =
          await this.reportsService.getBookedRoomByQuery(query);

        // get stats for one month
        const data = createStatsForMonth(bookedRooms);
      }

      if (diff > 1) {
        // get the 1st day of the 2th month
        const firstMonthEndDay = moment(startDate * 1000)
          .seconds(0)
          .minute(0)
          .hours(0)
          .date(1)
          .month(startMonthDate);

        const firstMonthEnd = moment(firstMonthEndDay)
          .add(1, 'months')
          .format('X');

        const firstPartQuery = `
          ${defaultQuery}
                WHERE (b."start_date" >= ${startDate} AND b."start_date" <= ${firstMonthEnd})
            `;
        // get stats for the first month
        const bookedRooms: BookedRoomInfo[] =
          await this.reportsService.getBookedRoomByQuery(firstPartQuery);

        const firstMonthStats = createStatsForMonth(
          bookedRooms,
          null,
          Number(firstMonthEnd),
        );

        if (diff >= 2) {
          // get stats for the second month
          const secondMonthStats = createStatsForMonth(
            bookedRooms,
            Number(firstMonthEnd),
          );
        } else {
          console.log('keys', keys);
          // TODO: add logic for getting statistic for more then 2 months
        }
      }

      // TODO: investigate the better way to create the response data structure regardless of the number of months
      // {
      //    january: [
      //      room1 : {},
      //      room2: {},
      //    ],
      //    february: [...]
      // }

      return response(req, res, rs[200], sm.ok);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }
}
