'use client';

import { DocumentStatus, DocumentType } from '@repo/shared';
import { ConfirmDialog, DocumentItem, FileDropzone, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, formatBytes } from '@repo/ui';
import type { BadgeProps } from '@repo/ui';
import { Check, Loader2, FileText, Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BAR_COUNCILS } from '../constants';
import { ACCEPTED_ATTR, MAX_FILE_BYTES, useDocumentUpload } from '../hooks/useDocumentUpload';
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

type PendingDelete =
  | { kind: 'new'; index: number }
  | { kind: 'existing'; id: string };

export function StepCredentials({ data, update, errors, onDeleteExistingDoc, deletingDocId }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const { addFiles, removeFile, changeDocType } = useDocumentUpload({
    documents: data.documents,
    documentTypes: data.documentTypes,
    update,
  });

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    if (pendingDelete.kind === 'new') {
      removeFile(pendingDelete.index);
    } else {
      void onDeleteExistingDoc?.(pendingDelete.id);
    }
    setPendingDelete(null);
  }

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
        <FileDropzone
          theme="gold"
          multiple
          accept={ACCEPTED_ATTR}
          maxSizeBytes={MAX_FILE_BYTES}
          hasError={!!errors?.['documents']}
          onFilesAccepted={addFiles}
          label={t('uploadCta')}
        >
          <div className="flex flex-col items-center text-center gap-1.5 pointer-events-none">
            <Upload className="size-7 text-gold" strokeWidth={1.6} aria-hidden="true" />
            <p className="font-sans text-sm font-medium text-navy">{t('uploadCta')}</p>
            <p className="font-sans text-xs text-gray-400">{t('uploadSpec')}</p>
          </div>
        </FileDropzone>
      </Field>

      {data.existingDocuments.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label={t('previouslyUploadedFiles')}>
          {data.existingDocuments.map((doc) => {
            const isDeleting = deletingDocId === doc.id;
            return (
              <li key={doc.id}>
                <DocumentItem
                  name={doc.name}
                  sizeBytes={doc.sizeBytes}
                  typeLabel={t(DOC_TYPE_OPTIONS.find((o) => o.value === doc.type)?.labelKey ?? 'docType.other')}
                  status={t(`docStatus.${doc.status.toLowerCase()}`)}
                  statusVariant={STATUS_VARIANT[doc.status]}
                  uploadedAt={doc.uploadedAt}
                  actions={
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setPendingDelete({ kind: 'existing', id: doc.id })}
                      aria-label={t('removeFile')}
                      className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isDeleting
                        ? <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        : <X className="size-4" aria-hidden="true" />}
                    </button>
                  }
                />
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
                onClick={() => setPendingDelete({ kind: 'new', index: idx })}
                aria-label={t('removeFile')}
                className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-start gap-2.5 p-4 bg-success-bg rounded-md border border-success/30">
        <Check className="size-4 text-success shrink-0 mt-0.5" strokeWidth={2.2} aria-hidden="true" />
        <p className="font-sans text-xs text-gray-800 leading-relaxed">{t('verificationNote')}</p>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => { if (!open) setPendingDelete(null); }}
        onConfirm={handleConfirmDelete}
        variant="destructive"
        title={t('removeFileConfirmTitle')}
        description={t('removeFileConfirmDesc')}
        confirmLabel={t('removeFileConfirmOk')}
        cancelLabel={t('removeFileConfirmCancel')}
        isLoading={pendingDelete !== null && pendingDelete.kind === 'existing' && deletingDocId === pendingDelete.id}
      />
    </div>
  );
}
