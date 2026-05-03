import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BookingStepIndicator } from './BookingStepIndicator';
import type { Lawyer } from '../../lib/search/mock-lawyers';
import type { BookingStep } from './types';

interface BookingPageHeaderProps {
  readonly locale: string;
  readonly lawyer: Lawyer;
  readonly step: BookingStep;
}

export function BookingPageHeader({ locale, lawyer, step }: BookingPageHeaderProps) {
  return (
    <div className="bg-navy px-6 py-6">
      <div className="max-w-[1100px] mx-auto">
        <Link
          href={`/${locale}/lawyers/${lawyer.id}`}
          className="inline-flex items-center gap-1.5 font-sans text-sm text-white/60 hover:text-white mb-5 transition-colors duration-150"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Profile
        </Link>
        <h1 className="font-heading text-2xl font-bold text-white">Book a Consultation</h1>
        <BookingStepIndicator current={step} />
      </div>
    </div>
  );
}
