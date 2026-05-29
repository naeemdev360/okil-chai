import { useTransitionStage } from '@repo/hooks';
import { CaseStage } from '@repo/shared';
import { Button, Textarea, toast } from '@repo/ui';
import { useState } from 'react';
import { CASE_STAGE_LABELS, NEXT_STAGES } from '../utils/cases.utils';

interface StageTransitionPanelProps {
  readonly caseId: string;
  readonly currentStage: CaseStage;
}

export function StageTransitionPanel({ caseId, currentStage }: StageTransitionPanelProps) {
  const [toStage, setToStage] = useState<CaseStage | ''>('');
  const [note, setNote] = useState('');
  const { mutate, isPending } = useTransitionStage(caseId);

  const options = NEXT_STAGES[currentStage] ?? [];

  if (options.length === 0) {
    return (
      <p className="text-[13px] text-gray-500 font-sans">
        No further stages from {CASE_STAGE_LABELS[currentStage]}.
      </p>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!toStage) return;
    mutate(
      { toStage, note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Stage updated');
          setToStage('');
          setNote('');
        },
        onError: () => toast.error('Could not update stage'),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="block text-[12px] font-semibold text-navy mb-1 font-sans" htmlFor="to-stage">
          Move to
        </label>
        <select
          id="to-stage"
          value={toStage}
          onChange={(e) => setToStage(e.target.value as CaseStage)}
          className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-navy font-sans text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        >
          <option value="">Select a stage…</option>
          {options.map((s) => (
            <option key={s} value={s}>
              {CASE_STAGE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <Textarea
        value={note}
        rows={2}
        maxLength={2000}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note for the client (optional)"
      />
      <Button
        type="submit"
        variant="primary"
        size="sm"
        disabled={!toStage}
        isLoading={isPending}
        loadingText="Updating…"
      >
        Update stage
      </Button>
    </form>
  );
}
