import { Calendar, CreditCard, FileText, Shield } from 'lucide-react';
import { SectionLabel } from '../../ui/SectionLabel';

const ACTIONS = [
  { Icon: FileText,    label: 'Send intake form'       },
  { Icon: CreditCard,  label: 'Send pre-payment'       },
  { Icon: Calendar,    label: 'Schedule follow-up'     },
  { Icon: Shield,      label: 'Send engagement letter' },
] as const;

export function QuickActionsCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <SectionLabel>During-call actions</SectionLabel>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {ACTIONS.map(({ Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-2.5 p-3.5 border border-gray-100 rounded-md text-left font-sans text-[13px] text-gray-800 font-medium hover:bg-gray-50 hover:border-gray-200 transition-colors"
          >
            <div className="w-7 h-7 rounded bg-gold-pale flex items-center justify-center shrink-0">
              <Icon size={14} className="text-navy" strokeWidth={1.5} />
            </div>
            <span className="flex-1 min-w-0 truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
