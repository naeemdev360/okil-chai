import { formatDate } from '@repo/shared';
import { FileText } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../utils/cn';
import { formatBytes } from '../../utils/format';
import type { BadgeProps } from './badge';
import { Badge } from './badge';

export interface DocumentItemProps {
  name: string;
  sizeBytes: number;
  typeLabel: string;
  status?: string;
  statusVariant?: BadgeProps['variant'];
  uploadedAt?: Date | string;
  actions?: React.ReactNode;
  className?: string;
}

export function DocumentItem({
  name,
  sizeBytes,
  typeLabel,
  status,
  statusVariant = 'default',
  uploadedAt,
  actions,
  className,
}: DocumentItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg',
        className,
      )}
    >
      <FileText className="size-4 text-navy shrink-0" aria-hidden="true" />

      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium text-navy truncate">{name}</p>
        <p className="font-sans text-xs text-gray-400">
          {formatBytes(sizeBytes)}
          {uploadedAt && (
            <span className="before:content-['·'] before:mx-1">
              {formatDate(uploadedAt)}
            </span>
          )}
        </p>
      </div>

      <span className="font-sans text-[11px] font-medium px-2 py-0.5 rounded border shrink-0 bg-gray-50 text-gray-600 border-gray-200">
        {typeLabel}
      </span>

      {status && (
        <Badge variant={statusVariant} className="shrink-0">
          {status}
        </Badge>
      )}

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
