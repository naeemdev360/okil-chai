'use client';

import { Toaster as Sonner } from 'sonner';

export function AppToaster() {
  return (
    <Sonner
      position="top-right"
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          // Base layout applied to every toast. Colors here are for untyped toasts.
          // Type-specific classes below use ! (important) to guarantee they win over these.
          toast: [
            'relative flex items-start gap-3 w-full min-w-[300px] rounded-lg',
            'px-4 py-3.5 shadow-lg font-sans text-sm',
            'border-l-[3px] bg-navy text-white border-gold',
          ].join(' '),

          title:       'font-semibold text-[13px] leading-snug',
          description: 'text-[12px] opacity-70 mt-0.5 leading-relaxed',
          icon:        'shrink-0 mt-0.5 size-4',

          // ! prefix forces these to override the base bg/text/border-color above
          error:   '!bg-error-bg   !text-error   !border-error',
          success: '!bg-success-bg !text-success !border-success',
          warning: '!bg-warning-bg !text-warning !border-warning',
          info:    '!bg-gray-50    !text-gray-800 !border-gray-400',

          closeButton: [
            'absolute top-2.5 right-2.5 p-0.5 rounded',
            'opacity-40 hover:opacity-100 transition-opacity text-current',
          ].join(' '),
          actionButton: [
            'mt-2 inline-flex items-center justify-center rounded px-3 py-1.5',
            'text-[11px] font-semibold bg-navy text-cream hover:bg-navy-light transition-colors',
          ].join(' '),
          cancelButton: [
            'mt-2 text-[11px] font-medium opacity-60',
            'hover:opacity-100 transition-opacity underline-offset-2 hover:underline',
          ].join(' '),
        },
      }}
    />
  );
}
