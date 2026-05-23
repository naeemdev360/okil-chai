'use client';

import { useCallback, useRef, useState } from 'react';
import { DocumentType } from '@repo/shared';
import type { UpdateFn, WizardData } from '../types';

export const ACCEPTED_MIME = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);
export const ACCEPTED_ATTR = '.pdf,.jpg,.jpeg,.png,.webp';
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export interface UseDocumentUploadOptions {
  readonly documents: WizardData['documents'];
  readonly documentTypes: WizardData['documentTypes'];
  readonly update: UpdateFn;
  readonly t: (key: string, values?: Record<string, string>) => string;
}

export interface UseDocumentUploadReturn {
  readonly inputRef: React.RefObject<HTMLInputElement | null>;
  readonly isDragOver: boolean;
  readonly fileErrors: readonly string[];
  readonly handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  readonly handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  readonly handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  readonly handleDragLeave: () => void;
  readonly handleZoneKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  readonly openFilePicker: () => void;
  readonly removeFile: (idx: number) => void;
  readonly changeDocType: (idx: number, type: DocumentType) => void;
}

export function useDocumentUpload({
  documents,
  documentTypes,
  update,
  t,
}: UseDocumentUploadOptions): UseDocumentUploadReturn {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid: File[] = [];
    const errs: string[] = [];

    Array.from(incoming).forEach((file) => {
      if (file.size > MAX_FILE_BYTES) {
        errs.push(t('fileTooLarge', { name: file.name }));
        return;
      }
      if (!ACCEPTED_MIME.has(file.type)) {
        errs.push(t('fileInvalidType', { name: file.name }));
        return;
      }
      valid.push(file);
    });

    setFileErrors(errs);
    if (valid.length === 0) return;

    update('documents', [...documents, ...valid]);
    update('documentTypes', [
      ...documentTypes,
      ...valid.map(() => DocumentType.BAR_CERTIFICATE),
    ]);
  }, [documents, documentTypes, update, t]);

  const removeFile = useCallback((idx: number) => {
    update('documents', documents.filter((_, i) => i !== idx));
    update('documentTypes', documentTypes.filter((_, i) => i !== idx));
  }, [documents, documentTypes, update]);

  const changeDocType = useCallback((idx: number, type: DocumentType) => {
    const next = [...documentTypes] as DocumentType[];
    next[idx] = type;
    update('documentTypes', next);
  }, [documentTypes, update]);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = '';
  }, [addFiles]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleZoneKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') openFilePicker();
  }, [openFilePicker]);

  return {
    inputRef,
    isDragOver,
    fileErrors,
    handleInputChange,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleZoneKeyDown,
    openFilePicker,
    removeFile,
    changeDocType,
  };
}
