import { Controller, Query, Req, Res, Get } from '@nestjs/common';
import * as moment from 'moment';

import { ReportsService } from '../services/reports.servise';
import response from '../utilities/response';
import { BookedRoomInfo } from '../utilities/types';
import { MONTHS } from '../utilities/constants';
import { RESPONSE_STATUSES as rs, SERVER_MESSAGES as sm } from '../config';
import createStatsForMonth from '../utilities/createStatsForMonth';
import countTimeDifference from '../utilities/countTimeDifference';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getFreeRooms(@Req() req, @Res() res, @Query() query) {
    try {
      const stats = {};
      const { start_date, end_date } = query;
      const defaultQuery = `
        SELECT b.*, h."name"
              FROM "booking" b
              LEFT JOIN "hotel_rooms" h ON b."room_id" = h."id"
      `;

      if (!(start_date && end_date)) {
        return response(req, res, rs[400], sm.missingData);
      }

      const startMonth = new Date(start_date * 1000).getMonth();
      const endMonth = new Date(end_date * 1000).getMonth();
      const diff = countTimeDifference(start_date, end_date, 'months');

      if (diff === 0) {
        const query = `
              ${defaultQuery}
              WHERE (b."start_date" >= ${start_date} AND b."end_date" <= ${end_date})
          `;

        const bookedRooms: BookedRoomInfo[] =
          await this.reportsService.getBookedRoomByQuery(query);

        // get stats for one month
        const data = createStatsForMonth(bookedRooms);

        stats[MONTHS[startMonth]] = data;
      }

      if (diff >= 1) {
        // get the 1st day of the 2 month
        const firstMonthEndDate = moment(start_date * 1000)
          .seconds(0)
          .minute(0)
          .hours(0)
          .date(1)
          .month(startMonth);

        const firstMonthEnd = moment(firstMonthEndDate)
          .add(1, 'months')
          .format('X');

        // get stats for the first month
        const firstMonthStatsQuery = `
          ${defaultQuery}
                WHERE (b."start_date" < ${start_date} AND b."start_date" <= ${firstMonthEnd})
                OR (b."end_date" >= ${start_date} AND b."end_date" <= ${firstMonthEnd})
            `;

        const firstMonthBookedRooms: BookedRoomInfo[] =
          await this.reportsService.getBookedRoomByQuery(firstMonthStatsQuery);

        const firstMonthStats = createStatsForMonth(
          firstMonthBookedRooms,
          start_date,
          Number(firstMonthEnd),
        );

        stats[MONTHS[startMonth]] = firstMonthStats;

        if (diff > 1) {
          const startCycle = startMonth === 11 ? 0 : startMonth + 1;

          for (let i = startCycle; i !== endMonth; ) {
            const iterationMonthStartDate = moment(start_date * 1000)
              .seconds(0)
              .minute(0)
              .hours(0)
              .date(1)
              .month(i);

            const iterationMonthEndDate = moment(iterationMonthStartDate).add(
              1,
              'months',
            );

            const start = Number(iterationMonthStartDate.format('X'));
            const end = Number(iterationMonthEndDate.format('X'));
            const query = `
            ${defaultQuery}
                  WHERE (b."start_date" >= ${start} AND b."start_date" <= ${end})
                  OR (b."end_date" >= ${start} AND b."end_date" <= ${end})
              `;

            const bookedRooms: BookedRoomInfo[] =
              await this.reportsService.getBookedRoomByQuery(query);

            const statistics = createStatsForMonth(bookedRooms, start, end);
            stats[MONTHS[i]] = statistics;

            if (i === 11) i = 0;
            else i++;
          }
        }

        // get stats for the last month
        const lasMonthStartDay = moment(end_date * 1000)
          .seconds(0)
          .minute(0)
          .hours(0)
          .date(1)
          .month(endMonth)
          .format('X');

        const lastMonthStatsQuery = `
        ${defaultQuery}
              WHERE (b."start_date" < ${end_date} AND b."end_date" >= ${lasMonthStartDay})
          `;

        const lastMonthBookedRooms: BookedRoomInfo[] =
          await this.reportsService.getBookedRoomByQuery(lastMonthStatsQuery);
        const secondMonthStats = createStatsForMonth(
          lastMonthBookedRooms,
          Number(lasMonthStartDay),
          Number(end_date),
        );

        stats[MONTHS[endMonth]] = secondMonthStats;
      }

      return response(req, res, rs[200], sm.ok, stats);
    } catch (error) {
      return response(req, res, rs[500], sm.internalServerError);
    }
  }
}
