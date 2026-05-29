import { useCases } from '@repo/hooks';
import { EmptyState, Pagination } from '@repo/ui';
import { CasesSortField, CaseStatus } from '@repo/shared';
import { FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PAGE_SIZE } from '../utils/cases.utils';
import { CaseCard } from './CaseCard';
import { CasesListSkeleton } from './CasesListSkeleton';

export type CasesFilterKey = 'active' | 'closed' | 'all';

const EMPTY_CONTENT: Record<CasesFilterKey, { title: string; description: string; showCta: boolean }> = {
  active: {
    title:       'No active cases yet',
    description: 'Open a case to start tracking a legal matter end-to-end — stages, hearings, documents, and your assigned lawyer.',
    showCta:     true,
  },
  closed: {
    title:       'No closed cases',
    description: "Cases you've resolved will be archived here for your records.",
    showCta:     false,
  },
  all: {
    title:       "You haven't opened any cases yet",
    description: 'Open your first case to keep everything about your legal matter in one organized place.',
    showCta:     true,
  },
};

interface CasesListProps {
  readonly filter: CasesFilterKey;
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
  const params = {
    status:
      filter === 'active'
        ? CaseStatus.ACTIVE
        : filter === 'closed'
          ? CaseStatus.CLOSED
          : undefined,
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    sortBy,
    sortDir,
    openedFrom: openedFrom || undefined,
    openedTo: openedTo || undefined,
  };

  const navigate = useNavigate();
  const { data, isLoading, isError } = useCases(params);

  const cases = data?.cases ?? [];
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
    const { title, description, showCta } = EMPTY_CONTENT[filter];
    return (
      <EmptyState
        icon={<FolderOpen size={36} />}
        title={title}
        description={description}
        primaryAction={showCta ? { label: 'Open a case', onClick: () => navigate('/cases/new') } : undefined}
      />
    );
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
