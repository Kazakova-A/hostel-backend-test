import countTimeDifference from './countTimeDifference';
import { BookedRoomInfo } from './types';

interface Stats {
  id: number;
  name: string;
  duration: number;
}

export default (
  array: BookedRoomInfo[],
  startDate?: number,
  endDate?: number,
): Stats[] => {
  return array.reduce((accum, item) => {
    const diffStart =
      startDate >= item.start_date ? startDate : item.start_date;
    const diffEnd = endDate <= item.end_date ? endDate : item.end_date;

    const diff = countTimeDifference(diffStart, diffEnd, 'days');

    const index = accum.findIndex((elem) => elem.room_id === item.room_id);

    const isRoomExists = index !== -1;
    const elem = isRoomExists
      ? {
          ...accum[index],
          duration: accum[index].duration + diff,
        }
      : {
          id: item.id,
          room_id: item.room_id,
          name: item.name,
          duration: diff,
        };

    if (isRoomExists) {
      accum[index] = elem;
    } else {
      accum.push(elem);
    }

    return accum;
  }, []);
};
