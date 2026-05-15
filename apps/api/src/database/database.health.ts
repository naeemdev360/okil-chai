import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DATABASE_TOKEN, type DatabaseInstance } from './database.tokens';

@Injectable()
export class DatabaseHealthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseHealthService.name);

  constructor(@Inject(DATABASE_TOKEN) private readonly db: DatabaseInstance) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.db.execute(sql`SELECT 1`);
      this.logger.log('Database connection verified ✓');
    } catch (error) {
      this.logger.error(
        'Cannot reach the database — application will not start.',
        error instanceof Error ? error.stack : String(error),
      );
      process.exit(1);
    }
  }
}
