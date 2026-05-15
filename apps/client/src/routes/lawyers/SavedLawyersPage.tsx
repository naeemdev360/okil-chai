import { Avatar, Button, Reveal, RevealGroup, StarRating } from '@repo/ui';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SAVED_LAWYERS } from '../../lib/mock-data';

export function SavedLawyersPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<ReadonlySet<string>>(
    () => new Set(SAVED_LAWYERS.map((l) => l.id)),
  );

  const toggleSaved = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  return (
    <RevealGroup className="min-w-0">
      <Reveal>
        <h1 className="font-heading text-xl font-semibold text-navy sm:text-[24px] md:text-[26px] mb-1.5 leading-tight">
          Saved Lawyers
        </h1>
        <p className="text-sm text-gray-600 font-sans mb-5 max-w-2xl md:mb-6">
          Lawyers you've bookmarked for future consultations.
        </p>
      </Reveal>

      <Reveal>
        <ul className="flex list-none flex-col gap-4 p-0">
          {SAVED_LAWYERS.map((l) => (
            <li key={l.id}>
              <article className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:p-5 sm:gap-4">
                <Avatar initials={l.initials} size="xl" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h2 className="min-w-0 pr-1 font-heading text-[15px] font-semibold leading-snug text-navy sm:text-base">
                      {l.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => toggleSaved(l.id)}
                      aria-label={saved.has(l.id) ? 'Remove from saved' : 'Save lawyer'}
                      className="-m-1.5 shrink-0 rounded-md p-2 text-gray-400 transition-transform hover:scale-105 hover:bg-gray-50 active:scale-95"
                    >
                      <Heart
                        size={18}
                        className={saved.has(l.id) ? 'fill-error text-error' : 'text-gray-300'}
                        aria-hidden
                      />
                    </button>
                  </div>
                  <p className="mb-2 text-xs leading-relaxed text-gray-600 font-sans sm:text-[13px]">
                    {l.spec} · {l.city}
                  </p>
                  <div className="mb-3 min-w-0 sm:mb-2">
                    <StarRating rating={l.rating} count={l.count} size="xs" />
                  </div>
                  <div className="mt-auto flex flex-col gap-2.5 sm:mt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span className="font-heading text-[15px] font-semibold tabular-nums text-navy sm:text-base">
                      ${l.rate}
                      <span className="font-sans text-xs font-normal text-gray-400">/hr</span>
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full shrink-0 sm:w-auto"
                      onClick={() => navigate('/booking')}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Reveal>
    </RevealGroup>
  );
}
