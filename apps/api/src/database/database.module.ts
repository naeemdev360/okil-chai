import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { DatabaseHealthService } from './database.health';
import { DATABASE_TOKEN, type DatabaseInstance } from './database.tokens';

export { DATABASE_TOKEN, type DatabaseInstance } from './database.tokens';

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
    DatabaseHealthService,
  ],
  exports: [DATABASE_TOKEN],
})
export class DatabaseModule {}
