interface LawyerBadgeIconProps {
  readonly className?: string;
}

export function LawyerBadgeIcon({ className }: LawyerBadgeIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top finial */}
      <circle cx="8" cy="2" r="1" fill="currentColor" />
      {/* Center pole */}
      <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Balance beam */}
      <line x1="2" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Left chain */}
      <line x1="3.5" y1="5" x2="3.5" y2="7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {/* Right chain */}
      <line x1="12.5" y1="5" x2="12.5" y2="7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {/* Left pan */}
      <path d="M1.5 7.5 Q3.5 10 5.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Right pan */}
      <path d="M10.5 7.5 Q12.5 10 14.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Base */}
      <line x1="5.5" y1="14" x2="10.5" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
