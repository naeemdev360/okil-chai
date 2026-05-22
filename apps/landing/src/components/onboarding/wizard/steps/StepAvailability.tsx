import { useTranslations } from 'next-intl';
import { Input } from '@repo/ui';
import { Field, ToggleChip } from '../ui';
import { DAYS, SLOT_DURATIONS } from '../constants';
import type { DayKey, StepProps } from '../types';

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
          <Input type="time" value={data.startTime} onChange={(e) => update('startTime', e.target.value)} />
        </Field>
        <Field label={t('endTime')}>
          <Input type="time" value={data.endTime} onChange={(e) => update('endTime', e.target.value)} />
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
        <input
          type="checkbox"
          checked={data.syncCalendar}
          onChange={(e) => update('syncCalendar', e.target.checked)}
          className="size-4 accent-gold"
        />
        <div>
          <p className="font-sans text-sm font-semibold text-navy">{t('googleCalSync')}</p>
          <p className="font-sans text-xs text-gray-400">{t('googleCalSyncHint')}</p>
        </div>
      </label>
    </div>
  );
}
