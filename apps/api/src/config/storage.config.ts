import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  provider: process.env['STORAGE_PROVIDER'] ?? 'azure',
  azure: {
    connectionString: process.env['STORAGE_AZURE_CONNECTION_STRING'],
    containerName: process.env['STORAGE_AZURE_CONTAINER_NAME'] ?? 'okil-chai',
    cdnUrl: process.env['STORAGE_AZURE_CDN_URL'],
  },
}));
