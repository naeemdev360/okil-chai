import { Checkbox, TimePicker, ToggleChip } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { DAYS, SLOT_DURATIONS } from '../constants';
import type { DayKey, StepProps } from '../types';
import { Field } from '../ui';

export function StepAvailability({ data, update, errors }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');

  const toggleDay = (d: DayKey) =>
    update('availability', { ...data.availability, [d]: !data.availability[d] });

  return (
    <div className="flex flex-col gap-6">
      <Field label={t('workingDays')} hint={errors?.['availability'] ? undefined : t('workingDaysHint')} error={errors?.['availability']}>
        <div className="grid grid-cols-7 gap-2 mt-1.5">
          {DAYS.map((d) => (
            <ToggleChip key={d} active={data.availability[d]} onClick={() => toggleDay(d)}>
              {d}
            </ToggleChip>
          ))}
        </div> 
      </Field>

      <div className="grid grid-cols-2 gap-5">
        <Field label={t('startTime')}>
          <TimePicker value={data.startTime} onChange={(v) => update('startTime', v)} />
        </Field>
        <Field label={t('endTime')}>
          <TimePicker value={data.endTime} onChange={(v) => update('endTime', v)} />
        </Field>
      </div>

      <Field label={t('slotDuration')}>
        <div className="flex gap-2">
          {SLOT_DURATIONS.map((d) => (
            <ToggleChip key={d} active={data.slotDuration === d} onClick={() => update('slotDuration', d)}>
              {d}
            </ToggleChip>
          ))}
        </div>
      </Field>

      <label className="flex items-center gap-3 p-4 bg-cream rounded-md border border-gray-100 cursor-pointer">
        <Checkbox
          checked={data.syncCalendar}
          onCheckedChange={(checked) => update('syncCalendar', checked as boolean)}
          variant="gold"
        />
        <div>
          <p className="font-sans text-sm font-semibold text-navy">{t('googleCalSync')}</p>
          <p className="font-sans text-xs text-gray-400">{t('googleCalSyncHint')}</p>
        </div>
      </label>
    </div>
  );
}
