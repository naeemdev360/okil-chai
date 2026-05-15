import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { STORAGE_JOB, STORAGE_QUEUE } from './storage.constants';
import type { IStorageProducer, PostProcessJob } from './interfaces/storage.interfaces';

@Injectable()
export class StorageProducer implements IStorageProducer {
  constructor(@InjectQueue(STORAGE_QUEUE) private readonly queue: Queue) {}

  async enqueuePostProcess(data: PostProcessJob): Promise<void> {
    await this.queue.add(STORAGE_JOB.POST_PROCESS, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3_000 },
      removeOnComplete: true,
      removeOnFail: 50,
    });
  }
}
