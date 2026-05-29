import type { CaseDocumentResponse } from '@repo/shared';
import { ConfirmDialog, FileDropzone, formatBytes } from '@repo/ui';
import { FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '../utils/cases.utils';

interface DocumentListProps {
  readonly documents: readonly CaseDocumentResponse[];
  readonly currentUserId: string | null;
  readonly canUpload: boolean;
  readonly onUpload: (file: File) => void;
  readonly onDelete: (id: string) => void;
  readonly isUploading: boolean;
  readonly isDeleting: boolean;
}

export function DocumentList({
  documents,
  currentUserId,
  canUpload,
  onUpload,
  onDelete,
  isUploading,
  isDeleting,
}: DocumentListProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  return (
    <div>
      {canUpload && (
        <div className="mb-4">
          <FileDropzone
            size="sm"
            isLoading={isUploading}
            onFilesAccepted={(files) => { if (files[0]) onUpload(files[0]); }}
            label="Drop a document here or click to browse"
          />
        </div>
      )}

      {documents.length === 0 ? (
        <p className="text-[13px] text-gray-500 font-sans">No documents uploaded yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {documents.map((doc) => {
            const isOwner = currentUserId !== null && doc.uploader.id === currentUserId;
            return (
              <li
                key={doc.id}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
              >
                <div className="w-9 h-9 rounded-md bg-cream flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-navy" />
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-heading text-[14px] font-semibold text-navy hover:underline truncate block"
                  >
                    {doc.name}
                  </a>
                  <p className="text-[12px] text-gray-500 font-sans truncate">
                    {formatBytes(doc.sizeBytes)} · uploaded by {doc.uploader.firstName}{' '}
                    {doc.uploader.lastName} · {formatDate(doc.uploadedAt)}
                  </p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => setConfirmingId(doc.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                    aria-label="Delete document"
                    disabled={isDeleting}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!confirmingId}
        onOpenChange={(open) => !open && setConfirmingId(null)}
        variant="destructive"
        title="Delete this document?"
        description="This permanently removes the file. The other party will no longer be able to view it."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={() => {
          if (confirmingId) onDelete(confirmingId);
          setConfirmingId(null);
        }}
      />
    </div>
  );
}
