import { registerAs } from '@nestjs/config';

export default registerAs('bkash', () => ({
  baseUrl: process.env['BKASH_BASE_URL'] ?? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
  appKey: process.env['BKASH_APP_KEY'] ?? '',
  appSecret: process.env['BKASH_APP_SECRET'] ?? '',
  username: process.env['BKASH_USERNAME'] ?? '',
  password: process.env['BKASH_PASSWORD'] ?? '',
}));
