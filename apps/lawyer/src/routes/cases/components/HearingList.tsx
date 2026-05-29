import { useDeleteHearing, useUpdateHearing } from '@repo/hooks';
import type { CaseHearingResponse } from '@repo/shared';
import { Badge, Button, ConfirmDialog, Textarea, toast } from '@repo/ui';
import { Calendar, MapPin, X } from 'lucide-react';
import { useState } from 'react';
import { formatDateTime } from '../utils/cases.utils';

interface HearingListProps {
  readonly caseId: string;
  readonly hearings: readonly CaseHearingResponse[];
  readonly canManage: boolean;
}

export function HearingList({ caseId, hearings, canManage }: HearingListProps) {
  const remove = useDeleteHearing(caseId);
  const update = useUpdateHearing(caseId);
  const [outcomeFor, setOutcomeFor] = useState<string | null>(null);
  const [outcome, setOutcome] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  if (hearings.length === 0) {
    return <p className="text-[13px] text-gray-500 font-sans">No hearings scheduled.</p>;
  }

  const now = new Date();

  function saveOutcome(hearingId: string) {
    update.mutate(
      { hearingId, dto: { outcome: outcome.trim() || null } },
      {
        onSuccess: () => {
          toast.success('Outcome recorded');
          setOutcomeFor(null);
          setOutcome('');
        },
        onError: () => toast.error('Could not save outcome'),
      },
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {hearings.map((h) => {
          const isPast = h.scheduledAt < now;
          const isEditing = outcomeFor === h.id;
          return (
            <li key={h.id} className="rounded-lg border border-gray-100 p-3.5">
              <div className="flex flex-wrap items-center gap-2 mb-1 justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={isPast ? 'cancelled' : 'available'}>
                    {h.hearingType.toLowerCase()}
                  </Badge>
                  <span className="font-heading text-[14px] font-semibold text-navy inline-flex items-center gap-1.5">
                    <Calendar size={12} />
                    {formatDateTime(h.scheduledAt)}
                  </span>
                </div>
                {canManage && !isPast && (
                  <button
                    onClick={() => setConfirmingDelete(h.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500"
                    aria-label="Cancel hearing"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {h.venue && (
                <p className="text-[12px] text-gray-600 font-sans inline-flex items-center gap-1.5">
                  <MapPin size={12} /> {h.venue}
                </p>
              )}
              {h.notes && <p className="text-[13px] text-gray-700 font-sans mt-2">{h.notes}</p>}

              {h.outcome ? (
                <p className="text-[13px] text-gray-700 font-sans mt-2">
                  <span className="font-semibold text-navy">Outcome:</span> {h.outcome}
                </p>
              ) : isPast && canManage ? (
                isEditing ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <Textarea
                      value={outcome}
                      rows={2}
                      maxLength={2000}
                      onChange={(e) => setOutcome(e.target.value)}
                      placeholder="What happened at this hearing?"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setOutcomeFor(null);
                          setOutcome('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => saveOutcome(h.id)}
                        isLoading={update.isPending}
                        loadingText="Saving…"
                      >
                        Save outcome
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setOutcomeFor(h.id);
                      setOutcome('');
                    }}
                    className="mt-2 text-[12px] font-semibold text-navy hover:underline font-sans"
                  >
                    + Record outcome
                  </button>
                )
              ) : null}
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={!!confirmingDelete}
        onOpenChange={(open) => !open && setConfirmingDelete(null)}
        variant="destructive"
        title="Cancel this hearing?"
        description="The client will be notified."
        confirmLabel="Cancel hearing"
        isLoading={remove.isPending}
        onConfirm={() => {
          if (confirmingDelete) {
            remove.mutate(confirmingDelete, {
              onSuccess: () => toast.success('Hearing cancelled'),
              onError: () => toast.error('Could not cancel hearing'),
            });
          }
          setConfirmingDelete(null);
        }}
      />
    </>
  );
}
