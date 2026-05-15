import * as React from 'react';
import { cn } from '../../utils/cn';

export interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
  readonly onPageChange: (page: number) => void;
  readonly className?: string;
}

function getPageRange(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis')[] = [1];

  if (current <= 4) {
    pages.push(2, 3, 4, 5, 'ellipsis', total);
  } else if (current >= total - 3) {
    pages.push('ellipsis', total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push('ellipsis', current - 1, current, current + 1, 'ellipsis', total);
  }

  return pages;
}

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  const firstItem = (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = getPageRange(currentPage, totalPages);

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3', className)}>
      <p className="font-sans text-[12px] text-gray-400 select-none">
        Showing <span className="font-semibold text-gray-600">{firstItem}–{lastItem}</span> of{' '}
        <span className="font-semibold text-gray-600">{totalItems}</span> reviews
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={cn(
            'inline-flex items-center justify-center size-8 rounded-lg font-sans text-[13px] transition-all duration-150',
            'border border-gray-200 text-gray-500',
            'hover:border-navy/40 hover:text-navy hover:bg-gray-50',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500',
          )}
        >
          <ChevronLeft />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, idx) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex items-center justify-center size-8 font-sans text-[13px] text-gray-400 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center justify-center size-8 rounded-lg font-sans text-[13px] font-medium transition-all duration-150',
                  page === currentPage
                    ? 'bg-navy text-white border border-navy shadow-sm'
                    : 'border border-gray-200 text-gray-600 hover:border-navy/40 hover:text-navy hover:bg-gray-50',
                )}
              >
                {page}
              </button>
            ),
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={cn(
            'inline-flex items-center justify-center size-8 rounded-lg font-sans text-[13px] transition-all duration-150',
            'border border-gray-200 text-gray-500',
            'hover:border-navy/40 hover:text-navy hover:bg-gray-50',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500',
          )}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
