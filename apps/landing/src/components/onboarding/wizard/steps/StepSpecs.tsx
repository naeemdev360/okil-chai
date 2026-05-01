import { useTranslations } from 'next-intl';
import { Input } from '@okil-chai/ui';
import { Field, ToggleChip } from '../ui';
import { SPECIALIZATION_OPTIONS, LANGUAGE_OPTIONS } from '../constants';
import type { StepProps } from '../types';

export function StepSpecs({ data, update }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');

  const toggleSpec = (s: string) =>
    update('specializations', data.specializations.includes(s)
      ? data.specializations.filter((x) => x !== s)
      : data.specializations.length < 5 ? [...data.specializations, s] : data.specializations);

  const toggleLang = (l: string) =>
    update('languages', data.languages.includes(l)
      ? data.languages.filter((x) => x !== l)
      : [...data.languages, l]);

  return (
    <div className="flex flex-col gap-6">
      <Field
        label={t('practiceAreas')}
        hint={`${t('practiceAreasHint')} — ${data.specializations.length}/5`}
      >
        <div className="flex flex-wrap gap-2 mt-1">
          {SPECIALIZATION_OPTIONS.map((s) => (
            <ToggleChip key={s} active={data.specializations.includes(s)} rounded onClick={() => toggleSpec(s)}>
              {s}
            </ToggleChip>
          ))}
        </div>
      </Field>

      <Field label={t('languages')}>
        <div className="flex flex-wrap gap-2 mt-1">
          {LANGUAGE_OPTIONS.map((l) => (
            <ToggleChip key={l} active={data.languages.includes(l)} rounded onClick={() => toggleLang(l)}>
              {l}
            </ToggleChip>
          ))}
        </div>
      </Field>

      <Field label={t('city')}>
        <Input placeholder={t('cityPh')} value={data.city} onChange={(e) => update('city', e.target.value)} />
      </Field>
    </div>
  );
}
