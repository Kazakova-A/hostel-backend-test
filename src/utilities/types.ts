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

export interface BookRoom {
  startDate: number;
  endDate: number;
  roomId: number;
  email: string;
  price?: number;
}
