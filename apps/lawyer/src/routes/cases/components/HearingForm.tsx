import { useCreateHearing } from '@repo/hooks';
import { CaseHearingType } from '@repo/shared';
import { Button, Input, Textarea, toast } from '@repo/ui';
import { useState } from 'react';

const HEARING_TYPE_OPTIONS: { value: CaseHearingType; label: string }[] = [
  { value: CaseHearingType.MENTION,  label: 'Mention' },
  { value: CaseHearingType.EVIDENCE, label: 'Evidence' },
  { value: CaseHearingType.JUDGMENT, label: 'Judgment' },
  { value: CaseHearingType.APPEAL,   label: 'Appeal' },
  { value: CaseHearingType.OTHER,    label: 'Other' },
];

interface HearingFormProps {
  readonly caseId: string;
}

export function HearingForm({ caseId }: HearingFormProps) {
  const [scheduledAt, setScheduledAt] = useState('');
  const [venue, setVenue] = useState('');
  const [hearingType, setHearingType] = useState<CaseHearingType>(CaseHearingType.MENTION);
  const [notes, setNotes] = useState('');
  const { mutate, isPending } = useCreateHearing(caseId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scheduledAt) {
      toast.error('Please choose a date and time.');
      return;
    }

    mutate(
      {
        scheduledAt: new Date(scheduledAt).toISOString(),
        venue: venue.trim() || undefined,
        hearingType,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Hearing scheduled');
          setScheduledAt('');
          setVenue('');
          setHearingType(CaseHearingType.MENTION);
          setNotes('');
        },
        onError: () => toast.error('Could not schedule hearing'),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-gray-100 p-3.5 bg-cream/30 mb-3">
      <div>
        <label className="block text-[12px] font-semibold text-navy mb-1 font-sans" htmlFor="hearing-when">
          Date & time
        </label>
        <Input
          id="hearing-when"
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-semibold text-navy mb-1 font-sans" htmlFor="hearing-type">
            Type
          </label>
          <select
            id="hearing-type"
            value={hearingType}
            onChange={(e) => setHearingType(e.target.value as CaseHearingType)}
            className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-navy font-sans text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
          >
            {HEARING_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-navy mb-1 font-sans" htmlFor="hearing-venue">
            Venue (optional)
          </label>
          <Input
            id="hearing-venue"
            value={venue}
            maxLength={300}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Courtroom / address"
          />
        </div>
      </div>
      <Textarea
        value={notes}
        rows={2}
        maxLength={2000}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
      />
      <Button
        type="submit"
        variant="primary"
        size="sm"
        isLoading={isPending}
        loadingText="Scheduling…"
      >
        Schedule hearing
      </Button>
    </form>
  );
}
