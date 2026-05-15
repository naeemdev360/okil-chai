import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  host: process.env['MAILER_HOST'],
  port: parseInt(process.env['MAILER_PORT'] ?? '587', 10),
  secure: process.env['MAILER_SECURE'] === 'true',
  user: process.env['MAILER_USER'],
  pass: process.env['MAILER_PASS'],
  fromName: process.env['MAILER_FROM_NAME'] ?? process.env['APP_NAME'] ?? 'OkilChai',
  fromEmail: process.env['MAILER_FROM_EMAIL'] ?? 'noreply@okilchai.com',
}));
