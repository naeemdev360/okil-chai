import { CasesSortField } from '@repo/shared';
import type { DateRange } from '@repo/ui';
import { Button, DateRangePicker, Input, Reveal, RevealGroup, SegmentedControl, SurfaceCard } from '@repo/ui';
import { ArrowDown, ArrowUp, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CasesFilterKey } from './components/CasesList';
import { CasesList } from './components/CasesList';
import { parseDateInputValue, toDateInputValue } from './utils/cases.utils';

const FILTERS: { id: CasesFilterKey; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'closed', label: 'Closed' },
  { id: 'all',    label: 'All' },
];

const SORT_OPTIONS: { value: CasesSortField; label: string }[] = [
  { value: CasesSortField.UPDATED_AT,      label: 'Last updated' },
  { value: CasesSortField.OPENED_AT,       label: 'Opened date' },
  { value: CasesSortField.NEXT_HEARING_AT, label: 'Next hearing' },
];

export function CasesPage() {
  const navigate = useNavigate();

  const [filter, setFilter]       = useState<CasesFilterKey>('active');
  const [page, setPage]           = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]       = useState('');
  const [sortBy, setSortBy]       = useState<CasesSortField>(CasesSortField.UPDATED_AT);
  const [sortDir, setSortDir]     = useState<'asc' | 'desc'>('desc');
  const [openedFrom, setOpenedFrom] = useState('');
  const [openedTo, setOpenedTo]   = useState('');

  // Debounce search input to avoid a request on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  function handleFilterChange(key: CasesFilterKey) {
    setFilter(key);
    setPage(1);
  }

  function handleSortByChange(value: CasesSortField) {
    setSortBy(value);
    setPage(1);
  }

  function handleSortDirToggle() {
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  }

  function handleOpenedRangeChange(range: DateRange | undefined) {
    setOpenedFrom(range?.from ? toDateInputValue(range.from) : '');
    setOpenedTo(range?.to ? toDateInputValue(range.to) : '');
    setPage(1);
  }

  const openedRange: DateRange | undefined =
    openedFrom || openedTo
      ? { from: parseDateInputValue(openedFrom), to: parseDateInputValue(openedTo) }
      : undefined;

  const hasActiveFilters = search || openedFrom || openedTo || sortBy !== CasesSortField.UPDATED_AT || sortDir !== 'desc';

  function clearFilters() {
    setSearchInput('');
    setSearch('');
    setSortBy(CasesSortField.UPDATED_AT);
    setSortDir('desc');
    setOpenedFrom('');
    setOpenedTo('');
    setPage(1);
  }

  return (
    <RevealGroup>
      <Reveal>
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
          <div className="max-w-xl">
            <h1 className="font-heading text-[22px] font-semibold text-navy sm:text-[26px]">
              My Cases
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-600 font-sans">
              Track your legal matters end-to-end — stages, hearings, documents, and assigned lawyers.
            </p>
          </div>
          <Button
            variant="gold"
            onClick={() => navigate('/cases/new')}
            className="w-full shrink-0 sm:w-auto"
          >
            <Plus size={14} /> Open a case
          </Button>
        </div>

        {/* Filter toolbar — search, status, sort and date grouped in one surface */}
        <SurfaceCard radius="xl" elevation="sm" padding="none" className="mb-5 p-3 sm:p-4">
          {/* Primary row: search + status segmented control */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by case title or lawyer name..."
                aria-label="Search cases"
                className="pl-10 text-[13px]"
              />
            </div>

            <SegmentedControl
              items={FILTERS}
              active={filter}
              // SegmentedControl emits the item id, which is always a CasesFilterKey here.
              onChange={(id) => handleFilterChange(id as CasesFilterKey)}
              ariaLabel="Filter cases by status"
            />
          </div>

          {/* Divider */}
          <div className="my-3 h-px bg-gray-100" />

          {/* Secondary row: sort + opened-date range + clear */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {/* Sort controls */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-sans font-medium shrink-0">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortByChange(e.target.value as CasesSortField)}
                aria-label="Sort cases by"
                className="text-[13px] font-sans border-[1.5px] border-gray-200 rounded-md pl-3 pr-2 h-9 bg-white focus:border-navy focus:outline-none cursor-pointer hover:border-gray-300 transition-colors w-[120px]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button
                onClick={handleSortDirToggle}
                aria-label={sortDir === 'asc' ? 'Sorted ascending — switch to descending' : 'Sorted descending — switch to ascending'}
                title={sortDir === 'asc' ? 'Ascending — click for descending' : 'Descending — click for ascending'}
                className="grid h-9 w-9 place-items-center rounded-md border-[1.5px] border-gray-200 hover:border-navy text-gray-600 hover:text-navy transition-colors bg-white"
              >
                {sortDir === 'asc' ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
              </button>
            </div>

            {/* Opened date range */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-sans font-medium shrink-0">Opened</span>
              <DateRangePicker
                value={openedRange}
                onChange={handleOpenedRangeChange}
                placeholder="Any date"
              />
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 h-9 rounded-md text-gray-500 hover:text-error hover:bg-error-bg text-[13px] font-sans transition-colors ml-auto"
              >
                <X size={14} /> Clear filters
              </button>
            )}
          </div>
        </SurfaceCard>
      </Reveal>

      <Reveal>
        <CasesList
          filter={filter}
          page={page}
          onPageChange={setPage}
          search={search}
          sortBy={sortBy}
          sortDir={sortDir}
          openedFrom={openedFrom}
          openedTo={openedTo}
        />
      </Reveal>
    </RevealGroup>
  );
}
