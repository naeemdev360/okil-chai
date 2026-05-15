import { Download, Edit, Sparkles } from 'lucide-react';
import { NOTE_SHORTCUTS } from '../../../routes/consult/consult.constants';

interface SessionNotesPadProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function SessionNotesPad({ value, onChange }: SessionNotesPadProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Edit size={14} className="text-gray-600" strokeWidth={1.5} />
          <span className="font-heading text-[15px] font-semibold text-navy">Session notes</span>
          <span className="font-sans text-[11px] text-gray-400">Private · auto-saved 12s ago</span>
        </div>
        <div className="flex gap-1.5">
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-md font-sans text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">
            <Sparkles size={11} className="text-gold" strokeWidth={1.5} /> Summarize
          </button>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 rounded-md font-sans text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={11} strokeWidth={1.5} /> Export
          </button>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full min-h-[160px] px-4 py-3.5 border-none outline-none resize-y font-mono text-[13px] text-gray-800 leading-[1.7] bg-white"
      />

      {/* Shortcuts */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex gap-2 flex-wrap">
        {NOTE_SHORTCUTS.map(s => (
          <button
            key={s}
            className="px-2.5 py-1 border border-gray-200 rounded-full bg-white font-sans text-[11px] text-gray-600 hover:border-gray-400 transition-colors"
          >
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}
