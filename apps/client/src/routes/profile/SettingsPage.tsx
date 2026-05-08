import { Button } from '@okil-chai/ui';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SETTINGS_SECTIONS = [
  { title: 'Personal Information',       desc: 'Update your name, email, phone, and address',               cta: 'Edit'      },
  { title: 'Password & Security',        desc: 'Change password, enable two-factor authentication',          cta: 'Manage'    },
  { title: 'Notification Preferences',   desc: 'Choose how you receive booking and message alerts',           cta: 'Configure' },
  { title: 'Language & Region',          desc: 'English (US) · Bengali · Time zone: Asia/Dhaka',             cta: 'Change'    },
  { title: 'Privacy & Data',             desc: 'Download your data, delete account, manage cookies',         cta: 'Open'      },
] as const;

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="font-heading text-[22px] font-semibold text-navy sm:text-[26px] mb-6">Account Settings</h1>

      <div className="flex flex-col gap-4">
        {SETTINGS_SECTIONS.map((s) => (
          <div
            key={s.title}
            className="bg-white rounded-xl border border-gray-100 px-4 py-4 sm:px-5 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div>
              <p className="font-heading text-base font-semibold text-navy">{s.title}</p>
              <p className="text-[13px] text-gray-600 font-sans mt-0.5">{s.desc}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full shrink-0 sm:w-auto">
              {s.cta}
            </Button>
          </div>
        ))}

        <button
          onClick={() => navigate('/')}
          className="self-start inline-flex items-center gap-2 px-4 py-3 bg-error-bg border border-error/20 text-error text-sm font-medium font-sans rounded-xl hover:bg-error/10 transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
