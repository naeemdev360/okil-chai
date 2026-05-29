import { ChevronRight } from 'lucide-react';
import { appUrls } from '../../../lib/app-urls';

/** Practice areas surfaced to brand-new clients as discovery entry points. */
const PRACTICE_AREAS = [
  { name: 'Family Law',           lawyers: 142, from: 80,  emoji: '👪' },
  { name: 'Criminal Law',         lawyers: 88,  from: 120, emoji: '⚖️' },
  { name: 'Immigration',          lawyers: 64,  from: 150, emoji: '🌍' },
  { name: 'Corporate Law',        lawyers: 215, from: 180, emoji: '🏢' },
  { name: 'Property',             lawyers: 96,  from: 100, emoji: '🏠' },
  { name: 'Labour & Employment',  lawyers: 54,  from: 90,  emoji: '💼' },
] as const;

function goToSearch(): void {
  window.location.href = appUrls.search;
}

/** Grid of popular practice areas linking into lawyer search. */
export function PracticeAreasGrid() {
  return (
    <>
      <h2 className="mb-3.5 font-heading text-xl font-semibold text-navy">Popular practice areas</h2>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICE_AREAS.map((area) => (
          <button
            key={area.name}
            onClick={goToSearch}
            className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all duration-base hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-gold-pale text-[22px]">
              {area.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-[15px] font-semibold text-navy">{area.name}</p>
              <p className="font-sans text-[11px] text-gray-400">
                {area.lawyers} lawyers · from ${area.from}/hr
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))}
      </div>
    </>
  );
}
