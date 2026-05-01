interface Scales3DSVGProps {
  readonly prefix?: string;
  readonly className?: string;
}

export function Scales3DSVG({ prefix = 'a', className }: Scales3DSVGProps) {
  const p = prefix;
  return (
    <svg
      viewBox="0 0 300 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${p}-beam`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#6A4F18" />
          <stop offset="15%"  stopColor="#D4A84B" />
          <stop offset="38%"  stopColor="#F5D870" />
          <stop offset="60%"  stopColor="#C8A84B" />
          <stop offset="82%"  stopColor="#E8C96A" />
          <stop offset="100%" stopColor="#6A4F18" />
        </linearGradient>
        <linearGradient id={`${p}-pillar`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#3E2A0A" />
          <stop offset="28%"  stopColor="#C8A84B" />
          <stop offset="52%"  stopColor="#F0D060" />
          <stop offset="76%"  stopColor="#C8A84B" />
          <stop offset="100%" stopColor="#3E2A0A" />
        </linearGradient>
        <linearGradient id={`${p}-rim`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#7A5E20" />
          <stop offset="35%"  stopColor="#DDB840" />
          <stop offset="70%"  stopColor="#C8A030" />
          <stop offset="100%" stopColor="#7A5E20" />
        </linearGradient>
        <linearGradient id={`${p}-bowl`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#8A6A28" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#2E1C04" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id={`${p}-base-top`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#7A5E20" />
          <stop offset="50%"  stopColor="#C8A030" />
          <stop offset="100%" stopColor="#7A5E20" />
        </linearGradient>
        <linearGradient id={`${p}-base-front`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#5A3C10" />
          <stop offset="100%" stopColor="#1E1005" />
        </linearGradient>
        <linearGradient id={`${p}-chain`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#D4A84B" />
          <stop offset="100%" stopColor="#6A4F18" />
        </linearGradient>
        <radialGradient id={`${p}-knob`} cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#F5D870" />
          <stop offset="100%" stopColor="#6A4F18" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="350" rx="96" ry="10" fill="#C8A84B" opacity="0.14" />
      <path d="M70 316 L230 316 L218 334 L82 334 Z" fill={`url(#${p}-base-front)`} />
      <path d="M58 306 L242 306 L230 316 L70 316 Z" fill={`url(#${p}-base-top)`} />
      <line x1="58" y1="306" x2="242" y2="306" stroke="#E8C96A" strokeWidth="0.8" opacity="0.55" />
      <rect x="136" y="110" width="28" height="196" rx="14" fill={`url(#${p}-pillar)`} />
      <rect x="136" y="110" width="6" height="196" rx="3" fill="white" opacity="0.11" />
      <rect x="16" y="84" width="268" height="24" rx="12" fill={`url(#${p}-beam)`} />
      <rect x="16" y="84" width="268" height="7" rx="3" fill="#F8E080" opacity="0.28" />
      <rect x="16" y="101" width="268" height="7" rx="3" fill="#1A1004" opacity="0.28" />
      <circle cx="150" cy="94" r="16" fill={`url(#${p}-knob)`} />
      <circle cx="150" cy="94" r="7"  fill="#FAE078" opacity="0.85" />
      <circle cx="150" cy="94" r="3"  fill="#FFF8D8" />
      <line x1="54"  y1="108" x2="40"  y2="194" stroke={`url(#${p}-chain)`} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.9" />
      <line x1="88"  y1="108" x2="102" y2="194" stroke={`url(#${p}-chain)`} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.9" />
      <line x1="212" y1="108" x2="198" y2="194" stroke={`url(#${p}-chain)`} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.9" />
      <line x1="246" y1="108" x2="260" y2="194" stroke={`url(#${p}-chain)`} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.9" />
      <ellipse cx="71"  cy="194" rx="58" ry="15" fill={`url(#${p}-rim)`} />
      <path d="M13 194 Q71 228 129 194"           fill={`url(#${p}-bowl)`} />
      <ellipse cx="71"  cy="194" rx="49" ry="11" fill="#F0D060" opacity="0.32" />
      <ellipse cx="63"  cy="193" rx="18" ry="5"  fill="white"  opacity="0.09" transform="rotate(-8,63,193)" />
      <ellipse cx="229" cy="194" rx="58" ry="15" fill={`url(#${p}-rim)`} />
      <path d="M171 194 Q229 228 287 194"         fill={`url(#${p}-bowl)`} />
      <ellipse cx="229" cy="194" rx="49" ry="11" fill="#F0D060" opacity="0.32" />
      <ellipse cx="221" cy="193" rx="18" ry="5"  fill="white"  opacity="0.09" transform="rotate(-8,221,193)" />
    </svg>
  );
}
