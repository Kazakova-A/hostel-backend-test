import * as moment from 'moment';

export default (
  startDate: number,
  endDate: number,
  type?: 'days' | 'months',
) => {
  const diff = moment(endDate * 1000).diff(startDate * 1000);
  const difference =
    type === 'days'
      ? moment.duration(diff).asDays()
      : moment.duration(diff).months();

  return Math.abs(difference);
};
