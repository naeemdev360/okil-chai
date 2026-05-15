import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const DATABASE_TOKEN = Symbol('DATABASE');

export type DatabaseInstance = ReturnType<typeof drizzle<typeof schema>>;
