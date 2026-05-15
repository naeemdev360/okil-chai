import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STORAGE_QUEUE, STORAGE_PROVIDER } from './storage.constants';
import { STORAGE_PRODUCER, STORAGE_SERVICE, type IStorageService } from './interfaces/storage.interfaces';
import { AzureBlobStorageService } from './providers/azure-blob.service';
import { StorageConsumer } from './storage.consumer';
import { StorageHealthService } from './storage.health';
import { StorageProducer } from './storage.producer';

@Global()
@Module({
  imports: [BullModule.registerQueue({ name: STORAGE_QUEUE })],
  providers: [
    {
      provide: STORAGE_SERVICE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): IStorageService => {
        const provider = config.get<string>('storage.provider', STORAGE_PROVIDER.AZURE);
        switch (provider) {
          case STORAGE_PROVIDER.AZURE:
            return new AzureBlobStorageService(config);
          default:
            throw new Error(`Unknown storage provider: "${provider}". Add it to StorageModule.`);
        }
      },
    },
    StorageProducer,
    { provide: STORAGE_PRODUCER, useExisting: StorageProducer },
    StorageConsumer,
    StorageHealthService,
  ],
  exports: [STORAGE_SERVICE, STORAGE_PRODUCER],
})
export class StorageModule {}
