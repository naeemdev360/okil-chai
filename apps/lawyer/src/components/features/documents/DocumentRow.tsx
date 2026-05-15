import { Download, Eye, MessageSquare } from 'lucide-react';
import type { Document } from '../../../types/lawyer.types';

interface DocumentRowProps {
  readonly document: Document;
  readonly divider?: boolean;
}

const EXT_STYLE: Record<string, { bg: string; color: string }> = {
  pdf:  { bg: 'bg-error-bg',   color: 'text-error'   },
  docx: { bg: 'bg-success-bg', color: 'text-success' },
  zip:  { bg: 'bg-warning-bg', color: 'text-warning' },
};

export function DocumentRow({ document: f, divider }: DocumentRowProps) {
  const extStyle = EXT_STYLE[f.ext] ?? EXT_STYLE['pdf']!;

  return (
    <tr className={divider ? 'border-t border-gray-100' : ''}>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${extStyle.bg}`}>
            <span className={`font-sans text-[9px] font-bold uppercase ${extStyle.color}`}>{f.ext}</span>
          </div>
          <div className="min-w-0">
            <div className="font-sans text-[13px] text-navy font-medium truncate">{f.name}</div>
            {f.shared && (
              <div className="font-sans text-[10px] text-gray-400">Shared with {f.shared}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-3 py-3 font-sans text-[13px] text-gray-600">{f.case}</td>
      <td className="px-3 py-3 font-sans text-[13px] text-gray-600">{f.modified}</td>
      <td className="px-3 py-3 font-mono text-[12px] text-gray-600">{f.size}</td>
      <td className="px-5 py-3 text-right">
        <div className="inline-flex gap-1">
          <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Eye size={13} className="text-gray-600" strokeWidth={1.5} />
          </button>
          <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Download size={13} className="text-gray-600" strokeWidth={1.5} />
          </button>
          <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <MessageSquare size={13} className="text-gray-600" strokeWidth={1.5} />
          </button>
        </div>
      </td>
    </tr>
  );
}
