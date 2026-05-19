import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env['PORT'] ?? '4000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',
  apiBaseUrl: process.env['API_BASE_URL'] ?? 'http://localhost:4000',
  name: process.env['APP_NAME'] ?? 'OkilChai',
}));
