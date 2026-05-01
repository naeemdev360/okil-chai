import type { SvgIconProps } from './GoogleIcon';

export function VerifiedCheckIcon({ className }: SvgIconProps) {
  return (
    <svg viewBox="0 0 12 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="1,5 4,8 11,1" />
    </svg>
  );
}
