import { useTranslations } from 'next-intl';
import { Input, Textarea } from '@okil-chai/ui';
import { Field } from '../ui';
import type { StepProps } from '../types';

export function StepPersonal({ data, update }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');

  return (
    <div className="grid grid-cols-2 gap-5">
      <Field label={t('fullName')}>
        <Input value={data.fullName} onChange={(e) => update('fullName', e.target.value)} />
      </Field>
      <Field label={t('email')}>
        <Input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} />
      </Field>
      <Field label={t('phone')}>
        <Input value={data.phone} onChange={(e) => update('phone', e.target.value)} />
      </Field>
      <Field label={t('experience')}>
        <Input value={data.experience} onChange={(e) => update('experience', e.target.value)} />
      </Field>
      <div className="col-span-2">
        <Field label={t('bio')} hint={t('bioHint')}>
          <Textarea
            placeholder={t('bioPh')}
            className="min-h-[120px]"
            value={data.bio}
            onChange={(e) => update('bio', e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}
