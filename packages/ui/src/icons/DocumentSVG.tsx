import type { SvgIconProps } from './GoogleIcon';

export function DocumentSVG({ className }: SvgIconProps) {
  return (
    <svg viewBox="0 0 120 158" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <rect x="14" y="12" width="92" height="128" rx="7" fill="#C8A84B" opacity="0.07" />
      <rect x="6"  y="6"  width="92" height="128" rx="7"
        fill="rgba(255,255,255,0.05)" stroke="#C8A84B" strokeWidth="0.7" strokeOpacity="0.38" />
      <rect x="16" y="20" width="64" height="6" rx="3" fill="#C8A84B" opacity="0.5" />
      {[36, 48, 60, 72, 84, 96, 108].map((y, i) => (
        <line key={y} x1="16" y1={y} x2={i % 3 === 2 ? 68 : 88} y2={y}
          stroke="white" strokeWidth="1" strokeOpacity="0.16" />
      ))}
      <circle cx="68" cy="122" r="13" stroke="#C8A84B" strokeWidth="0.9" strokeOpacity="0.48" />
      <circle cx="68" cy="122" r="7"  stroke="#C8A84B" strokeWidth="0.5" strokeOpacity="0.35" />
    </svg>
  );
}
