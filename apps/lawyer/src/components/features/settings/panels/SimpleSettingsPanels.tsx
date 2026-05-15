/**
 * Smaller settings panels bundled together — Privacy, Hours, Consultation, Tax, Payouts, Support.
 * Each has a single clear concern and is compact enough not to warrant its own file.
 */
import { Download, HelpCircle, Mail, MessageSquare, Upload, Video } from 'lucide-react';
import { Badge, ToggleSwitch } from '@repo/ui';
import { SettingGroup } from '../SettingGroup';
import { SettingRow } from '../SettingRow';
import { SettingField, SettingSelect } from '../SettingField';

/* ── Privacy ─────────────────────────────────────────────── */
export function PrivacyPanel() {
  return (
    <>
      <SettingGroup title="Profile visibility">
        <SettingRow label="Show profile in search" sub="Clients can find and book you">
          <ToggleSwitch checked={true} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="Show 'Recently active'" sub="Display when you were last online">
          <ToggleSwitch checked={true} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="Show reviews publicly" sub="142 reviews currently visible on your profile">
          <ToggleSwitch checked={true} onChange={() => {}} />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Communication" last>
        <SettingRow label="Accept anonymous reviews" sub="Allow clients to leave reviews without showing their name">
          <ToggleSwitch checked={true} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="Auto-respond to first message" sub="Send an acknowledgement within 5 minutes of a new inquiry">
          <ToggleSwitch checked={false} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="Allow data export" sub="You can request a download of all your data at any time">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={13} strokeWidth={1.5} /> Request export
          </button>
        </SettingRow>
      </SettingGroup>
    </>
  );
}

/* ── Working Hours ───────────────────────────────────────── */
const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export function HoursPanel() {
  return (
    <SettingGroup title="Default weekly hours" last>
      <p className="font-sans text-[12px] text-gray-600 mb-4 leading-relaxed">
        These hours appear as available by default. You can still block specific dates from the Availability calendar.
      </p>
      {WEEK_DAYS.map((d, i) => {
        const closed = i === 6;
        const saturday = i === 5;
        return (
          <div key={d} className={`grid grid-cols-[120px_44px_1fr_1fr] gap-3 items-center py-3 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
            <span className="font-sans text-[13px] text-navy font-medium">{d}</span>
            <ToggleSwitch checked={!closed} onChange={() => {}} />
            {closed ? (
              <span className="col-span-2 font-sans text-[12px] text-gray-400 italic">Closed</span>
            ) : (
              <>
                <input defaultValue={saturday ? '10:00 AM' : '9:00 AM'} className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-md font-mono text-[13px] text-navy outline-none focus:border-navy transition-colors" />
                <input defaultValue={saturday ? '2:00 PM' : '6:00 PM'}  className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-md font-mono text-[13px] text-navy outline-none focus:border-navy transition-colors" />
              </>
            )}
          </div>
        );
      })}
    </SettingGroup>
  );
}

/* ── Consultation Prefs ──────────────────────────────────── */
export function ConsultPanel() {
  return (
    <>
      <SettingGroup title="Video consultations">
        <SettingRow label="Default platform" sub="Used for new video bookings">
          <select className="px-3 py-2 border-[1.5px] border-gray-200 rounded-md font-sans text-[13px] text-navy bg-white outline-none focus:border-navy appearance-none cursor-pointer" defaultValue="legalconnect">
            <option value="legalconnect">LegalConnect Meet (built-in)</option>
            <option>Zoom</option>
            <option>Google Meet</option>
          </select>
        </SettingRow>
        <SettingRow label="Auto-record consultations" sub="Stored for 90 days, only you and the client can access">
          <ToggleSwitch checked={false} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="Waiting room" sub="Approve clients individually before they join">
          <ToggleSwitch checked={true} onChange={() => {}} />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Session defaults">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingSelect label="Default duration"       options={['30 minutes','45 minutes','60 minutes','90 minutes']} />
          <SettingSelect label="Buffer between sessions" options={['No buffer','10 minutes','15 minutes','30 minutes']} />
          <SettingSelect label="Booking notice"         options={['At least 2 hours','At least 24 hours','At least 48 hours']} />
          <SettingSelect label="Max bookings per day"   options={['Unlimited','4 per day','6 per day','8 per day']} />
        </div>
      </SettingGroup>

      <SettingGroup title="In-person consultations" last>
        <SettingRow label="Accept in-person bookings" sub="Shows the in-person option on your profile">
          <ToggleSwitch checked={true} onChange={() => {}} />
        </SettingRow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <SettingField label="Office address" defaultValue="100 Beacon St, Boston MA 02116" />
          <SettingField label="Travel radius"  defaultValue="15 miles" />
        </div>
      </SettingGroup>
    </>
  );
}

/* ── Tax ─────────────────────────────────────────────────── */
const TAX_DOCS = [
  { name: 'W-9 Form (2026)',                 date: 'Feb 14, 2026', size: '180 KB' },
  { name: '1099-K Statement (2025)',          date: 'Jan 28, 2026', size: '240 KB' },
  { name: 'Annual earnings summary (2025)',   date: 'Jan 2, 2026',  size: '88 KB'  },
] as const;

export function TaxPanel() {
  return (
    <>
      <div className="flex gap-3 p-4 bg-success-bg border border-success/30 rounded-md mb-6">
        <span className="text-success mt-0.5">✓</span>
        <p className="font-sans text-[13px] text-success leading-relaxed">
          <strong>W-9 on file.</strong> Submitted Feb 14, 2026. Your 1099-K will be sent to james@mercerlaw.com by January 31, 2027.
        </p>
      </div>

      <SettingGroup title="Tax information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingField label="Legal name on file"         defaultValue="James Mercer" />
          <SettingField label="Business name (optional)"   defaultValue="Mercer Law LLC" />
          <SettingSelect label="Entity type" options={['Individual / Sole proprietor','LLC (single-member)','LLC (multi-member)','S-Corp','C-Corp']} />
          <SettingField label="Tax ID / SSN"               defaultValue="•••-••-4421" mono />
          <SettingField label="Tax address"                defaultValue="100 Beacon St, Boston MA 02116" />
          <SettingSelect label="Form delivery"             options={['Electronic (default)','Paper mail']} />
        </div>
      </SettingGroup>

      <SettingGroup title="Documents" last>
        {TAX_DOCS.map((d, i) => (
          <div key={i} className={`flex items-center gap-3 py-3 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
            <div className="w-9 h-9 rounded bg-error-bg flex items-center justify-center shrink-0">
              <span className="font-sans text-[9px] font-bold text-error uppercase">PDF</span>
            </div>
            <div className="flex-1">
              <div className="font-sans text-[13px] text-navy font-medium">{d.name}</div>
              <div className="font-sans text-[11px] text-gray-400">{d.date} · {d.size}</div>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">
              <Download size={13} strokeWidth={1.5} /> Download
            </button>
          </div>
        ))}
      </SettingGroup>
    </>
  );
}

/* ── Payouts ─────────────────────────────────────────────── */
export function PayoutsPanel() {
  return (
    <>
      <SettingGroup title="Payout methods">
        <div className="flex items-center gap-3.5 p-3.5 bg-cream rounded-md border border-gray-100 mb-3">
          <div className="w-11 h-11 rounded bg-navy flex items-center justify-center shrink-0">
            <span className="font-sans text-[10px] font-bold text-gold">BofA</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[14px] text-navy font-semibold">Bank of America</span>
              <Badge variant="available">Primary</Badge>
            </div>
            <div className="font-mono text-[12px] text-gray-600">Checking •••• 4421</div>
          </div>
          <button className="px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">Edit</button>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy hover:bg-gray-50 transition-colors">
          + Add payout method
        </button>
      </SettingGroup>

      <SettingGroup title="Schedule">
        <SettingRow label="Payout frequency" sub="When earnings are released to your bank">
          <select className="px-3 py-2 border-[1.5px] border-gray-200 rounded-md font-sans text-[13px] text-navy bg-white outline-none focus:border-navy appearance-none cursor-pointer" defaultValue="weekly">
            <option value="instant">Instant (1% fee)</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly (Fridays)</option>
            <option value="monthly">Monthly (1st of month)</option>
          </select>
        </SettingRow>
        <SettingRow label="Minimum payout threshold" sub="Hold earnings below this amount">
          <select className="px-3 py-2 border-[1.5px] border-gray-200 rounded-md font-sans text-[13px] text-navy bg-white outline-none focus:border-navy appearance-none cursor-pointer">
            <option>No minimum</option>
            <option>$100</option>
            <option>$500</option>
            <option>$1,000</option>
          </select>
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Invoicing" last>
        <SettingRow label="Auto-generate invoices" sub="Send PDF receipts to clients after each consultation">
          <ToggleSwitch checked={true} onChange={() => {}} />
        </SettingRow>
        <SettingRow label="Include logo on invoices" sub="Your firm's logo appears on every invoice">
          <ToggleSwitch checked={false} onChange={() => {}} />
        </SettingRow>
      </SettingGroup>
    </>
  );
}

/* ── Support ─────────────────────────────────────────────── */
const SUPPORT_CARDS = [
  { icon: HelpCircle,    title: 'Help center',      desc: 'Articles and guides for lawyers'                           },
  { icon: MessageSquare, title: 'Live chat',         desc: 'Pro members: 24/7 priority support'                       },
  { icon: Mail,          title: 'Email support',     desc: 'lawyers@legalconnect.com'                                  },
  { icon: Video,         title: 'Book onboarding',   desc: 'Free 30-min session with your success manager'            },
] as const;

export function SupportPanel() {
  return (
    <>
      <SettingGroup title="Get help">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SUPPORT_CARDS.map(c => {
            const Icon = c.icon;
            return (
              <button key={c.title} className="flex items-start gap-3 p-4 bg-cream border border-gray-100 rounded-md text-left hover:border-gray-200 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-md bg-gold-pale flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-sans text-[14px] text-navy font-semibold">{c.title}</div>
                  <div className="font-sans text-[12px] text-gray-600 mt-0.5">{c.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </SettingGroup>

      <SettingGroup title="About" last>
        <SettingRow label="LegalConnect" sub="Version 4.12.0 · Build 2026.04.21">
          <button className="px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">Release notes</button>
        </SettingRow>
        <SettingRow label="Terms of service" sub="Last updated Mar 1, 2026">
          <button className="px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">View</button>
        </SettingRow>
        <SettingRow label="Privacy policy" sub="Last updated Mar 1, 2026">
          <button className="px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">View</button>
        </SettingRow>
      </SettingGroup>
    </>
  );
}
