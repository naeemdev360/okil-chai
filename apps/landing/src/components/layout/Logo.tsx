import { cn, ScalesLogoIcon } from '@okil-chai/ui';

interface LogoProps {
  readonly variant?: 'dark' | 'light';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly className?: string;
}

const sizes = {
  sm: { icon: 24, text: 'text-base' },
  md: { icon: 30, text: 'text-xl' },
  lg: { icon: 36, text: 'text-2xl' },
};

export function Logo({ variant = 'dark', size = 'md', className }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizes[size];
  const stroke = variant === 'dark' ? '#0F1F3D' : '#FFFFFF';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <ScalesLogoIcon size={iconSize} stroke={stroke} />
      <span
        className={cn(
          'font-heading font-bold tracking-tight',
          textSize,
          variant === 'dark' ? 'text-navy' : 'text-white',
        )}
      >
        OkilChai
      </span>
    </div>
  );
}
