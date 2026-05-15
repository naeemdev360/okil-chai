interface SectionCardProps {
  readonly title: React.ReactNode;
  readonly action?: { label: string; onClick: () => void };
  readonly children: React.ReactNode;
  readonly noPadding?: boolean;
}

export function SectionCard({ title, action, children, noPadding }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3">
        <h3 className="font-heading text-[17px] font-semibold text-navy flex items-center gap-2">
          {title}
        </h3>
        {action && (
          <button
            onClick={action.onClick}
            className="font-sans text-[13px] text-navy font-medium hover:opacity-70 transition-opacity shrink-0"
          >
            {action.label}
          </button>
        )}
      </div>
      {noPadding ? children : <div>{children}</div>}
    </div>
  );
}
