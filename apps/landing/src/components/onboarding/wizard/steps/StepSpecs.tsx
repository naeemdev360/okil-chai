import { useTranslations } from 'next-intl';
import { Input, ToggleChip } from '@repo/ui';
import { Field } from '../ui';
import { SPECIALIZATION_OPTIONS, LANGUAGE_OPTIONS } from '../constants';
import type { StepProps } from '../types';

export function StepSpecs({ data, update, errors }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');

  const toggleSpec = (slug: string) =>
    update('specializations', data.specializations.includes(slug)
      ? data.specializations.filter((x) => x !== slug)
      : data.specializations.length < 5 ? [...data.specializations, slug] : data.specializations);

  const toggleLang = (l: string) =>
    update('languages', data.languages.includes(l)
      ? data.languages.filter((x) => x !== l)
      : [...data.languages, l]);

  return (
    <div className="flex flex-col gap-6">
      <Field
        label={t('practiceAreas')}
        hint={errors?.['specializations'] ? undefined : `${t('practiceAreasHint')} — ${data.specializations.length}/5`}
        error={errors?.['specializations']}
      >
        <div className="flex flex-wrap gap-2 mt-1">
          {SPECIALIZATION_OPTIONS.map(({ slug, label }) => (
            <ToggleChip key={slug} active={data.specializations.includes(slug)} rounded onClick={() => toggleSpec(slug)}>
              {label}
            </ToggleChip>
          ))}
        </div>
      </Field>

      <Field label={t('languages')} error={errors?.['languages']}>
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
