import { Check } from 'lucide-react';
import { SurfaceCard } from '@repo/ui';
import type { Lawyer } from '../../../lib/search/mock-lawyers';

const CREDENTIALS = [
  'J.D., Harvard Law School, 2010',
  'Bar Admitted — New York, California',
  'Member, American Bar Association',
  '15+ Years Courtroom Experience',
] as const;

interface AboutTabProps {
  readonly lawyer: Lawyer;
}

export function AboutTab({ lawyer }: AboutTabProps) {
  return (
    <div className="flex flex-col gap-5">
      <SurfaceCard radius="xl" elevation="sm">
        <h3 className="font-heading text-xl font-semibold text-navy mb-3">About</h3>
        <p className="font-sans text-[15px] text-gray-800 leading-[1.7]">
          {lawyer.bio} With a strong track record in litigation and client advocacy,{' '}
          {lawyer.name.split(' ')[0]} brings both expertise and empathy to every case.
          Licensed in multiple jurisdictions, with over a decade of courtroom and settlement experience.
        </p>
      </SurfaceCard>

      <SurfaceCard radius="xl" elevation="sm">
        <h3 className="font-heading text-xl font-semibold text-navy mb-4">Credentials</h3>
        <ul className="flex flex-col gap-2.5 list-none p-0">
          {CREDENTIALS.map((c) => (
            <li key={c} className="flex items-center gap-2.5 font-sans text-sm text-gray-800">
              <Check className="size-4 text-gold shrink-0" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </SurfaceCard>
    </div>
  );
}
