import { DollarSign, Download } from 'lucide-react';
import { Reveal, RevealGroup } from '@repo/ui';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionCard } from '../../components/ui/SectionCard';
import { EarningsStat } from '../../components/features/earnings/EarningsStat';
import { TransactionsTable } from '../../components/features/earnings/TransactionsTable';
import { PayoutMethodCard } from '../../components/features/earnings/PayoutMethodCard';
import { PlatformFeeCard } from '../../components/features/earnings/PlatformFeeCard';
import type { MockData } from '../../types/lawyer.types';

interface EarningsPageProps {
  readonly data: MockData;
}

export function EarningsPage({ data }: EarningsPageProps) {
  const { earnings } = data;

  return (
    <RevealGroup className="flex flex-col gap-4">
      <Reveal>
        <PageHeader
          title="Earnings & payouts"
          subtitle="Track consultation revenue and payout schedule"
          actions={
            <>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy font-medium hover:bg-gray-50 transition-colors">
                <Download size={14} strokeWidth={1.5} /> Tax statement
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy text-white rounded-md font-sans text-[13px] font-medium hover:bg-navy-mid transition-colors">
                <DollarSign size={14} strokeWidth={1.5} /> Withdraw to bank
              </button>
            </>
          }
        />
      </Reveal>

      <Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <EarningsStat dark label="Available balance" value={`$${earnings.pending.toLocaleString()}`} sub={`Next payout ${earnings.payoutDate}`} />
          <EarningsStat label="This month"  value={`$${earnings.thisMonth.toLocaleString()}`} sub="+34% vs last"     accent="border-l-success" />
          <EarningsStat label="Last month"  value={`$${earnings.lastMonth.toLocaleString()}`} sub="28 consultations" accent="border-l-gray-400" />
          <EarningsStat label="Lifetime"    value={`$${earnings.lifetime.toLocaleString()}`}  sub="Since Feb 2026"  accent="border-l-gold" />
        </div>
      </Reveal>

      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start">
          <SectionCard title="Transactions">
            <TransactionsTable />
          </SectionCard>

          <div className="flex flex-col gap-3">
            <PayoutMethodCard />
            <PlatformFeeCard />
          </div>
        </div>
      </Reveal>
    </RevealGroup>
  );
}
