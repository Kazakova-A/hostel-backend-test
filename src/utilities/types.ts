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
