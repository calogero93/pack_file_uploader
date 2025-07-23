import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "./schema";

import dotenv from "dotenv";
dotenv.config();

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.MYDATABASE_URL,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
