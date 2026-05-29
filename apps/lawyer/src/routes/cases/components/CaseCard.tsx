import type { CaseSummary } from '@repo/shared';
import { CaseAssignmentStatus, CaseStatus } from '@repo/shared';
import { Avatar, Badge } from '@repo/ui';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ASSIGNMENT_STATUS_LABELS,
  CASE_CATEGORY_LABELS,
  CASE_STAGE_LABELS,
  formatDate,
} from '../utils/cases.utils';

interface CaseCardProps {
  readonly caseSummary: CaseSummary;
}

export function CaseCard({ caseSummary: c }: CaseCardProps) {
  const isClosed = c.status === CaseStatus.CLOSED;
  const isPending = c.assignmentStatus === CaseAssignmentStatus.PENDING;

  return (
    <Link
      to={`/cases/${c.id}`}
      className="block bg-white rounded-xl border border-gray-100 p-4 sm:p-5 hover:border-navy/30 transition-colors"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar
          initials={`${c.client.firstName[0] ?? ''}${c.client.lastName[0] ?? ''}`}
          src={c.client.photoUrl}
          size="xl"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-heading text-[17px] font-semibold text-navy truncate">
              {c.title}
            </span>
            <Badge variant={isPending ? 'available' : isClosed ? 'cancelled' : 'available'}>
              {isPending ? 'Pending acceptance' : CASE_STAGE_LABELS[c.currentStage]}
            </Badge>
          </div>
          <p className="text-[13px] text-gray-600 font-sans">
            {c.client.firstName} {c.client.lastName} ·{' '}
            {CASE_CATEGORY_LABELS[c.caseCategory]} · Opened {formatDate(c.openedAt)}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-gray-600 font-sans">
            <span>{ASSIGNMENT_STATUS_LABELS[c.assignmentStatus]}</span>
            {c.nextHearingAt && (
              <span className="inline-flex items-center gap-1 text-navy">
                <Calendar size={12} /> Next hearing {formatDate(c.nextHearingAt)}
              </span>
            )}
          </div>
        </div>

        <ChevronRight size={18} className="text-gray-400 shrink-0 hidden sm:block" />
      </div>
    </Link>
  );
}
