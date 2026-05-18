import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
