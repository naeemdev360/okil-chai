import { Shield } from 'lucide-react';

interface DangerRowProps {
  readonly title: string;
  readonly desc: string;
  readonly action: string;
  readonly critical?: boolean;
  readonly variant?: 'ghost' | 'danger';
}

function DangerRow({ title, desc, action, critical, variant = 'danger' }: DangerRowProps) {
  return (
    <div className={`p-4 border rounded-md bg-white ${critical ? 'border-error/40' : 'border-gray-100'}`}>
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <div className={`font-sans text-[14px] font-semibold mb-1 ${critical ? 'text-error' : 'text-navy'}`}>
            {title}
          </div>
          <div className="font-sans text-[12px] text-gray-600 leading-[1.55]">{desc}</div>
        </div>
        {variant === 'ghost' ? (
          <button className="px-4 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-gray-600 hover:bg-gray-50 transition-colors shrink-0">
            {action}
          </button>
        ) : (
          <button className="px-4 py-2 border border-error/40 text-error rounded-md font-sans text-[13px] font-medium hover:bg-error-bg transition-colors shrink-0">
            {action}
          </button>
        )}
      </div>
    </div>
  );
}

export function DangerPanel() {
  return (
    <>
      <div className="flex gap-3 p-4 bg-error-bg border border-error/30 rounded-md mb-6">
        <Shield size={18} className="text-error shrink-0 mt-0.5" strokeWidth={1.5} />
        <p className="font-sans text-[13px] text-error leading-[1.55]">
          <strong>These actions are permanent.</strong> Pausing your profile is reversible, but deactivation and deletion are not. Make sure no active cases depend on this account before proceeding.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <DangerRow
          title="Pause profile"
          desc="Hide your profile from search and stop receiving new booking requests. You can resume anytime — active bookings are unaffected."
          action="Pause"
        />
        <DangerRow
          title="Export all my data"
          desc="Download a complete archive of your profile, bookings, messages, and documents. Available within 48 hours."
          action="Request export"
          variant="ghost"
        />
        <DangerRow
          title="Deactivate account"
          desc="Permanently disable your account. Your data is retained for 90 days for legal and tax purposes, then deleted."
          action="Deactivate…"
          critical
        />
        <DangerRow
          title="Delete account & all data"
          desc="Erase everything immediately. Past invoices and 1099-K records are retained for 7 years per IRS requirements; everything else is deleted."
          action="Delete account…"
          critical
        />
      </div>
    </>
  );
}
