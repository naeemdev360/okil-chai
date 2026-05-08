import { Button } from '@okil-chai/ui';
import { Download, FileText, Lock, Plus } from 'lucide-react';
import { DOCUMENTS } from '../../lib/mock-data';

export function DocumentsPage() {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-1.5">
        <h1 className="font-heading text-[22px] font-semibold text-navy sm:text-[26px]">Documents</h1>
        <Button variant="gold" className="w-full shrink-0 sm:w-auto">
          <Plus size={14} /> Upload Document
        </Button>
      </div>

      <p className="flex items-center gap-1.5 text-sm text-gray-600 font-sans mb-6">
        <Lock size={14} className="text-success shrink-0" />
        All documents are encrypted end-to-end. Only you and lawyers you share with can view them.
      </p>

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[11px] text-gray-400 font-sans font-semibold uppercase tracking-[0.06em]">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-3 py-3 text-left">Shared with</th>
              <th className="px-3 py-3 text-left">Uploaded</th>
              <th className="px-3 py-3 text-right">Size</th>
              <th className="px-6 py-3 text-right" />
            </tr>
          </thead>
          <tbody>
            {DOCUMENTS.map((d) => (
              <tr key={d.id} className="border-t border-gray-100">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded bg-error-bg flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-error" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy font-sans">{d.name}</p>
                      {d.encrypted && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-success font-sans">
                          <Lock size={9} /> Encrypted
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-[13px] text-gray-600 font-sans">
                  {d.shared ?? <span className="text-gray-400">Private</span>}
                </td>
                <td className="px-3 py-3.5 text-[13px] text-gray-600 font-sans">{d.date}</td>
                <td className="px-3 py-3.5 text-[13px] text-gray-600 font-sans text-right">{d.size}</td>
                <td className="px-6 py-3.5 text-right">
                  <button className="w-8 h-8 rounded border border-gray-200 bg-white inline-flex items-center justify-center hover:bg-gray-50 transition-colors ml-auto">
                    <Download size={14} className="text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
