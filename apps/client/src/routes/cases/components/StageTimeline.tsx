import type { CaseStageEventResponse } from '@repo/shared';
import { CASE_STAGE_LABELS, formatDateTime } from '../utils/cases.utils';

interface StageTimelineProps {
  readonly history: readonly CaseStageEventResponse[];
}

export function StageTimeline({ history }: StageTimelineProps) {
  if (history.length === 0) {
    return <p className="text-[13px] text-gray-500 font-sans">No stage events yet.</p>;
  }

  return (
    <ol className="relative border-l border-gray-200 ml-2">
      {history.map((event) => (
        <li key={event.id} className="ml-4 pb-5 last:pb-0">
          <span className="absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-white" />
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-heading text-[14px] font-semibold text-navy">
              {CASE_STAGE_LABELS[event.toStage]}
            </span>
            {event.fromStage && (
              <span className="text-[12px] text-gray-500 font-sans">
                from {CASE_STAGE_LABELS[event.fromStage]}
              </span>
            )}
          </div>
          <p className="text-[12px] text-gray-500 font-sans">
            {formatDateTime(event.occurredAt)} · {event.actor.firstName} {event.actor.lastName}
          </p>
          {event.note && (
            <p className="text-[13px] text-gray-700 font-sans mt-1">{event.note}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
