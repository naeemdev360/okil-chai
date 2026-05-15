interface SettingFieldProps {
  readonly label: string;
  readonly defaultValue: string;
  readonly mono?: boolean;
  readonly badge?: string;
}

interface SettingSelectProps {
  readonly label: string;
  readonly options: readonly string[];
}

export function SettingField({ label, defaultValue, mono, badge }: SettingFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="font-sans text-[11px] text-gray-400 font-semibold tracking-[0.06em] uppercase">
          {label}
        </label>
        {badge && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-success-bg text-success font-sans text-[10px] font-semibold">
            {badge}
          </span>
        )}
      </div>
      <input
        defaultValue={defaultValue}
        className={`w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md outline-none focus:border-navy transition-colors text-navy bg-white ${mono ? 'font-mono text-[13px]' : 'font-sans text-[14px]'}`}
      />
    </div>
  );
}

export function SettingSelect({ label, options }: SettingSelectProps) {
  return (
    <div>
      <label className="block font-sans text-[11px] text-gray-400 font-semibold tracking-[0.06em] uppercase mb-1.5">
        {label}
      </label>
      <select
        className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md font-sans text-[14px] text-navy bg-white outline-none focus:border-navy transition-colors appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235C5A55' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
