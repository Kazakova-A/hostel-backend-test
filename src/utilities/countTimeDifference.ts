import * as moment from 'moment';

export default (
  startDate: number,
  endDate: number,
  type?: 'days' | 'months',
) => {
  const diff = moment(endDate * 1000).diff(startDate * 1000);
  const diffInDays =
    type === 'days'
      ? moment.duration(diff).days()
      : moment.duration(diff).months();

  return Math.abs(diffInDays);
};
