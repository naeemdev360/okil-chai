'use client';

import { DocumentStatus, DocumentType } from '@repo/shared';
import { Badge, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, cn, formatBytes } from '@repo/ui';
import type { BadgeProps } from '@repo/ui';
import { Check, FileText, Loader2, Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BAR_COUNCILS } from '../constants';
import { ACCEPTED_ATTR, useDocumentUpload } from '../hooks/useDocumentUpload';
import type { StepProps } from '../types';
import { Field } from '../ui';

const STATUS_VARIANT: Record<DocumentStatus, BadgeProps['variant']> = {
  [DocumentStatus.PENDING]:  'pending',
  [DocumentStatus.APPROVED]: 'available',
  [DocumentStatus.REJECTED]: 'cancelled',
};

const DOC_TYPE_OPTIONS: Array<{ value: DocumentType; labelKey: string }> = [
  { value: DocumentType.BAR_CERTIFICATE, labelKey: 'docType.barCertificate' },
  { value: DocumentType.LAW_DEGREE,      labelKey: 'docType.lawDegree'      },
  { value: DocumentType.GOVERNMENT_ID,   labelKey: 'docType.governmentId'   },
  { value: DocumentType.CERTIFICATION,   labelKey: 'docType.certification'  },
  { value: DocumentType.OTHER,           labelKey: 'docType.other'          },
];

export function StepCredentials({ data, update, errors, onDeleteExistingDoc, deletingDocId }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');

  const {
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
  } = useDocumentUpload({ documents: data.documents, documentTypes: data.documentTypes, update, t });

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[2fr_1fr] gap-5">
        <Field label={t('barNumber')} hint={errors?.['barNumber'] ? undefined : t('barNumberHint')} error={errors?.['barNumber']}>
          <Input
            placeholder={t('barNumberPh')}
            value={data.barNumber}
            onChange={(e) => update('barNumber', e.target.value)}
          />
        </Field>
        <Field label={t('yearAdmitted')} error={errors?.['yearAdmitted']}>
          <Input
            type="number"
            min={1950}
            max={new Date().getFullYear()}
            placeholder={String(new Date().getFullYear())}
            value={data.yearAdmitted}
            onChange={(e) => update('yearAdmitted', e.target.value)}
          />
        </Field>
      </div>

      <Field label={t('barCouncil')}>
        <Select value={data.barCouncil} onValueChange={(v) => update('barCouncil', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {BAR_COUNCILS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label={t('uploadDocs')} hint={errors?.['documents'] ? undefined : t('uploadHint')} error={errors?.['documents']}>
        <div
          role="button"
          tabIndex={0}
          aria-label={t('uploadCta')}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-150 outline-none',
            'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
            isDragOver
              ? 'border-gold bg-gold-pale'
              : 'border-gray-200 bg-cream hover:border-gold hover:bg-gold-pale',
          )}
          onClick={openFilePicker}
          onKeyDown={handleZoneKeyDown}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="size-7 text-gold mx-auto mb-2.5" strokeWidth={1.6} aria-hidden="true" />
          <p className="font-sans text-sm font-medium text-navy">{t('uploadCta')}</p>
          <p className="font-sans text-xs text-gray-400 mt-1">{t('uploadSpec')}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_ATTR}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleInputChange}
        />
      </Field>

      {data.existingDocuments.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label={t('previouslyUploadedFiles')}>
          {data.existingDocuments.map((doc) => {
            const isDeleting = deletingDocId === doc.id;
            return (
              <li
                key={doc.id}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
              >
                <FileText className="size-4 text-navy shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium text-navy truncate">{doc.name}</p>
                  <p className="font-sans text-xs text-gray-400">{formatBytes(doc.sizeBytes)}</p>
                </div>
                <span className="font-sans text-[11px] font-medium px-2 py-0.5 rounded border shrink-0 bg-gray-50 text-gray-600 border-gray-200">
                  {t(DOC_TYPE_OPTIONS.find((o) => o.value === doc.type)?.labelKey ?? 'docType.other')}
                </span>
                <Badge variant={STATUS_VARIANT[doc.status]} className="shrink-0">
                  {t(`docStatus.${doc.status.toLowerCase()}`)}
                </Badge>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => { void onDeleteExistingDoc?.(doc.id); }}
                  aria-label={t('removeFile')}
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isDeleting
                    ? <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    : <X className="size-4" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {data.documents.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label={t('uploadedFiles')}>
          {data.documents.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
            >
              <FileText className="size-4 text-navy shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium text-navy truncate">{file.name}</p>
                <p className="font-sans text-xs text-gray-400">{formatBytes(file.size)}</p>
              </div>
              <Select
                value={data.documentTypes[idx]}
                onValueChange={(v) => changeDocType(idx, v as DocumentType)}
              >
                <SelectTrigger className="w-44 h-8 text-xs shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPE_OPTIONS.map(({ value, labelKey }) => (
                    <SelectItem key={value} value={value}>{t(labelKey)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                aria-label={t('removeFile')}
                className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {fileErrors.length > 0 && (
        <ul className="flex flex-col gap-1" role="alert">
          {fileErrors.map((err) => (
            <li key={err} className="font-sans text-xs text-error">{err}</li>
          ))}
        </ul>
      )}

      <div className="flex items-start gap-2.5 p-4 bg-success-bg rounded-md border border-success/30">
        <Check className="size-4 text-success shrink-0 mt-0.5" strokeWidth={2.2} aria-hidden="true" />
        <p className="font-sans text-xs text-gray-800 leading-relaxed">{t('verificationNote')}</p>
      </div>
    </div>
  );
}
