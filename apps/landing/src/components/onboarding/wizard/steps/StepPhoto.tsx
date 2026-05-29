'use client';

import { Check, Trash2, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FileDropzone } from '@repo/ui';
import { ACCEPTED_PHOTO_ATTR, MAX_PHOTO_BYTES, usePhotoUpload } from '../hooks/usePhotoUpload';
import type { StepProps } from '../types';

export function StepPhoto({ data, update, errors }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');

  const { previewUrl, applyFile, removePhoto } = usePhotoUpload({ update });

  const initials =
    data.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

  const bullets = t.raw('almostDoneBullets') as string[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6 items-center">
        <div className="shrink-0 relative">
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt={data.fullName}
                className="size-36 rounded-full object-cover border-4 border-gold"
              />
              <button
                type="button"
                onClick={removePhoto}
                aria-label={t('removePhoto')}
                className="absolute -top-1 -right-1 size-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <div className="size-36 rounded-full bg-navy-mid flex items-center justify-center font-heading font-bold text-4xl text-white border-4 border-gold">
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-heading text-lg font-semibold text-navy mb-1.5">
            {t('addPhoto')}
          </h3>
          <p className="font-sans text-sm text-gray-600 leading-relaxed mb-4">
            {t('photoBody')}
          </p>

          <FileDropzone
            theme="gold"
            size="sm"
            accept={ACCEPTED_PHOTO_ATTR}
            maxSizeBytes={MAX_PHOTO_BYTES}
            hasError={!!errors?.['photo']}
            onFilesAccepted={(files) => { if (files[0]) applyFile(files[0]); }}
            label={data.photo ? t('changePhoto') : t('uploadPhoto')}
          >
            <div className="flex flex-col items-center text-center gap-1.5 pointer-events-none">
              <Upload className="size-5 text-gold" strokeWidth={1.6} aria-hidden="true" />
              <p className="font-sans text-sm font-medium text-navy">
                {data.photo ? t('changePhoto') : t('uploadPhoto')}
              </p>
              <p className="font-sans text-xs text-gray-400">{t('photoSpec')}</p>
            </div>
          </FileDropzone>
        </div>
      </div>

      {errors?.['photo'] && (
        <p role="alert" className="font-sans text-xs text-error -mt-2">
          {errors['photo']}
        </p>
      )}

      <div className="p-5 bg-gold-pale rounded-lg border border-gold/40">
        <p className="font-heading text-base font-semibold text-navy mb-3">
          {t('almostDone')}
        </p>
        <ul className="list-none flex flex-col gap-1.5">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 font-sans text-sm text-gray-800"
            >
              <Check
                className="size-3.5 text-gold shrink-0 mt-0.5"
                strokeWidth={2.4}
                aria-hidden="true"
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
