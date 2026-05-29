import { useUpdateCase } from '@repo/hooks';
import { Button, Input, toast } from '@repo/ui';
import { useEffect, useState } from 'react';

interface CaseMetadataPanelProps {
  readonly caseId: string;
  readonly referenceNumber: string | null;
  readonly estimatedCompletionAt: Date | null;
}

function toInputDate(d: Date | null): string {
  if (!d) return '';
  // <input type="date"> expects YYYY-MM-DD in local time
  const iso = new Date(d).toISOString();
  return iso.slice(0, 10);
}

export function CaseMetadataPanel({
  caseId,
  referenceNumber,
  estimatedCompletionAt,
}: CaseMetadataPanelProps) {
  const [ref, setRef] = useState(referenceNumber ?? '');
  const [eta, setEta] = useState(toInputDate(estimatedCompletionAt));
  const { mutate, isPending } = useUpdateCase(caseId);

  useEffect(() => setRef(referenceNumber ?? ''), [referenceNumber]);
  useEffect(() => setEta(toInputDate(estimatedCompletionAt)), [estimatedCompletionAt]);

  function handleSave() {
    const payload = {
      referenceNumber: ref.trim() === '' ? null : ref.trim(),
      // End-of-day local time so it doesn't drift back a day in some timezones
      estimatedCompletionAt: eta ? new Date(`${eta}T23:59:00`).toISOString() : null,
    };
    mutate(payload, {
      onSuccess: () => toast.success('Case updated'),
      onError: () => toast.error('Could not update case'),
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-[12px] font-semibold text-navy mb-1 font-sans" htmlFor="case-ref">
          Court reference number
        </label>
        <Input
          id="case-ref"
          value={ref}
          maxLength={100}
          onChange={(e) => setRef(e.target.value)}
          placeholder="e.g. CR/2026/00123"
        />
      </div>
      <div>
        <label className="block text-[12px] font-semibold text-navy mb-1 font-sans" htmlFor="case-eta">
          Estimated completion
        </label>
        <Input
          id="case-eta"
          type="date"
          value={eta}
          onChange={(e) => setEta(e.target.value)}
        />
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={handleSave}
        isLoading={isPending}
        loadingText="Saving…"
      >
        Save
      </Button>
    </div>
  );
}
