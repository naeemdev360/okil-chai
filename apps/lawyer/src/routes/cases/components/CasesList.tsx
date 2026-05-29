import { useCases } from '@repo/hooks';
import { CaseAssignmentStatus, CasesSortField, CaseStatus } from '@repo/shared';
import { Pagination } from '@repo/ui';
import { useMemo } from 'react';
import { PAGE_SIZE } from '../utils/cases.utils';
import { CaseCard } from './CaseCard';
import { CasesListSkeleton } from './CasesListSkeleton';

export type LawyerCasesFilterKey = 'pending' | 'active' | 'closed' | 'all';

const EMPTY_MESSAGES: Record<LawyerCasesFilterKey, string> = {
  pending: 'No pending case requests.',
  active:  'No active cases assigned to you.',
  closed:  'No closed cases.',
  all:     'You haven’t worked on any cases yet.',
};

interface CasesListProps {
  readonly filter: LawyerCasesFilterKey;
  readonly page: number;
  readonly onPageChange: (page: number) => void;
  readonly search?: string;
  readonly sortBy?: CasesSortField;
  readonly sortDir?: 'asc' | 'desc';
  readonly openedFrom?: string;
  readonly openedTo?: string;
}

export function CasesList({
  filter,
  page,
  onPageChange,
  search,
  sortBy,
  sortDir,
  openedFrom,
  openedTo,
}: CasesListProps) {
  // Pending invites are filtered client-side because the API filters by case status, not assignment status.
  const params = {
    status:
      filter === 'closed'
        ? CaseStatus.CLOSED
        : filter === 'active' || filter === 'pending'
          ? CaseStatus.ACTIVE
          : undefined,
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    sortBy,
    sortDir,
    openedFrom: openedFrom || undefined,
    openedTo: openedTo || undefined,
  };

  const { data, isLoading, isError } = useCases(params);

  const cases = useMemo(() => {
    const items = data?.cases ?? [];
    if (filter === 'pending') {
      return items.filter((c) => c.assignmentStatus === CaseAssignmentStatus.PENDING);
    }
    if (filter === 'active') {
      return items.filter((c) => c.assignmentStatus === CaseAssignmentStatus.ACCEPTED);
    }
    return items;
  }, [data?.cases, filter]);

  const meta = data?.meta;

  if (isLoading) return <CasesListSkeleton />;

  if (isError) {
    return (
      <p className="text-sm text-red-500 font-sans">
        Failed to load cases. Please try again.
      </p>
    );
  }

  if (cases.length === 0) {
    return <p className="text-sm text-gray-500 font-sans">{EMPTY_MESSAGES[filter]}</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-3.5">
        {cases.map((c) => (
          <CaseCard key={c.id} caseSummary={c} />
        ))}
      </div>
      {meta && meta.totalPages > 1 && (
        <Pagination
          className="mt-4"
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={PAGE_SIZE}
          itemLabel="cases"
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
