interface DashboardStatTileProps {
  readonly label: string;
  readonly value: string;
  readonly sub: string;
  readonly accentClass: string;
}

export function DashboardStatTile({ label, value, sub, accentClass }: DashboardStatTileProps) {
  return (
    <div className={`bg-white rounded-xl p-5 border border-gray-100 border-l-[3px] ${accentClass}`}>
      <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400 font-sans mb-2">
        {label}
      </div>
      <div className="font-heading text-[26px] font-bold text-navy leading-none">{value}</div>
      <div className="text-[12px] text-gray-600 mt-1.5 font-sans">{sub}</div>
    </div>
  );
}
