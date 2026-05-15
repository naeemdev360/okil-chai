import { useState } from 'react';
import { TRANSACTIONS, TIME_FILTERS } from '../../../routes/earnings/earnings.constants';

export function TransactionsTable() {
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <>
      {/* Filter bar */}
      <div className="px-5 py-3 border-b border-gray-100 flex gap-1.5">
        {TIME_FILTERS.map((f, i) => (
          <button
            key={f}
            onClick={() => setActiveFilter(i)}
            className={[
              'px-2.5 py-1 rounded-full font-sans text-[11px] font-medium border transition-colors',
              i === activeFilter ? 'bg-navy text-white border-navy' : 'text-gray-600 border-gray-200 hover:border-navy/30',
            ].join(' ')}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[560px]">
          <thead>
            <tr className="bg-gray-50 font-sans text-[11px] text-gray-400 font-semibold tracking-[0.06em] uppercase">
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-3 py-3 text-left">Client</th>
              <th className="px-3 py-3 text-left">Service</th>
              <th className="px-3 py-3 text-right">Gross</th>
              <th className="px-3 py-3 text-right">Fee</th>
              <th className="px-5 py-3 text-right">Net</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map(tx => (
              <tr key={tx.id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-sans text-[13px] text-gray-600">{tx.date}</td>
                <td className="px-3 py-3 font-sans text-[13px] text-navy font-medium">{tx.client}</td>
                <td className="px-3 py-3 font-sans text-[13px] text-gray-600">{tx.topic}</td>
                <td className="px-3 py-3 font-mono text-[13px] text-gray-800 text-right">${tx.gross.toFixed(2)}</td>
                <td className="px-3 py-3 font-mono text-[13px] text-gray-600 text-right">−${tx.fee.toFixed(2)}</td>
                <td className="px-5 py-3 text-right">
                  <span className={`font-heading text-[13px] font-bold ${tx.status === 'pending' ? 'text-warning' : 'text-navy'}`}>
                    ${tx.net.toFixed(2)}
                  </span>
                  {tx.status === 'pending' && (
                    <div className="font-sans text-[9px] text-warning font-medium">pending</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
