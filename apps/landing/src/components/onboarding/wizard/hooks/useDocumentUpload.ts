'use client';

import { useCallback } from 'react';
import { DocumentType } from '@repo/shared';
import type { UpdateFn, WizardData } from '../types';

export const ACCEPTED_ATTR = '.pdf,.jpg,.jpeg,.png,.webp';
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export interface UseDocumentUploadOptions {
  readonly documents: WizardData['documents'];
  readonly documentTypes: WizardData['documentTypes'];
  readonly update: UpdateFn;
}

export interface UseDocumentUploadReturn {
  readonly addFiles: (files: readonly File[]) => void;
  readonly removeFile: (idx: number) => void;
  readonly changeDocType: (idx: number, type: DocumentType) => void;
}

export function useDocumentUpload({
  documents,
  documentTypes,
  update,
}: UseDocumentUploadOptions): UseDocumentUploadReturn {
  const addFiles = useCallback(
    (incoming: readonly File[]) => {
      update('documents', [...documents, ...incoming]);
      update('documentTypes', [
        ...documentTypes,
        ...incoming.map(() => DocumentType.BAR_CERTIFICATE),
      ]);
    },
    [documents, documentTypes, update],
  );

  const removeFile = useCallback(
    (idx: number) => {
      update('documents', documents.filter((_, i) => i !== idx));
      update('documentTypes', documentTypes.filter((_, i) => i !== idx));
    },
    [documents, documentTypes, update],
  );

  const changeDocType = useCallback(
    (idx: number, type: DocumentType) => {
      const next = [...documentTypes] as DocumentType[];
      next[idx] = type;
      update('documentTypes', next);
    },
    [documentTypes, update],
  );

  return { addFiles, removeFile, changeDocType };
}
