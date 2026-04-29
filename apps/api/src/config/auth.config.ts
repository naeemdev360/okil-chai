import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env['JWT_SECRET'],
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '15m',
  refreshSecret: process.env['JWT_REFRESH_SECRET'],
  refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
  googleClientId: process.env['GOOGLE_CLIENT_ID'],
  googleClientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  googleCallbackUrl: process.env['GOOGLE_CALLBACK_URL'],
  facebookAppId: process.env['FACEBOOK_APP_ID'],
  facebookAppSecret: process.env['FACEBOOK_APP_SECRET'],
  facebookCallbackUrl: process.env['FACEBOOK_CALLBACK_URL'],
}));
