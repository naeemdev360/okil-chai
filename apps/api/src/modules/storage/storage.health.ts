import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageHealthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(StorageHealthService.name);

  constructor(private readonly configService: ConfigService) {}

  async onApplicationBootstrap(): Promise<void> {
    const provider = this.configService.get<string>('storage.provider', 'azure');

    try {
      switch (provider) {
        case 'azure':
          await this.checkAzure();
          break;
        default:
          this.logger.warn(`No health check implemented for provider "${provider}"`);
      }
    } catch (error) {
      this.logger.error(
        'Storage connection failed — application will not start.',
        error instanceof Error ? error.stack : String(error),
      );
      process.exit(1);
    }
  }

  private async checkAzure(): Promise<void> {
    const connectionString = this.configService.getOrThrow<string>('storage.azure.connectionString');
    const containerName = this.configService.getOrThrow<string>('storage.azure.containerName');

    const client = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = client.getContainerClient(containerName);

    const exists = await containerClient.exists();
    if (!exists) {
      await containerClient.create();
      this.logger.log(`Storage container "${containerName}" created ✓`);
    } else {
      this.logger.log(`Storage connection verified (Azure Blob — "${containerName}") ✓`);
    }
  }
}
