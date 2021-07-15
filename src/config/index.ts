import * as dotenv from 'dotenv';

dotenv.config();

const { env = {} } = process;

// Port
export const PORT = env.PORT;

// Database connection options
export const DATABASE = {
  database: env.DATABASE_NAME,
  host: env.DATABASE_HOST,
  password: env.DATABASE_PASSWORD,
  port: env.DATBASE_PORT,
  username: env.DATABASE_USERNAME,
};

// Server response statuses
export const RESPONSE_STATUSES = {
  200: 200,
  201: 201,
  204: 204,
  400: 400,
  500: 500,
};

// Server response messages
export const SERVER_MESSAGES = {
  ok: 'OK',
  notFound: 'NOT_FOUND',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  missingData: 'MISSING_DATA',
  incorrectBookingDates: 'INCORRECT_BOOKING_DATES',
};
