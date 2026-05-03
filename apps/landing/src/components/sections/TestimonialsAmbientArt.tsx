/**
 * Testimonials-only decorative SVGs (not shared with hero).
 * Gold/navy palette matches brand; gradients use idPrefix to stay unique in DOM.
 */

interface AmbientSvgProps {
  readonly idPrefix: string;
  readonly className?: string;
}

export function TestimonialsPillarAmbientSVG({ idPrefix: p, className }: AmbientSvgProps) {
  return (
    <svg
      viewBox="0 0 220 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${p}-pl-base`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3E2A0A" />
          <stop offset="35%" stopColor="#8B7344" />
          <stop offset="65%" stopColor="#C8A84B" />
          <stop offset="100%" stopColor="#4A3418" />
        </linearGradient>
        <linearGradient id={`${p}-pl-shaft`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2A1E0C" />
          <stop offset="22%" stopColor="#5C4A28" />
          <stop offset="48%" stopColor="#E8C96A" />
          <stop offset="72%" stopColor="#A88432" />
          <stop offset="100%" stopColor="#3E2A0A" />
        </linearGradient>
        <linearGradient id={`${p}-pl-cap`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0D060" />
          <stop offset="45%" stopColor="#C8A84B" />
          <stop offset="100%" stopColor="#6A4F18" />
        </linearGradient>
      </defs>
      <path
        d="M28 320h164v16H28v-16z"
        fill={`url(#${p}-pl-base)`}
        opacity="0.9"
      />
      <path
        d="M48 88h124v216H48V88z"
        fill={`url(#${p}-pl-shaft)`}
        opacity="0.95"
      />
      {[0.12, 0.28, 0.44, 0.6, 0.76].map((x, i) => (
        <rect
          key={i}
          x={48 + x * 124}
          y="92"
          width="3"
          height="208"
          rx="1"
          fill="#1a1408"
          opacity="0.22"
        />
      ))}
      <rect x="52" y="88" width="14" height="220" rx="2" fill="white" opacity="0.08" />
      <path
        d="M32 72h156v28H32V72z"
        fill={`url(#${p}-pl-cap)`}
      />
      <path
        d="M20 56h180v20H20V56z"
        fill={`url(#${p}-pl-cap)`}
        opacity="0.85"
      />
      <path
        d="M54 40h112v20H54V40z"
        fill="#E8C96A"
        opacity="0.55"
      />
    </svg>
  );
}

export function TestimonialsBooksAmbientSVG({ idPrefix: p, className }: AmbientSvgProps) {
  return (
    <svg
      viewBox="0 0 260 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${p}-bk-a`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C2412" />
          <stop offset="100%" stopColor="#5C4A2A" />
        </linearGradient>
        <linearGradient id={`${p}-bk-b`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A3818" />
          <stop offset="50%" stopColor="#C8A84B" />
          <stop offset="100%" stopColor="#3E2A0A" />
        </linearGradient>
        <linearGradient id={`${p}-bk-c`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6A4F18" />
          <stop offset="40%" stopColor="#F5D870" />
          <stop offset="100%" stopColor="#8B6A28" />
        </linearGradient>
      </defs>
      <g transform="translate(24 18) rotate(-8 100 90)">
        <rect x="8" y="28" width="148" height="22" rx="4" fill={`url(#${p}-bk-a)`} />
        <rect x="10" y="30" width="6" height="18" rx="1" fill="white" opacity="0.06" />
      </g>
      <g transform="translate(48 8) rotate(4 90 80)">
        <rect x="0" y="40" width="160" height="26" rx="5" fill={`url(#${p}-bk-b)`} />
        <rect x="4" y="42" width="10" height="22" rx="2" fill={`url(#${p}-bk-c)`} opacity="0.85" />
      </g>
      <g transform="translate(72 0) rotate(-3 70 70)">
        <rect x="12" y="52" width="168" height="30" rx="5" fill={`url(#${p}-bk-b)`} />
        <rect x="16" y="54" width="12" height="26" rx="2" fill="#E8C96A" opacity="0.5" />
        <line x1="148" y1="58" x2="168" y2="76" stroke="white" strokeOpacity="0.12" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

export function TestimonialsScrollAmbientSVG({ idPrefix: p, className }: AmbientSvgProps) {
  return (
    <svg
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${p}-sc-paper`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(253,246,227,0.35)" />
          <stop offset="100%" stopColor="rgba(200,168,75,0.12)" />
        </linearGradient>
        <linearGradient id={`${p}-sc-roll`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3E2A0A" />
          <stop offset="40%" stopColor="#C8A84B" />
          <stop offset="100%" stopColor="#5C4420" />
        </linearGradient>
        <radialGradient id={`${p}-sc-seal`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F5D870" />
          <stop offset="70%" stopColor="#C8A84B" />
          <stop offset="100%" stopColor="#6A4F18" />
        </radialGradient>
      </defs>
      <ellipse cx="52" cy="88" rx="36" ry="52" fill={`url(#${p}-sc-roll)`} opacity="0.88" />
      <ellipse cx="56" cy="88" rx="14" ry="48" fill="white" opacity="0.1" />
      <path
        d="M72 36h168c10 0 18 8 18 18v68c0 10-8 18-18 18H72c-8 0-28-12-28-52s20-52 28-52z"
        fill={`url(#${p}-sc-paper)`}
        stroke="#C8A84B"
        strokeWidth="0.8"
        strokeOpacity="0.35"
      />
      {[52, 64, 76, 88, 100].map((y, i) => (
        <line
          key={y}
          x1="92"
          y1={y}
          x2={i === 2 ? 200 : 228}
          y2={y}
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.14"
        />
      ))}
      <circle cx="208" cy="102" r="22" fill={`url(#${p}-sc-seal)`} opacity="0.75" />
      <circle cx="208" cy="102" r="16" stroke="white" strokeOpacity="0.2" strokeWidth="0.8" fill="none" />
      <path
        d="M198 102c4-6 12-6 16 0s12 6 16 0"
        stroke="#3E2A0A"
        strokeOpacity="0.35"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function TestimonialsPedimentAmbientSVG({ idPrefix: p, className }: AmbientSvgProps) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${p}-pd-roof`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#E8C96A" />
          <stop offset="45%" stopColor="#C8A84B" />
          <stop offset="100%" stopColor="#4A3418" />
        </linearGradient>
        <linearGradient id={`${p}-pd-col`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2A1E0C" />
          <stop offset="45%" stopColor="#B89440" />
          <stop offset="100%" stopColor="#3E2A0A" />
        </linearGradient>
      </defs>
      <rect x="24" y="148" width="272" height="14" rx="2" fill={`url(#${p}-pd-col)`} opacity="0.55" />
      {[56, 152, 248].map((x) => (
        <g key={x}>
          <rect x={x} y="72" width="18" height="76" rx="2" fill={`url(#${p}-pd-col)`} />
          <rect x={x + 2} y="74" width="5" height="72" rx="1" fill="white" opacity="0.07" />
        </g>
      ))}
      <path
        d="M8 72 L160 12 L312 72 Z"
        fill={`url(#${p}-pd-roof)`}
        opacity="0.92"
      />
      <path d="M160 12 L312 72" stroke="white" strokeOpacity="0.12" strokeWidth="1" />
      <path d="M160 12 L8 72" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
      <circle cx="160" cy="56" r="18" stroke="#FDF6E3" strokeOpacity="0.25" strokeWidth="1.2" fill="rgba(15,31,61,0.15)" />
      <circle cx="160" cy="56" r="10" stroke="#C8A84B" strokeOpacity="0.4" strokeWidth="0.8" fill="none" />
    </svg>
  );
}
