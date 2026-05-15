import { ConflictException, InternalServerErrorException } from '@nestjs/common';

// PostgreSQL error codes we handle at the repository boundary
const PG_UNIQUE_VIOLATION = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';
const PG_NOT_NULL_VIOLATION = '23502';

function getPostgresCode(error: unknown): string | null {
  if (error !== null && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: unknown }).code;
    return typeof code === 'string' ? code : null;
  }
  return null;
}

export interface UniqueViolationOptions {
  readonly message: string;
  readonly errorCode: string;
}

/**
 * Wraps a DB operation and converts PostgreSQL constraint violations into
 * typed NestJS HTTP exceptions. All unrecognized errors are re-thrown as-is.
 */
export async function executeDbOperation<T>(
  operation: () => Promise<T>,
  onUniqueViolation?: UniqueViolationOptions,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const code = getPostgresCode(error);

    if (code === PG_UNIQUE_VIOLATION && onUniqueViolation) {
      throw new ConflictException({
        message: onUniqueViolation.message,
        errorCode: onUniqueViolation.errorCode,
      });
    }

    if (code === PG_FOREIGN_KEY_VIOLATION) {
      throw new InternalServerErrorException({
        message: 'Referenced resource does not exist',
        errorCode: 'FOREIGN_KEY_VIOLATION',
      });
    }

    if (code === PG_NOT_NULL_VIOLATION) {
      throw new InternalServerErrorException({
        message: 'A required field is missing',
        errorCode: 'NOT_NULL_VIOLATION',
      });
    }

    throw error;
  }
}
