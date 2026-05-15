import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input, cn } from '@repo/ui';
import { Field } from '../ui';
import { CONSULTATION_TYPES } from '../constants';
import type { ConsultationType, StepProps } from '../types';

export function StepPricing({ data, update }: StepProps) {
  const t = useTranslations('onboarding.lawyer.fields');
  const payout = Math.round(data.pricePerHour * 0.9);
  const fee    = Math.round(data.pricePerHour * 0.1);

  const toggleType = (k: ConsultationType) =>
    update('consultationTypes', data.consultationTypes.includes(k)
      ? data.consultationTypes.filter((x) => x !== k)
      : [...data.consultationTypes, k]);

  return (
    <div className="flex flex-col gap-6">
      <Field label={t('hourlyRate')}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">$</span>
            <Input
              type="number"
              className="pl-7 text-base font-semibold text-navy"
              value={data.pricePerHour}
              onChange={(e) => update('pricePerHour', Number(e.target.value))}
            />
          </div>
          <span className="font-sans text-xs text-gray-400">{t('perHour')}</span>
        </div>
      </Field>

      <div className="bg-cream rounded-lg p-5 border border-gray-100">
        <p className="font-sans text-xs font-semibold text-navy mb-4">{t('earningsPreview')}</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: t('consultationFee'), value: `$${data.pricePerHour}`, color: 'text-navy'    },
            { label: t('platformFee'),     value: `−$${fee}`,              color: 'text-gray-600' },
            { label: t('yourPayout'),      value: `$${payout}`,            color: 'text-success'  },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="font-sans text-[11px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className={cn('font-heading text-xl font-bold', color)}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <Field label={t('consultTypes')}>
        <div className="grid grid-cols-3 gap-3 mt-1">
          {CONSULTATION_TYPES.map(({ key, labelKey, descKey }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleType(key)}
              className={cn(
                'p-4 rounded-md text-left border-[1.5px] transition-all duration-150',
                data.consultationTypes.includes(key)
                  ? 'bg-gold-pale border-gold'
                  : 'bg-white border-gray-200 hover:border-gray-400',
              )}
            >
              <p className="font-sans text-sm font-semibold text-navy">
                {data.consultationTypes.includes(key) && (
                  <Check className="inline size-3 mr-1 -mt-0.5" strokeWidth={2.5} aria-hidden="true" />
                )}
                {t(labelKey)}
              </p>
              <p className="font-sans text-xs text-gray-600 mt-0.5">{t(descKey)}</p>
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}
