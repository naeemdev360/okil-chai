import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircle2, Info, Trash2, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './button';

// ─── Variant config ──────────────────────────────────────────────────────────

const iconWrapVariants = cva(
  'flex items-center justify-center size-11 rounded-full shrink-0 mb-4',
  {
    variants: {
      variant: {
        confirm:     'bg-navy/10 text-navy',
        destructive: 'bg-error-bg text-error',
        warning:     'bg-warning-bg text-warning',
        info:        'bg-gold-pale text-gold',
      },
    },
    defaultVariants: { variant: 'confirm' },
  },
);

const ICON_MAP = {
  confirm:     CheckCircle2,
  destructive: Trash2,
  warning:     AlertTriangle,
  info:        Info,
} as const;

const CONFIRM_BTN_VARIANT = {
  confirm:     'primary',
  destructive: 'destructive',
  warning:     'gold',
  info:        'primary',
} as const satisfies Record<DialogVariant, 'primary' | 'destructive' | 'gold'>;

type DialogVariant = 'confirm' | 'destructive' | 'warning' | 'info';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ConfirmDialogProps extends VariantProps<typeof iconWrapVariants> {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: () => void;
  readonly title: string;
  readonly description?: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly isLoading?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'confirm',
  isLoading = false,
}: ConfirmDialogProps) {
  const Icon = ICON_MAP[variant ?? 'confirm'];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Backdrop */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
          )}
        />

        {/* Panel */}
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6',
            'focus:outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
            'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          )}
        >
          {/* Close button */}
          <DialogPrimitive.Close
            className="absolute right-4 top-4 p-1.5 rounded-md text-gray-400 hover:text-navy hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden="true" />
          </DialogPrimitive.Close>

          {/* Icon */}
          <div className={iconWrapVariants({ variant })}>
            <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
          </div>

          {/* Text */}
          <DialogPrimitive.Title className="font-heading text-lg font-semibold text-navy mb-1.5 pr-6">
            {title}
          </DialogPrimitive.Title>

          {description && (
            <DialogPrimitive.Description className="font-sans text-sm text-gray-600 leading-relaxed mb-6">
              {description}
            </DialogPrimitive.Description>
          )}

          {/* Actions */}
          <div className={cn('flex gap-3', description ? '' : 'mt-6')}>
            <Button
              variant="ghost"
              size="md"
              className="flex-1 border border-gray-200"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={CONFIRM_BTN_VARIANT[variant ?? 'confirm']}
              size="md"
              className="flex-1"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
