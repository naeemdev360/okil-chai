import { ToggleSwitch } from '@repo/ui';
import { useState } from 'react';
import { SectionLabel } from '../../ui/SectionLabel';

const DEFAULTS = [
  { d: 'Mon – Fri', t: '9:00 AM – 6:00 PM',  on: true  },
  { d: 'Saturday',  t: '10:00 AM – 2:00 PM', on: true  },
  { d: 'Sunday',    t: 'Closed',              on: false },
] as const;

export function WeeklyDefaultsCard() {
  const [toggles, setToggles] = useState(DEFAULTS.map(d => d.on));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <SectionLabel>Weekly defaults</SectionLabel>
      <div className="flex flex-col gap-2">
        {DEFAULTS.map((r, i) => (
          <div key={r.d} className="flex justify-between items-center py-1.5">
            <div>
              <div className="font-sans text-[13px] text-navy font-medium">{r.d}</div>
              <div className="font-sans text-[11px] text-gray-400">{r.t}</div>
            </div>
            <ToggleSwitch
              checked={toggles[i] ?? false}
              onChange={v => setToggles(prev => prev.map((old, j) => j === i ? v : old))}
            />
          </div>
        ))}
      </div>
      <button className="mt-3 w-full py-2 border border-gray-200 rounded-md font-sans text-[12px] text-navy font-medium hover:bg-gray-50 transition-colors">
        Edit weekly hours
      </button>
    </div>
  );
}
