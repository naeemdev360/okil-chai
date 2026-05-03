import { registerAs } from '@nestjs/config';

export default registerAs('brand', () => ({
  name: process.env['APP_NAME'] ?? 'OkilChai',
  tagline: process.env['APP_TAGLINE'] ?? 'Find a Lawyer. Book in Minutes.',
  domain: process.env['APP_DOMAIN'] ?? 'okilchai.com',
  emailFrom: process.env['EMAIL_FROM'] ?? 'noreply@okilchai.com',
  legalDisclaimer:
    process.env['APP_LEGAL_DISCLAIMER'] ??
    `${process.env['APP_NAME'] ?? 'OkilChai'} is not a law firm and does not provide legal advice.`,
}));
