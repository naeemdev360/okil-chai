interface EarningsStatProps {
  readonly label: string;
  readonly value: string;
  readonly sub: string;
  readonly accent?: string;
  readonly dark?: boolean;
}

export function EarningsStat({ label, value, sub, accent, dark }: EarningsStatProps) {
  return (
    <div
      className={[
        'rounded-xl p-5 border',
        dark
          ? 'bg-navy text-white border-transparent'
          : `bg-white text-navy border-gray-100 border-l-[3px] ${accent ?? ''}`,
      ].join(' ')}
    >
      <div className={`font-sans text-[11px] font-semibold tracking-[0.08em] uppercase mb-2 ${dark ? 'text-white/55' : 'text-gray-400'}`}>
        {label}
      </div>
      <div className={`font-heading text-[26px] font-bold leading-none ${dark ? 'text-white' : 'text-navy'}`}>
        {value}
      </div>
      <div className={`font-sans text-[12px] mt-1.5 ${dark ? 'text-white/55' : 'text-gray-600'}`}>
        {sub}
      </div>
    </div>
  );
}
