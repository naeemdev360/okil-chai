'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { UpdateFn } from '../types';

export const ACCEPTED_PHOTO_ATTR = '.jpg,.jpeg,.png,.webp';
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export interface UsePhotoUploadOptions {
  readonly update: UpdateFn;
}

export interface UsePhotoUploadReturn {
  readonly previewUrl: string | null;
  readonly applyFile: (file: File) => void;
  readonly removePhoto: () => void;
}

export function usePhotoUpload({ update }: UsePhotoUploadOptions): UsePhotoUploadReturn {
  const previewUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const applyFile = useCallback(
    (file: File) => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewUrl(url);
      update('photo', file);
    },
    [update],
  );

  const removePhoto = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    update('photo', null);
  }, [update]);

  return { previewUrl, applyFile, removePhoto };
}
