import { Badge, Button } from '@okil-chai/ui';
import { TRANSACTIONS } from '../../lib/mock-data';

const PAYMENT_STATS = [
  { label: 'Total Spent',  value: '$1,240', sub: '7 consultations'  },
  { label: 'This Month',   value: '$360',   sub: '2 consultations'  },
  { label: 'Saved Cards',  value: '2',      sub: 'Visa & Mastercard' },
] as const;

const PAYMENT_METHODS = [
  { brand: 'Visa',       last: '4242', exp: '12/27', primary: true  },
  { brand: 'Mastercard', last: '8910', exp: '06/26', primary: false },
] as const;

export function PaymentsPage() {
  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold text-navy sm:text-[26px] mb-6">Payments & Invoices</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3.5 mb-7 sm:grid-cols-3">
        {PAYMENT_STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-5 py-5">
            <p className="text-[12px] text-gray-400 font-sans font-semibold uppercase tracking-[0.06em] mb-1.5">
              {s.label}
            </p>
            <p className="font-heading text-[26px] font-bold text-navy">{s.value}</p>
            <p className="text-xs text-gray-600 font-sans mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Payment methods */}
      <h2 className="font-heading text-lg font-semibold text-navy mb-3.5">Payment Methods</h2>
      <div className="flex flex-col gap-2.5 mb-8">
        {PAYMENT_METHODS.map((c) => (
          <div
            key={c.last}
            className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 sm:px-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5"
          >
            <div className="w-11 h-7 rounded bg-navy flex items-center justify-center shrink-0">
              <span className="text-white font-mono text-[10px] font-bold tracking-wider">
                {c.brand.slice(0, 4).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-navy font-sans">
                {c.brand} ending in {c.last}
              </p>
              <p className="text-xs text-gray-600 font-sans">Expires {c.exp}</p>
            </div>
            {c.primary && <Badge variant="pro">Primary</Badge>}
            <Button variant="ghost" size="sm" className="self-start sm:self-auto sm:ml-auto">
              Edit
            </Button>
          </div>
        ))}
        <button className="border-[1.5px] border-dashed border-gray-200 rounded-xl py-3.5 text-sm font-sans text-gray-600 hover:bg-gray-50 transition-colors">
          + Add Payment Method
        </button>
      </div>

      {/* Transactions */}
      <h2 className="font-heading text-lg font-semibold text-navy mb-3.5">Recent Transactions</h2>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {TRANSACTIONS.map((t, i) => (
          <div
            key={t.id}
            className={`px-4 py-4 sm:px-5 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5${
              i < TRANSACTIONS.length - 1 ? ' border-b border-gray-100' : ''
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy font-sans">{t.lawyer}</p>
              <p className="text-xs text-gray-600 font-sans mt-0.5">
                {t.desc} · {t.date}
              </p>
            </div>
            <Badge variant={t.status === 'paid' ? 'available' : 'cancelled'}>
              {t.status === 'paid' ? '✓ Paid' : '↺ Refunded'}
            </Badge>
            <span className="font-heading text-base font-semibold text-navy min-w-[60px] sm:text-right">
              ${t.amount}
            </span>
            <Button variant="ghost" size="sm" className="self-start sm:self-auto">
              Receipt
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
