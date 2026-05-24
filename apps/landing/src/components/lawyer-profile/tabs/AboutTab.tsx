import { Check, Globe2, Briefcase, BookOpen } from 'lucide-react';
import { SurfaceCard } from '@repo/ui';
import type { LawyerPublicProfileResponse } from '@repo/shared';

interface AboutTabProps {
  readonly lawyer: LawyerPublicProfileResponse;
}

export function AboutTab({ lawyer }: AboutTabProps) {
  const credentials: { icon: React.ElementType; text: string }[] = [];

  if (lawyer.yearsOfExperience != null) {
    credentials.push({ icon: Briefcase, text: `${lawyer.yearsOfExperience}+ years of experience` });
  }
  if (lawyer.totalConsultations > 0) {
    credentials.push({ icon: BookOpen, text: `${lawyer.totalConsultations}+ consultations completed` });
  }
  if (lawyer.languages.length > 0) {
    credentials.push({ icon: Globe2, text: `Speaks: ${lawyer.languages.join(', ')}` });
  }

  const firstName = lawyer.firstName;

  return (
    <div className="flex flex-col gap-5">
      <SurfaceCard radius="xl" elevation="sm">
        <h3 className="font-heading text-xl font-semibold text-navy mb-3">About</h3>
        {lawyer.bio ? (
          <p className="font-sans text-[15px] text-gray-800 leading-[1.7]">{lawyer.bio}</p>
        ) : (
          <p className="font-sans text-[15px] text-gray-400 italic">
            {firstName} hasn't added a bio yet.
          </p>
        )}
      </SurfaceCard>

      {lawyer.specializations.length > 0 && (
        <SurfaceCard radius="xl" elevation="sm">
          <h3 className="font-heading text-xl font-semibold text-navy mb-4">Practice Areas</h3>
          <div className="flex flex-wrap gap-2">
            {lawyer.specializations.map((spec) => (
              <span
                key={spec.slug}
                className={`inline-flex items-center font-sans text-sm rounded-full px-3.5 py-1.5 ${
                  spec.isPrimary
                    ? 'bg-navy text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                }`}
              >
                {spec.name}
              </span>
            ))}
          </div>
        </SurfaceCard>
      )}

      {credentials.length > 0 && (
        <SurfaceCard radius="xl" elevation="sm">
          <h3 className="font-heading text-xl font-semibold text-navy mb-4">Credentials</h3>
          <ul className="flex flex-col gap-3 list-none p-0">
            {credentials.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 font-sans text-sm text-gray-800">
                <span className="flex items-center justify-center size-7 rounded-full bg-gold/10 shrink-0">
                  <Icon className="size-3.5 text-gold" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </SurfaceCard>
      )}

      <SurfaceCard radius="xl" elevation="sm">
        <h3 className="font-heading text-xl font-semibold text-navy mb-4">Why Choose {firstName}?</h3>
        <ul className="flex flex-col gap-2.5 list-none p-0">
          {[
            'Verified and approved by OkilChai',
            'Transparent pricing — no hidden fees',
            'Book instantly or schedule ahead',
            '100% satisfaction guarantee on first consultation',
          ].map((point) => (
            <li key={point} className="flex items-center gap-2.5 font-sans text-sm text-gray-800">
              <Check className="size-4 text-gold shrink-0" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      </SurfaceCard>
    </div>
  );
}
