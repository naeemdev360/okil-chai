import type { LucideIcon } from 'lucide-react';
import { CheckCircle, CreditCard, FileText, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ACTIVITY_ITEMS } from '../../../lib/mock-data';

const ICON_MAP: Record<string, LucideIcon> = {
  'check-circle': CheckCircle,
  'message':      MessageSquare,
  'file':         FileText,
  'credit-card':  CreditCard,
};

export function RecentActivityFeed() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-3.5 border-b border-gray-100">
        <span className="font-heading text-base font-semibold text-navy">Recent Activity</span>
      </div>

      {ACTIVITY_ITEMS.map((a, i) => {
        const IconComp = ICON_MAP[a.icon];
        return (
          <div
            key={i}
            className={`px-4 py-3.5 sm:px-6 sm:py-3.5 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3.5${
              i < ACTIVITY_ITEMS.length - 1 ? ' border-b border-gray-100' : ''
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${a.colorClass}`}>
              {IconComp && <IconComp size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy font-sans mb-0.5">{a.text}</p>
              <p className="text-xs text-gray-400 font-sans">{a.sub}</p>
            </div>
            <Link
              to={a.actionRoute}
              className="text-xs font-semibold text-gold font-sans shrink-0 hover:opacity-75 transition-opacity sm:ml-auto sm:self-center"
            >
              {a.action}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
