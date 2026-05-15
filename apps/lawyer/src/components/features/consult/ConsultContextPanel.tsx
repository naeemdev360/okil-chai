import { useState } from 'react';
import { Check, Eye, Minus, ShieldCheck, Upload } from 'lucide-react';
import {
  CONFLICT_ITEMS,
  INTAKE_QUESTIONS,
  SESSION_DOCS,
  TIMELINE_EVENTS,
} from '../../../routes/consult/consult.constants';

type TabKey = 'intake' | 'conflict' | 'docs' | 'timeline';

const TABS: { key: TabKey; label: string; badge?: number }[] = [
  { key: 'intake',    label: 'Intake'   },
  { key: 'conflict',  label: 'Conflict' },
  { key: 'docs',      label: 'Docs',    badge: SESSION_DOCS.length },
  { key: 'timeline',  label: 'Timeline' },
];

export function ConsultContextPanel() {
  const [tab, setTab] = useState<TabKey>('intake');

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100 bg-gray-50">
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                'flex-1 py-3 font-sans text-[13px] inline-flex items-center justify-center gap-1.5 border-b-2 transition-colors',
                active
                  ? 'bg-white text-navy font-semibold border-b-gold'
                  : 'text-gray-600 font-medium border-b-transparent hover:text-navy',
              ].join(' ')}
            >
              {t.label}
              {t.badge != null && (
                <span className={`px-1.5 rounded-full font-sans text-[10px] font-semibold ${active ? 'bg-navy text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Panel content */}
      <div className="p-5 max-h-[520px] overflow-y-auto">
        {tab === 'intake' && <IntakeTab />}
        {tab === 'conflict' && <ConflictTab />}
        {tab === 'docs' && <DocsTab />}
        {tab === 'timeline' && <TimelineTab />}
      </div>
    </div>
  );
}

/* ─── Tab panels ──────────────────────────────────────────── */

function IntakeTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex items-center gap-1.5 font-sans text-[12px] text-gray-400">
        <Check size={12} className="text-success" strokeWidth={2} />
        Submitted by client · Apr 24, 11:18 AM
      </div>
      {INTAKE_QUESTIONS.map((row, i) => (
        <div key={i}>
          <div className="font-sans text-[11px] text-gray-400 font-semibold tracking-[0.06em] uppercase mb-1.5">
            {row.q}
          </div>
          <div className="font-sans text-[13.5px] text-gray-800 leading-[1.55] pl-3 border-l-2 border-l-gold">
            {row.a}
          </div>
        </div>
      ))}
    </div>
  );
}

function ConflictTab() {
  return (
    <div>
      <div className="flex gap-2.5 p-3.5 bg-success-bg border border-success/30 rounded-md mb-4">
        <ShieldCheck size={18} className="text-success shrink-0 mt-0.5" strokeWidth={1.5} />
        <div>
          <div className="font-sans text-[13px] text-success font-semibold">Conflict screen passed</div>
          <div className="font-sans text-[11px] text-success mt-0.5">Reviewed Apr 24, 11:42 AM · 1 advisory note</div>
        </div>
      </div>
      {CONFLICT_ITEMS.map((c, i) => (
        <div key={i} className={`flex gap-3 py-2.5 ${i < CONFLICT_ITEMS.length - 1 ? 'border-b border-gray-100' : ''}`}>
          <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ${c.type === 'warn' ? 'bg-warning-bg' : 'bg-success-bg'}`}>
            {c.type === 'warn'
              ? <Minus size={12} className="text-warning" strokeWidth={2} />
              : <Check size={12} className="text-success" strokeWidth={2} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-sans text-[13px] text-navy font-medium">{c.label}</div>
            <div className="font-sans text-[12px] text-gray-600 mt-0.5">{c.detail}</div>
          </div>
        </div>
      ))}
      <button className="mt-3.5 w-full py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy font-medium hover:bg-gray-50 transition-colors">
        Re-run conflict check
      </button>
    </div>
  );
}

function DocsTab() {
  return (
    <div className="flex flex-col gap-1.5">
      {SESSION_DOCS.map((d, i) => {
        const ext = d.name.split('.').pop() ?? '';
        const bg = ext === 'pdf' ? 'bg-error-bg' : ext === 'jpg' ? 'bg-[#EAF3FA]' : 'bg-gold-pale';
        return (
          <div key={i} className="flex items-center gap-3 p-3.5 border border-gray-100 rounded-md">
            <div className={`w-[34px] h-[34px] rounded flex items-center justify-center shrink-0 ${bg}`}>
              <span className="font-sans text-[9px] font-bold text-navy/60 uppercase">{ext}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-[13px] text-navy font-medium truncate">{d.name}</div>
              <div className="font-sans text-[11px] text-gray-400 mt-0.5">{d.size} · From {d.who} · {d.when}</div>
            </div>
            <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
              <Eye size={13} className="text-gray-600" strokeWidth={1.5} />
            </button>
          </div>
        );
      })}
      <button className="mt-1 py-3 border-[1.5px] border-dashed border-gray-200 rounded-md font-sans text-[13px] text-gray-600 inline-flex items-center justify-center gap-1.5 hover:border-gray-400 transition-colors">
        <Upload size={13} strokeWidth={1.5} /> Share a document with client
      </button>
    </div>
  );
}

function TimelineTab() {
  const moodClass: Record<string, string> = {
    navy:    'bg-navy',
    success: 'bg-success',
    gray:    'bg-gray-200',
  };

  return (
    <div className="relative pl-5">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-1.5 bottom-4 w-0.5 bg-gray-100" />

      {TIMELINE_EVENTS.map((e, i) => (
        <div key={i} className="relative pb-3.5">
          <div className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-[3px] border-white ${moodClass[e.mood] ?? 'bg-gray-200'}`} />
          <div className="font-mono text-[11px] text-gray-400">{e.t}</div>
          <div className="font-sans text-[13px] text-gray-800 font-medium">{e.label}</div>
        </div>
      ))}
      <div className="font-sans text-[12px] text-gray-400 italic mt-2">Session in progress…</div>
    </div>
  );
}
