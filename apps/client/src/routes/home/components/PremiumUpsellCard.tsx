import { Button, DecorativeOrb } from '@okil-chai/ui';
import { Zap } from 'lucide-react';

export function PremiumUpsellCard() {
  return (
    <div className="bg-navy rounded-xl p-5 relative overflow-hidden">
      <DecorativeOrb appearance="gold-fill" size="md" className="-top-8 -right-8" />
      <div className="relative">
        <div className="flex items-center gap-1.5 mb-2">
          <Zap size={14} className="text-gold" />
          <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-[0.1em]">Premium</span>
        </div>
        <p className="font-heading text-[15px] font-semibold text-white mb-1">Document Vault + E-Sign</p>
        <p className="text-xs text-white/60 leading-relaxed mb-3.5">
          Encrypted storage, e-signatures, and unlimited sharing for $9.99/mo
        </p>
        <Button variant="gold" size="sm" className="w-full justify-center">Upgrade Now</Button>
      </div>
    </div>
  );
}
