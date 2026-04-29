import type { ReactNode } from 'react';
import { Button } from 'react-email';
import { colors } from '@okil-chai/design-tokens';

interface EmailButtonProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: 'primary' | 'gold';
}

export function EmailButton({ href, children, variant = 'primary' }: EmailButtonProps) {
  const bgColor = variant === 'gold' ? colors.gold.DEFAULT : colors.navy.DEFAULT;
  const textColor = variant === 'gold' ? colors.navy.DEFAULT : '#FFFFFF';

  return (
    <Button
      href={href}
      style={{
        backgroundColor: bgColor,
        borderRadius: '8px',
        color: textColor,
        display: 'inline-block',
        fontSize: '15px',
        fontWeight: '600',
        padding: '14px 28px',
        textDecoration: 'none',
        textAlign: 'center',
      }}
    >
      {children}
    </Button>
  );
}
