interface SettingRowProps {
  readonly label: string;
  readonly sub?: string;
  readonly right?: React.ReactNode;
  readonly children?: React.ReactNode;
}

export function SettingRow({ label, sub, right, children }: SettingRowProps) {
  return (
    <div className="flex items-center gap-3.5 py-3 border-t border-gray-100 flex-wrap">
      <div className="flex-1 min-w-[160px]">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[13px] text-navy font-medium">{label}</span>
          {right}
        </div>
        {sub && (
          <div className="font-sans text-[12px] text-gray-600 mt-0.5 leading-snug">{sub}</div>
        )}
      </div>
      {children}
    </div>
  );
}
