export interface ResponseObject {
  data?: any;
  datetime: number;
  message: string;
  request: string;
  status: number | string;
}

export interface HotelRoomRecord {
  id: number;
  name: string;
  floor: number;
  price: number;
}

export interface Tables {
  name: string;
  fields: {
    name: string;
    type: string;
    link?: string;
    key?: string;
  }[];
}

export type BookRecord = {
  id: number;
  start_date: number;
  end_date: number;
  room_id: number;
  client_email: string;
  total_price?: number;
};

export type BookRoom = Omit<BookRecord, 'id'>;

export enum Months {
  'january' = 0,
  'february' = 1,
  'march' = 2,
  'april' = 3,
  'may' = 4,
  'jun' = 5,
  'july' = 6,
  'august' = 7,
  'september' = 8,
  'october' = 9,
  'november' = 10,
  'december' = 11,
}

export interface BookedRoomInfo {
  id: number;
  room_id: number;
  name: string;
  start_date: number;
  end_date: number;
  client_email: string;
  total_price: number;
}
