import type { CaseAssignmentHistoryItem } from '@repo/shared';
import { Badge } from '@repo/ui';
import { ASSIGNMENT_STATUS_LABELS, formatDateTime } from '../utils/cases.utils';

interface AssignmentHistoryProps {
  readonly history: readonly CaseAssignmentHistoryItem[];
}

export function AssignmentHistory({ history }: AssignmentHistoryProps) {
  if (history.length === 0) {
    return (
      <p className="text-[13px] text-gray-500 font-sans">No lawyers invited yet.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {history.map((a) => (
        <li key={a.id} className="rounded-lg border border-gray-100 p-3">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-heading text-[14px] font-semibold text-navy">
              {a.lawyer.firstName} {a.lawyer.lastName}
            </span>
            <Badge variant="cancelled">{ASSIGNMENT_STATUS_LABELS[a.status]}</Badge>
          </div>
          <p className="text-[12px] text-gray-500 font-sans">
            Invited by {a.invitedBy.firstName} {a.invitedBy.lastName} ·{' '}
            {formatDateTime(a.invitedAt)}
          </p>
          {a.respondedAt && (
            <p className="text-[12px] text-gray-500 font-sans">
              Responded {formatDateTime(a.respondedAt)}
            </p>
          )}
          {a.releasedAt && (
            <p className="text-[12px] text-gray-500 font-sans">
              Released {formatDateTime(a.releasedAt)}
              {a.releaseReason ? ` — ${a.releaseReason}` : ''}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
