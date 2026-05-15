import { SectionLabel } from '../../ui/SectionLabel';

export function PlatformFeeCard() {
  return (
    <div className="bg-navy text-white rounded-xl p-5">
      <SectionLabel><span className="text-gold">Platform fee</span></SectionLabel>
      <div className="font-heading text-[28px] font-bold mb-1">15%</div>
      <p className="font-sans text-[12px] text-white/70 leading-relaxed mb-3">
        LegalConnect takes 15% per consultation. Drops to 12% after 50 consultations this year (you're at 42).
      </p>
      <div className="h-1.5 bg-white/15 rounded-full overflow-hidden mb-1.5">
        <div className="w-[84%] h-full bg-gold" />
      </div>
      <div className="font-sans text-[11px] text-white/60">8 more to unlock 12%</div>
    </div>
  );
}
