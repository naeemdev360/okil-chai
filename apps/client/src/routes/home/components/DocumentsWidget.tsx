import { FileText, Lock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DOCUMENTS } from '../../../lib/mock-data';

export function DocumentsWidget() {
  const preview = DOCUMENTS.slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <Lock size={14} className="text-success" />
          <span className="font-heading text-[15px] font-semibold text-navy">Documents</span>
        </div>
        <Link
          to="/documents"
          className="text-xs font-semibold text-gold font-sans hover:opacity-75 transition-opacity"
        >
          View all
        </Link>
      </div>

      <div className="px-5 py-4">
        {preview.map((d, i) => (
          <div key={d.id} className={`flex items-center gap-2.5${i === 0 ? ' mb-2.5' : ''}`}>
            <div className="w-8 h-8 rounded bg-error-bg flex items-center justify-center shrink-0">
              <FileText size={14} className="text-error" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-navy font-sans truncate">{d.name}</p>
              <p className="text-[11px] text-gray-400 font-sans">
                {d.date} · Shared w/ {d.shared}
              </p>
            </div>
          </div>
        ))}

        <Link
          to="/documents"
          className="flex items-center justify-center gap-1.5 mt-3.5 text-xs text-gray-600 font-sans border border-dashed border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
        >
          <Plus size={12} className="text-gray-400" /> Upload Document
        </Link>
      </div>
    </div>
  );
}
