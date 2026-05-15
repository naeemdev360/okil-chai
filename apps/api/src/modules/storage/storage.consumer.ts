import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { STORAGE_JOB, STORAGE_QUEUE } from './storage.constants';
import type { PostProcessJob } from './interfaces/storage.interfaces';

@Processor(STORAGE_QUEUE)
export class StorageConsumer extends WorkerHost {
  private readonly logger = new Logger(StorageConsumer.name);

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case STORAGE_JOB.POST_PROCESS:
        await this.processPostProcess(job.data as PostProcessJob);
        break;
      default:
        this.logger.warn(`Unhandled storage job: ${job.name}`);
    }
  }

  private async processPostProcess({ key, mimeType }: PostProcessJob): Promise<void> {
    // Placeholder — add image compression, virus scanning, metadata extraction here
    this.logger.log(`Post-processed → ${key} (${mimeType})`);
  }
}
