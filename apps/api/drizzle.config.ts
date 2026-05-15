import * as dotenv from "dotenv";
import type { Config } from 'drizzle-kit';

dotenv.config({
  path: '.env.dev',
});

console.log(process.env['DATABASE_URL']);

export default {
  schema: './src/database/schema/index.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },
} satisfies Config;
