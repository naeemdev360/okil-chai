'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export interface PracticeAreaPill {
  readonly label: string;
  readonly value: string;
}

export interface LegalSearchBarProps {
  readonly placeholder: string;
  readonly buttonLabel: string;
  readonly initialQuery?: string;
  readonly practiceAreaPills?: ReadonlyArray<PracticeAreaPill>;
  /** Horizontal-scroll pills (mobile search page). Defaults to wrapped/centred. */
  readonly pillsScrollable?: boolean;
  readonly onSearch: (query: string) => void;
  readonly className?: string;
}

export function LegalSearchBar({
  placeholder,
  buttonLabel,
  initialQuery = '',
  practiceAreaPills,
  pillsScrollable = false,
  onSearch,
  className,
}: LegalSearchBarProps) {
  const [query, setQuery]     = useState(initialQuery);
  const [focused, setFocused] = useState(false);

  const submit = (term: string) => onSearch(term.trim());

  const handlePillClick = (value: string) => {
    setQuery(value);
    submit(value);
  };

  return (
    <div className={className}>
      {/* ── Input row ── */}
      <div
        className="flex items-center gap-2 p-2 rounded-2xl transition-shadow duration-200"
        style={{
          background: 'rgba(255,255,255,0.94)',
          boxShadow: focused
            ? '0 8px 40px rgba(0,0,0,0.35), 0 0 0 2px rgba(200,168,75,0.45), inset 0 1px 0 rgba(255,255,255,0.8)'
            : '0 8px 40px rgba(0,0,0,0.28), 0 0 0 1px rgba(200,168,75,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        <Search
          className="size-5 ml-2 shrink-0 transition-colors duration-200"
          style={{ color: focused ? '#C8A84B' : 'rgba(100,90,70,0.50)' }}
          aria-hidden="true"
        />

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit(query)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans text-[15px] py-2.5 px-1 placeholder:text-[rgba(100,90,70,0.45)]"
          style={{ color: '#1a1408' }}
        />

        <button
          type="button"
          onClick={() => submit(query)}
          className="shrink-0 px-6 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-[0.97]"
          style={{
            background: 'linear-gradient(138deg, #E8C96A 0%, #C8A84B 100%)',
            color: '#0F1F3D',
            boxShadow: '0 4px 18px rgba(200,168,75,0.40)',
          }}
        >
          {buttonLabel}
        </button>
      </div>

      {/* ── Practice area pills ── */}
      {practiceAreaPills && practiceAreaPills.length > 0 && (
        <div
          className={
            pillsScrollable
              ? 'flex gap-2 mt-5 overflow-x-auto scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap pb-1'
              : 'flex flex-wrap gap-2 justify-center mt-5'
          }
        >
          {practiceAreaPills.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => handlePillClick(value)}
              className="
                flex-none font-sans text-xs rounded-full px-3.5 py-1.5 whitespace-nowrap
                transition-all duration-150 backdrop-blur-sm
                text-white/70 border border-white/[0.14] bg-white/[0.05]
                hover:text-gold hover:border-gold/50 hover:bg-gold/10
              "
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
