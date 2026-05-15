interface SettingGroupProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly last?: boolean;
}

export function SettingGroup({ title, children, last }: SettingGroupProps) {
  return (
    <div className={last ? '' : 'mb-7 pb-6 border-b border-gray-100'}>
      <div className="font-heading text-[14px] font-semibold text-navy mb-3.5 tracking-tight">
        {title}
      </div>
      {children}
    </div>
  );
}
