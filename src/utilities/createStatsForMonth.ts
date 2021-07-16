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
    const diff = countTimeDifference(
      startDate || item.start_date,
      endDate || item.end_date,
    );

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
