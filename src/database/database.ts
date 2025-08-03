import { Pool } from "pg";

const pgPool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
});

export const database = async (scripts: any, query: any) => {
  try {
    const result = await pgPool.query(scripts, query);
    return result;
  } catch (error: any) {
    throw new error(error);
  }
};
