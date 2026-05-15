import { CreditCard } from 'lucide-react';
import { Badge } from '@repo/ui';
import { SectionLabel } from '../../ui/SectionLabel';

export function PayoutMethodCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <SectionLabel>Payout method</SectionLabel>
      <div className="flex items-center gap-2.5 p-3 bg-cream rounded-md mb-3">
        <div className="w-9 h-9 rounded bg-navy flex items-center justify-center shrink-0">
          <CreditCard size={18} className="text-gold" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-sans text-[13px] text-navy font-semibold">Bank of America</div>
          <div className="font-mono text-[11px] text-gray-600">•••• 4421 · Checking</div>
        </div>
        <Badge variant="available">Active</Badge>
      </div>
      <button className="w-full py-2 border border-gray-200 rounded-md font-sans text-[12px] text-navy font-medium hover:bg-gray-50 transition-colors">
        Manage payout methods
      </button>
    </div>
  );
}
