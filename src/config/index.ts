import * as dotenv from 'dotenv';

dotenv.config();

const { env = {} } = process;

//Port
export const PORT = env.PORT;

// Database connection options
export const DATABASE = {
  database: env.DATABASE_NAME,
  host: env.DATABASE_HOST,
  password: env.DATABASE_PASSWORD,
  port: env.DATBASE_PORT,
  username: env.DATABASE_USERNAME,
};
