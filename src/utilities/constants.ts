export const VALIDATED_WEEK_DAYS = {
  [1]: true,
  [2]: false,
  [3]: false,
  [4]: true,
  [5]: false,
  [6]: false,
  [0]: false,
};

export const DISCOUNTS = {
  [10]: 0.9,
  [20]: 0.8,
};

export const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'jun',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export const ROOMS_FIELDS = [
  { name: 'name', type: 'text' },
  { name: 'floor', type: 'int' },
  { name: 'price', type: 'int' },
];

export const ROOMS = [
  { name: 'Single room', floor: 1, price: 1000 },
  { name: 'Double room', floor: 1, price: 1000 },
  { name: 'Quad room', floor: 3, price: 1000 },
  { name: 'Twin room', floor: 3, price: 1000 },
  { name: 'President room', floor: 4, price: 1000 },
];

export const BOOKED_ROOMS_FIELD = [
  { name: 'room_id', type: 'int', link: 'hotel_rooms', key: 'id' },
  { name: 'client_email', type: 'text' },
  { name: 'start_date', type: 'bigint' },
  { name: 'end_date', type: 'bigint' },
  { name: 'total_price', type: 'int' },
];
