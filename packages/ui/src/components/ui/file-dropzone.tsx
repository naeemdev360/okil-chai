import { UploadCloud } from 'lucide-react';
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { formatBytes } from '../../utils/format';
import { Spinner } from '../loading/spinner';

export interface FileError {
  readonly code: 'file-too-large' | 'file-invalid-type' | 'too-many-files';
  readonly message: string;
}

export interface FileRejection {
  readonly file: File;
  readonly errors: readonly FileError[];
}

export type DropzoneSize = 'sm' | 'md' | 'lg';
export type DropzoneTheme = 'navy' | 'gold';

const dropzoneVariants = cva(
  [
    'relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed',
    'transition-all duration-200 outline-none',
    'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        idle: '',
        active: 'scale-[1.01] cursor-copy',
        error: 'border-red-300 bg-red-50 hover:border-red-400 cursor-pointer',
        disabled: 'opacity-60 pointer-events-none cursor-not-allowed',
        loading: 'pointer-events-none cursor-wait',
      },
      size: {
        sm: 'min-h-[100px] p-4',
        md: 'min-h-[140px] p-6',
        lg: 'min-h-[200px] p-8',
      },
      theme: {
        navy: '',
        gold: '',
      },
    },
    compoundVariants: [
      // Navy — idle
      { variant: 'idle', theme: 'navy', className: 'border-gray-200 bg-gray-50 hover:border-navy/40 hover:bg-cream/50 cursor-pointer' },
      // Navy — active (dragging)
      { variant: 'active', theme: 'navy', className: 'border-navy bg-cream/70' },
      // Navy — disabled / loading backgrounds
      { variant: 'disabled', theme: 'navy', className: 'border-gray-100 bg-gray-50' },
      { variant: 'loading', theme: 'navy', className: 'border-gray-200 bg-gray-50' },
      // Gold — idle
      { variant: 'idle', theme: 'gold', className: 'border-gray-200 bg-cream hover:border-gold hover:bg-gold-pale cursor-pointer' },
      // Gold — active (dragging)
      { variant: 'active', theme: 'gold', className: 'border-gold bg-gold-pale' },
      // Gold — disabled / loading backgrounds
      { variant: 'disabled', theme: 'gold', className: 'border-gray-100 bg-cream' },
      { variant: 'loading', theme: 'gold', className: 'border-gray-200 bg-cream' },
    ],
    defaultVariants: {
      variant: 'idle',
      size: 'md',
      theme: 'navy',
    },
  },
);

export interface FileDropzoneProps {
  readonly accept?: string;
  readonly maxSizeBytes?: number;
  readonly maxFiles?: number;
  readonly multiple?: boolean;
  readonly disabled?: boolean;
  readonly isLoading?: boolean;
  readonly loadingText?: string;
  readonly hasError?: boolean;
  readonly theme?: DropzoneTheme;
  readonly size?: DropzoneSize;
  readonly onFilesAccepted: (files: readonly File[]) => void;
  readonly onFilesRejected?: (rejections: readonly FileRejection[]) => void;
  readonly label?: string;
  readonly hint?: string;
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export function FileDropzone({
  accept,
  maxSizeBytes,
  maxFiles,
  multiple = false,
  disabled = false,
  isLoading = false,
  loadingText = 'Uploading…',
  hasError = false,
  theme = 'navy',
  size = 'md',
  onFilesAccepted,
  onFilesRejected,
  label = 'Drop files here or click to browse',
  hint,
  className,
  children,
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragCounter = React.useRef(0);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [rejections, setRejections] = React.useState<readonly FileRejection[]>([]);

  const hasRejections = rejections.length > 0 || hasError;

  const computedVariant = disabled
    ? 'disabled'
    : isLoading
      ? 'loading'
      : isDragActive
        ? 'active'
        : hasRejections
          ? 'error'
          : 'idle';

  function processFiles(rawFiles: readonly File[]) {
    const files = multiple ? rawFiles : rawFiles.slice(0, 1);
    const { accepted, rejected } = validateFiles(files, { accept, maxSizeBytes, maxFiles });
    setRejections(rejected);
    if (accepted.length > 0) onFilesAccepted(accepted);
    if (rejected.length > 0) onFilesRejected?.(rejected);
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
      setRejections([]);
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragActive(false);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    dragCounter.current = 0;
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processFiles(files);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) processFiles(files);
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleClick() {
    setRejections([]);
    inputRef.current?.click();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  const builtHint = hint ?? buildAutoHint({ accept, maxSizeBytes, maxFiles, multiple });

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        role="button"
        tabIndex={disabled || isLoading ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled || isLoading}
        className={cn(dropzoneVariants({ variant: computedVariant, size, theme }), className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <Spinner size="md" />
            <p className="font-sans text-sm text-gray-500">{loadingText}</p>
          </div>
        ) : children !== undefined ? (
          children
        ) : (
          <DefaultContent
            isDragActive={isDragActive}
            theme={theme}
            label={label}
            hint={builtHint}
            size={size}
          />
        )}
      </div>

      {rejections.length > 0 && (
        <ul className="mt-2 space-y-0.5" role="alert" aria-live="polite">
          {rejections.flatMap((r) =>
            r.errors.map((err, i) => (
              <li key={`${r.file.name}-${i}`} className="font-sans text-xs text-red-600">
                {err.message}
              </li>
            )),
          )}
        </ul>
      )}
    </div>
  );
}

interface DefaultContentProps {
  readonly isDragActive: boolean;
  readonly theme: DropzoneTheme;
  readonly label: string;
  readonly hint: string;
  readonly size: DropzoneSize;
}

function DefaultContent({ isDragActive, theme, label, hint, size }: DefaultContentProps) {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 32 : 26;
  const activeColor = theme === 'gold' ? 'text-gold' : 'text-navy';
  return (
    <div className="flex flex-col items-center text-center gap-1.5 pointer-events-none">
      <UploadCloud
        size={iconSize}
        className={isDragActive ? activeColor : 'text-gray-400'}
        aria-hidden="true"
      />
      <p
        className={cn(
          'font-sans font-medium',
          size === 'sm' ? 'text-xs' : 'text-sm',
          isDragActive ? activeColor : 'text-gray-600',
        )}
      >
        {isDragActive ? 'Release to upload' : label}
      </p>
      {hint && (
        <p className={cn('font-sans text-gray-400', size === 'sm' ? 'text-[11px]' : 'text-xs')}>
          {hint}
        </p>
      )}
    </div>
  );
}

function buildAutoHint({
  accept,
  maxSizeBytes,
  maxFiles,
  multiple,
}: Pick<FileDropzoneProps, 'accept' | 'maxSizeBytes' | 'maxFiles' | 'multiple'>): string {
  const parts: string[] = [];
  if (accept) parts.push(accept.replace(/,\s*/g, ', '));
  if (maxSizeBytes !== undefined) parts.push(`up to ${formatBytes(maxSizeBytes)}`);
  if (multiple && maxFiles !== undefined) parts.push(`max ${maxFiles} files`);
  return parts.join(' · ');
}

function validateFiles(
  files: readonly File[],
  opts: {
    readonly accept?: string;
    readonly maxSizeBytes?: number;
    readonly maxFiles?: number;
  },
): { readonly accepted: readonly File[]; readonly rejected: readonly FileRejection[] } {
  const { accept, maxSizeBytes, maxFiles } = opts;
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  const parsedAccept = parseAcceptAttr(accept);

  files.forEach((file, index) => {
    const errors: FileError[] = [];

    if (maxFiles !== undefined && index >= maxFiles) {
      errors.push({
        code: 'too-many-files',
        message: `Maximum ${maxFiles} file(s) allowed.`,
      });
    } else {
      if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
        errors.push({
          code: 'file-too-large',
          message: `"${file.name}" exceeds the ${formatBytes(maxSizeBytes)} size limit.`,
        });
      }
      if (parsedAccept.length > 0 && !isAccepted(file, parsedAccept)) {
        errors.push({
          code: 'file-invalid-type',
          message: `"${file.name}" is not an accepted file type.`,
        });
      }
    }

    if (errors.length === 0) {
      accepted.push(file);
    } else {
      rejected.push({ file, errors });
    }
  });

  return { accepted, rejected };
}

function parseAcceptAttr(accept: string | undefined): readonly string[] {
  if (!accept) return [];
  return accept
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function isAccepted(file: File, patterns: readonly string[]): boolean {
  const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
  const mime = file.type.toLowerCase();
  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) return pattern === ext;
    if (pattern.endsWith('/*')) return mime.startsWith(pattern.replace('/*', '/'));
    return pattern === mime;
  });
}
