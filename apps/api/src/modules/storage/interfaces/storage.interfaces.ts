export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');
export const STORAGE_PRODUCER = Symbol('STORAGE_PRODUCER');

export interface UploadInput {
  readonly file: Express.Multer.File;
  /** Logical folder, e.g. 'avatars' | 'lawyer-documents' | 'chat-attachments' */
  readonly folder: string;
}

export interface UploadResult {
  readonly key: string;
  readonly url: string;
  readonly size: number;
  readonly mimeType: string;
}

export interface PostProcessJob {
  readonly key: string;
  readonly mimeType: string;
}

export interface IStorageService {
  upload(input: UploadInput): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expirySeconds?: number): Promise<string>;
}

export interface IStorageProducer {
  enqueuePostProcess(data: PostProcessJob): Promise<void>;
}
