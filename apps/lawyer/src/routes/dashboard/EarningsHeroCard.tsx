import { Badge, DecorativeOrb } from '@repo/ui';
import type { Earnings } from '../../types/lawyer.types';

const SPARKLINE_HEIGHTS = [38, 52, 30, 72, 58, 82, 68, 92, 78, 94, 72, 100] as const;

interface EarningsHeroCardProps {
  readonly earnings: Earnings;
}

export function EarningsHeroCard({ earnings }: EarningsHeroCardProps) {
  return (
    <div className="relative bg-navy text-white rounded-xl p-7 overflow-hidden">
      <DecorativeOrb appearance="gold-fill-soft" size="none" className="-top-16 -right-10 w-52 h-52" />
      <DecorativeOrb appearance="gold-fill-soft" size="none" className="-bottom-10 right-16 w-32 h-32 bg-gold/5" />

      <div className="relative">
        <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gold font-sans mb-2.5">
          Earnings this month
        </div>
        <div className="flex items-baseline gap-4 flex-wrap mb-1.5">
          <span className="font-heading text-[44px] font-bold tracking-tight leading-none">
            ${earnings.thisMonth.toLocaleString()}
          </span>
          <Badge variant="available">+34% vs last month</Badge>
        </div>
        <p className="text-[13px] text-white/65">
          Next payout{' '}
          <strong className="text-white">${earnings.pending.toLocaleString()}</strong>
          {' '}on{' '}
          <strong className="text-gold">{earnings.payoutDate}</strong>
        </p>

        <div className="flex items-end gap-1.5 mt-5 h-14">
          {SPARKLINE_HEIGHTS.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 rounded-t-[3px] ${i === 11 ? 'bg-gold' : 'bg-white/18'}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-white/40 font-sans">
          <span>May '25</span>
          <span>Apr '26</span>
        </div>
      </div>
    </div>
  );
}
