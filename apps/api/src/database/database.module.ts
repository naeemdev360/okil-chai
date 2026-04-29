import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DATABASE_TOKEN = Symbol('DATABASE');
export type DatabaseInstance = ReturnType<typeof drizzle<typeof schema>>;

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DatabaseInstance => {
        const pool = new Pool({
          connectionString: configService.get<string>('database.url'),
          max: configService.get<number>('database.maxConnections'),
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DATABASE_TOKEN],
})
export class DatabaseModule {}
