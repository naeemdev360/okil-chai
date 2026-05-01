import type { SvgIconProps } from './GoogleIcon';

export function GavelSVG({ className }: SvgIconProps) {
  return (
    <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gv-head" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#2E2616" />
          <stop offset="40%"  stopColor="#6B5530" />
          <stop offset="80%"  stopColor="#8B7040" />
          <stop offset="100%" stopColor="#2E2616" />
        </linearGradient>
        <linearGradient id="gv-band" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#6A4F18" />
          <stop offset="50%"  stopColor="#D4A84B" />
          <stop offset="100%" stopColor="#6A4F18" />
        </linearGradient>
        <linearGradient id="gv-handle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#4A2A10" />
          <stop offset="50%"  stopColor="#8B5E2A" />
          <stop offset="100%" stopColor="#2E1408" />
        </linearGradient>
      </defs>
      <rect x="95" y="100" width="110" height="18" rx="9"
        fill="url(#gv-handle)" transform="rotate(-32,95,100)" />
      <rect x="14" y="42" width="100" height="46" rx="9" fill="url(#gv-head)" />
      <rect x="14" y="42" width="100" height="12" rx="5" fill="#8B7040" opacity="0.55" />
      <rect x="46" y="40" width="20" height="50" rx="3" fill="url(#gv-band)" />
      <rect x="14" y="42" width="6"  height="46" rx="2" fill="white" opacity="0.07" />
    </svg>
  );
}
