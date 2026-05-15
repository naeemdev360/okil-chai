import { Upload } from 'lucide-react';
import { Avatar } from '@repo/ui';
import { SettingGroup } from '../SettingGroup';
import { SettingField, SettingSelect } from '../SettingField';

export function AccountPanel() {
  return (
    <>
      {/* Profile photo */}
      <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100 flex-wrap">
        <Avatar initials="JM" size="xl" />
        <div className="flex-1 min-w-[160px]">
          <div className="font-heading text-[17px] font-semibold text-navy mb-1">Profile photo</div>
          <div className="font-sans text-[12px] text-gray-600 leading-relaxed">
            JPG or PNG · max 5 MB · square 400×400 recommended
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-navy text-white rounded-md font-sans text-[13px] font-medium hover:bg-navy-mid transition-colors">
            <Upload size={13} strokeWidth={1.5} /> Upload
          </button>
          <button className="inline-flex items-center px-3.5 py-2 border border-gray-200 rounded-md font-sans text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
            Remove
          </button>
        </div>
      </div>

      <SettingGroup title="Personal details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingField label="Legal first name" defaultValue="James" />
          <SettingField label="Legal last name"  defaultValue="Mercer" />
          <SettingField label="Display name"     defaultValue="James Mercer, Esq." />
          <SettingField label="Pronouns"         defaultValue="he/him" />
        </div>
      </SettingGroup>

      <SettingGroup title="Contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingField label="Email address" defaultValue="james@mercerlaw.com" mono badge="Verified" />
          <SettingField label="Phone number"  defaultValue="+1 (617) 555-0184" mono badge="Verified" />
          <SettingField label="Office address" defaultValue="100 Beacon St, Boston MA 02116" />
          <SettingField label="Time zone"      defaultValue="America/New_York (EDT)" />
        </div>
      </SettingGroup>

      <SettingGroup title="Language & region" last>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingSelect label="Interface language" options={['English (US)', 'English (UK)', 'Spanish', 'French']} />
          <SettingSelect label="Date format"         options={['MMM D, YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']} />
        </div>
      </SettingGroup>
    </>
  );
}
