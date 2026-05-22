import { useTranslations } from 'next-intl';
import { Input, Textarea } from '@repo/ui';
import { Field } from '../ui';
import type { StepProps } from '../types';

export function StepPersonal({ data, update, errors }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');

  return (
    <div className="grid grid-cols-2 gap-5">
      <Field label={t('fullName')} error={errors?.['fullName']}>
        <Input value={data.fullName} onChange={(e) => update('fullName', e.target.value)} />
      </Field>
      <Field label={t('email')}>
        <Input type="email" value={data.email} readOnly className="bg-gray-50 text-gray-500 cursor-not-allowed" />
      </Field>
      <Field label={t('phoneNumber')} error={errors?.['phone']}>
        <Input value={data.phone} onChange={(e) => update('phone', e.target.value)} />
      </Field>
      <Field label={t('experience')} error={errors?.['experience']}>
        <Input
          type="number"
          min={0}
          max={70}
          value={data.experience}
          onChange={(e) => update('experience', e.target.value)}
        />
      </Field>
      <div className="col-span-2">
        <Field label={t('bio')} hint={errors?.['bio'] ? undefined : t('bioHint')} error={errors?.['bio']}>
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
