interface SectionLabelProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div
      className={`font-sans text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400 mb-3 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
