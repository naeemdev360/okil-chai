'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { UpdateFn } from '../types';

export const ACCEPTED_PHOTO_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const ACCEPTED_PHOTO_ATTR = '.jpg,.jpeg,.png,.webp';
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export interface UsePhotoUploadOptions {
  readonly update: UpdateFn;
  readonly t: (key: string, values?: Record<string, string>) => string;
}

export interface UsePhotoUploadReturn {
  readonly inputRef: React.RefObject<HTMLInputElement | null>;
  readonly previewUrl: string | null;
  readonly isDragOver: boolean;
  readonly fileError: string | null;
  readonly openPicker: () => void;
  readonly removePhoto: () => void;
  readonly handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  readonly handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  readonly handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  readonly handleDragLeave: () => void;
  readonly handleZoneKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export function usePhotoUpload({ update, t }: UsePhotoUploadOptions): UsePhotoUploadReturn {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const applyFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_PHOTO_MIME.has(file.type)) {
        setFileError(t('photoInvalidType', { name: file.name }));
        return;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        setFileError(t('photoTooLarge', { name: file.name }));
        return;
      }
      setFileError(null);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewUrl(url);
      update('photo', file);
    },
    [update, t],
  );

  const removePhoto = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setFileError(null);
    update('photo', null);
  }, [update]);

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) applyFile(file);
      e.target.value = '';
    },
    [applyFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) applyFile(file);
    },
    [applyFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleZoneKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') openPicker();
    },
    [openPicker],
  );

  return {
    inputRef,
    previewUrl,
    isDragOver,
    fileError,
    openPicker,
    removePhoto,
    handleInputChange,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleZoneKeyDown,
  };
}
