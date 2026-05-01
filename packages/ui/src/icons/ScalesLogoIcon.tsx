interface ScalesLogoIconProps {
  readonly size?: number;
  readonly stroke?: string;
  readonly gold?: string;
  readonly className?: string;
}

export function ScalesLogoIcon({
  size = 30,
  stroke = '#0F1F3D',
  gold = '#C8A84B',
  className,
}: ScalesLogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="50 50 300 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="150" fill="none" stroke={stroke} strokeWidth="6" />
      <circle cx="200" cy="200" r="140" fill="none" stroke={gold} strokeWidth="3" />
      <line x1="130" y1="175" x2="270" y2="175" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <line x1="200" y1="145" x2="200" y2="270" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <circle cx="200" cy="145" r="8" fill={gold} />
      <line x1="145" y1="175" x2="138" y2="205" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <line x1="138" y1="205" x2="152" y2="205" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <line x1="255" y1="175" x2="248" y2="205" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <line x1="248" y1="205" x2="262" y2="205" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <path d="M130 205 Q145 218 160 205" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <path d="M240 205 Q255 218 270 205" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <line x1="200" y1="270" x2="175" y2="270" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <line x1="200" y1="270" x2="225" y2="270" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <circle cx="130" cy="175" r="7" fill={gold} />
      <circle cx="270" cy="175" r="7" fill={gold} />
    </svg>
  );
}
