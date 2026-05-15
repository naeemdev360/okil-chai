import { useState } from 'react';
import { Check, Edit, Eye, Plus, X } from 'lucide-react';
import { Reveal, RevealGroup } from '@repo/ui';
import { Avatar, Badge, StarRating } from '@repo/ui';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionLabel } from '../../components/ui/SectionLabel';

const PROFILE_TABS = ['basics', 'credentials', 'practice areas', 'fees & policies', 'notifications'] as const;
type ProfileTab = typeof PROFILE_TABS[number];

export function ProfilePage() {
  const [tab, setTab] = useState<ProfileTab>('basics');

  return (
    <RevealGroup className="flex flex-col gap-4">
      <Reveal>
        <PageHeader
          title="Profile & credentials"
          subtitle="This is what clients see when searching"
          actions={
            <>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-navy font-medium hover:bg-gray-50 transition-colors">
                <Eye size={14} strokeWidth={1.5} /> Preview public profile
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy text-white rounded-md font-sans text-[13px] font-medium hover:bg-navy-mid transition-colors">
                <Check size={14} strokeWidth={1.5} /> Save changes
              </button>
            </>
          }
        />
      </Reveal>

      <Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-4 items-start">
        {/* Sub-nav */}
        <div className="bg-white rounded-xl border border-gray-100 p-2">
          {PROFILE_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'block w-full text-left px-3 py-2.5 rounded-md mb-0.5 font-sans text-[13px] capitalize transition-all border-l-[3px]',
                tab === t
                  ? 'bg-cream text-navy font-semibold border-l-gold'
                  : 'text-gray-600 font-medium hover:bg-gray-50 border-l-transparent',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2 px-3">
            <div className="font-sans text-[11px] text-gray-400 tracking-[0.06em] uppercase font-semibold mb-1.5">Status</div>
            <Badge variant="available">Verified</Badge>
            <div className="font-sans text-[12px] text-gray-600 mt-1.5">Approved Feb 12, 2026</div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Profile header preview */}
          <div className="px-7 py-6 border-b border-gray-100 flex gap-5 items-center flex-wrap">
            <div className="relative">
              <Avatar initials="JM" size="xl" className="!w-[88px] !h-[88px] !text-xl" />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-navy border-2 border-white flex items-center justify-center">
                <Edit size={12} className="text-gold" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-heading text-[22px] font-semibold text-navy">James Mercer, Esq.</h3>
                <Badge variant="verified">Verified</Badge>
                <Badge variant="pro">Pro</Badge>
              </div>
              <div className="font-sans text-[14px] text-gray-600 mb-1.5">Criminal Defense · Family Law</div>
              <div className="flex items-center gap-4 flex-wrap">
                <StarRating rating={4.9} count={142} />
                <span className="font-sans text-[13px] text-gray-600">Boston, MA</span>
                <span className="font-sans text-[13px] text-gray-600">Responds in &lt; 1 hr</span>
              </div>
            </div>
          </div>

          {/* Tab content */}
          <div className="px-7 py-6">
            <SectionLabel>Bio</SectionLabel>
            <textarea
              defaultValue="15 years of criminal defense and family law experience. I work with clients facing the most stressful moments of their lives — and I believe in plain language and honest counsel. Former Suffolk County prosecutor; member of the Massachusetts Bar Association."
              rows={4}
              className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md font-sans text-[14px] text-navy outline-none focus:border-navy transition-colors resize-none leading-relaxed mb-5"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {[
                { label: 'First name',    value: 'James' },
                { label: 'Last name',     value: 'Mercer' },
                { label: 'Display name',  value: 'James Mercer, Esq.' },
                { label: 'Pronouns',      value: 'he/him' },
                { label: 'Email',         value: 'james@mercerlaw.com', mono: true },
                { label: 'Phone',         value: '+1 (617) 555-0184',  mono: true },
              ].map(f => (
                <div key={f.label}>
                  <label className="block font-sans text-[11px] text-gray-400 font-semibold tracking-[0.06em] uppercase mb-1.5">{f.label}</label>
                  <input defaultValue={f.value} className={`w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-navy outline-none focus:border-navy transition-colors ${f.mono ? 'font-mono text-[13px]' : 'font-sans text-[14px]'}`} />
                </div>
              ))}
            </div>

            <SectionLabel>Credentials</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {[
                { label: 'Bar number',    value: 'MA-29481', mono: true },
                { label: 'Bar council',   value: 'Massachusetts Bar Association' },
                { label: 'Year admitted', value: '2011', mono: true },
                { label: 'Hourly rate',   value: '$180', mono: true },
              ].map(f => (
                <div key={f.label}>
                  <label className="block font-sans text-[11px] text-gray-400 font-semibold tracking-[0.06em] uppercase mb-1.5">{f.label}</label>
                  <input defaultValue={f.value} className={`w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-navy outline-none focus:border-navy transition-colors ${f.mono ? 'font-mono text-[13px]' : 'font-sans text-[14px]'}`} />
                </div>
              ))}
            </div>

            <SectionLabel>Languages</SectionLabel>
            <div className="flex flex-wrap gap-2 mb-5">
              {['English', 'Spanish', 'French'].map(l => (
                <span key={l} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream border border-gray-200 font-sans text-[12px] text-navy font-medium">
                  {l} <X size={12} className="text-gray-400 cursor-pointer" />
                </span>
              ))}
              <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-gray-200 font-sans text-[12px] text-gray-600 cursor-pointer hover:border-gray-400 transition-colors">
                <Plus size={12} /> Add language
              </button>
            </div>

            <SectionLabel>Specializations</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {['Criminal Defense', 'DUI', 'Family Law', 'Divorce', 'Custody'].map(s => (
                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold-pale border border-gold/50 font-sans text-[12px] text-navy font-medium">
                  {s} <X size={12} className="text-gold cursor-pointer" />
                </span>
              ))}
              <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-dashed border-gray-200 font-sans text-[12px] text-gray-600 cursor-pointer hover:border-gray-400 transition-colors">
                <Plus size={12} /> Add area
              </button>
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </RevealGroup>
  );
}
