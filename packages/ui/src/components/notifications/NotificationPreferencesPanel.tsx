import * as React from 'react';
import { ToggleSwitch } from '../ui/toggle-switch';

export interface PrefSection {
  readonly title: string;
  readonly items: readonly string[];
}

interface NotificationPreferencesPanelProps {
  readonly sections: readonly PrefSection[];
  readonly prefs: Record<string, boolean>;
  readonly onPrefChange: (key: string, value: boolean) => void;
  readonly onSave: () => void;
  readonly onCancel: () => void;
}

export function NotificationPreferencesPanel({
  sections,
  prefs,
  onPrefChange,
  onSave,
  onCancel,
}: NotificationPreferencesPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-7 py-6 shadow-sm">
      <h2 className="font-heading text-lg font-semibold text-navy mb-[18px]">
        Notification Preferences
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-[11px] font-semibold text-gold tracking-[0.08em] uppercase mb-2.5">
              {section.title}
            </p>
            <div className="flex flex-col gap-2">
              {section.items.map((item) => (
                <label
                  key={item}
                  className="flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-sans text-[13px] text-gray-800">{item}</span>
                  <ToggleSwitch
                    checked={prefs[item] ?? true}
                    onChange={(v) => onPrefChange(item, v)}
                    label={item}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2.5">
        <button
          onClick={onCancel}
          className="inline-flex items-center px-5 py-2.5 rounded-md border border-gray-200 bg-transparent font-sans text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center px-5 py-2.5 rounded-md bg-navy font-sans text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
