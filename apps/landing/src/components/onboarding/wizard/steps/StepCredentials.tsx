import { Check, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';
import { Field } from '../ui';
import { BAR_COUNCILS } from '../constants';
import type { StepProps } from '../types';

export function StepCredentials({ data, update, errors }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[2fr_1fr] gap-5">
        <Field label={t('barNumber')} hint={errors?.['barNumber'] ? undefined : t('barNumberHint')} error={errors?.['barNumber']}>
          <Input
            placeholder={t('barNumberPh')}
            value={data.barNumber}
            onChange={(e) => update('barNumber', e.target.value)}
          />
        </Field>
        <Field label={t('yearAdmitted')} error={errors?.['yearAdmitted']}>
          <Input
            type="number"
            min={1950}
            max={new Date().getFullYear()}
            placeholder={String(new Date().getFullYear())}
            value={data.yearAdmitted}
            onChange={(e) => update('yearAdmitted', e.target.value)}
          />
        </Field>
      </div>

      <Field label={t('barCouncil')}>
        <Select value={data.barCouncil} onValueChange={(v) => update('barCouncil', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {BAR_COUNCILS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>

      <Field label={t('uploadDocs')} hint={t('uploadHint')}>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-cream cursor-pointer hover:border-gold hover:bg-gold-pale transition-all duration-150">
          <Upload className="size-7 text-gold mx-auto mb-2.5" strokeWidth={1.6} aria-hidden="true" />
          <p className="font-sans text-sm font-medium text-navy">{t('uploadCta')}</p>
          <p className="font-sans text-xs text-gray-400 mt-1">{t('uploadSpec')}</p>
        </div>
      </Field>

      <div className="flex items-start gap-2.5 p-4 bg-success-bg rounded-md border border-success/30">
        <Check className="size-4 text-success shrink-0 mt-0.5" strokeWidth={2.2} aria-hidden="true" />
        <p className="font-sans text-xs text-gray-800 leading-relaxed">{t('verificationNote')}</p>
      </div>
    </div>
  );
}
