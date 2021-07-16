import { MONTHS } from './constants';

export default (startMonthDate: number, endMonthDate: number) => {
  const list = [];
  for (let i = startMonthDate; i <= endMonthDate; i++) {
    list.push(MONTHS[i]);
  }

  return list;
};
