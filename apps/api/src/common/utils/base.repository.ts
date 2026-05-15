import type { DatabaseInstance } from '../../database/database.module';
import { executeDbOperation, type UniqueViolationOptions } from './db-errors.util';

/** Shared transaction type — import this in every repository instead of re-deriving it. */
export type Tx = Parameters<Parameters<DatabaseInstance['transaction']>[0]>[0];

/**
 * Abstract base for all Drizzle repositories.
 * Provides the db instance and shared transaction helpers.
 * Concrete repos inject DATABASE_TOKEN and pass it to super().
 */
export abstract class BaseRepository {
  protected readonly db: DatabaseInstance;

  constructor(db: DatabaseInstance) {
    this.db = db;
  }

  /** Run a set of queries in a single transaction. */
  protected transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
    return this.db.transaction(fn);
  }

  /** Run a transaction and convert a unique-constraint violation into a ConflictException. */
  protected transactionGuarded<T>(
    fn: (tx: Tx) => Promise<T>,
    onUniqueViolation: UniqueViolationOptions,
  ): Promise<T> {
    return executeDbOperation(() => this.db.transaction(fn), onUniqueViolation);
  }

  /** Run a single query and convert a unique-constraint violation into a ConflictException. */
  protected queryGuarded<T>(
    fn: () => Promise<T>,
    onUniqueViolation: UniqueViolationOptions,
  ): Promise<T> {
    return executeDbOperation(fn, onUniqueViolation);
  }
}
