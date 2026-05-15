import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BlobServiceClient,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import * as path from 'path';
import * as crypto from 'crypto';
import type { IStorageService, UploadInput, UploadResult } from '../interfaces/storage.interfaces';

@Injectable()
export class AzureBlobStorageService implements IStorageService {
  private readonly logger = new Logger(AzureBlobStorageService.name);
  private readonly client: BlobServiceClient;
  private readonly containerName: string;
  private readonly cdnUrl: string | undefined;

  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('storage.azure.connectionString');
    this.containerName = configService.getOrThrow<string>('storage.azure.containerName');
    this.cdnUrl = configService.get<string>('storage.azure.cdnUrl');
    this.client = BlobServiceClient.fromConnectionString(connectionString);
  }

  async upload({ file, folder }: UploadInput): Promise<UploadResult> {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    const key = `${folder}/${uniqueName}`;

    const containerClient = this.client.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(key);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    this.logger.log(`Uploaded → ${key} (${file.size} bytes)`);

    return {
      key,
      url: this.resolvePublicUrl(key, blockBlobClient.url),
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async delete(key: string): Promise<void> {
    const containerClient = this.client.getContainerClient(this.containerName);
    await containerClient.getBlockBlobClient(key).deleteIfExists();
    this.logger.log(`Deleted → ${key}`);
  }

  async getSignedUrl(key: string, expirySeconds = 3_600): Promise<string> {
    const containerClient = this.client.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlobClient(key);

    const credential = this.client.credential;
    if (!(credential instanceof StorageSharedKeyCredential)) {
      // Connection strings with SAS tokens don't support generating new SAS — fall back to blob URL
      return blobClient.url;
    }

    const expiresOn = new Date(Date.now() + expirySeconds * 1_000);
    const sas = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName: key,
        permissions: BlobSASPermissions.parse('r'),
        expiresOn,
      },
      credential,
    ).toString();

    return `${blobClient.url}?${sas}`;
  }

  private resolvePublicUrl(key: string, blobUrl: string): string {
    if (this.cdnUrl) return `${this.cdnUrl.replace(/\/$/, '')}/${key}`;
    return blobUrl;
  }
}
