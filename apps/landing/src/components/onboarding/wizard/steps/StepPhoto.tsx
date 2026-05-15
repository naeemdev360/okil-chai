import { Check, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@repo/ui';
import type { WizardData } from '../types';

interface StepPhotoProps {
  readonly data: WizardData;
}

export function StepPhoto({ data }: StepPhotoProps) {
  const t = useTranslations('onboarding.lawyer.fields');
  const initials = data.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
  const bullets = t.raw('almostDoneBullets') as string[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6 items-center">
        <div className="size-36 rounded-full bg-navy-mid flex items-center justify-center font-heading font-bold text-4xl text-white border-4 border-gold shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-lg font-semibold text-navy mb-1.5">{t('addPhoto')}</h3>
          <p className="font-sans text-sm text-gray-600 leading-relaxed mb-4">{t('photoBody')}</p>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="size-3.5" aria-hidden="true" />
            {t('uploadPhoto')}
          </Button>
        </div>
      </div>

      <div className="p-5 bg-gold-pale rounded-lg border border-gold/40">
        <p className="font-heading text-base font-semibold text-navy mb-3">{t('almostDone')}</p>
        <ul className="list-none flex flex-col gap-1.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 font-sans text-sm text-gray-800">
              <Check className="size-3.5 text-gold shrink-0 mt-0.5" strokeWidth={2.4} aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
