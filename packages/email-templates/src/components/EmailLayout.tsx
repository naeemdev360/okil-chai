import type { ReactNode } from 'react';
import { Body, Container, Head, Hr, Html, Preview, Section, Text } from 'react-email';
import { colors } from '@repo/design-tokens';

interface EmailLayoutProps {
  readonly preview: string;
  readonly children: ReactNode;
  readonly appName: string;
  readonly appTagline: string;
}

export function EmailLayout({ preview, children, appName, appTagline }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>{appName}</Text>
            <Text style={taglineStyle}>{appTagline}</Text>
          </Section>

          <Section style={contentStyle}>{children}</Section>

          <Hr style={dividerStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              © {new Date().getFullYear()} {appName}. All rights reserved.
            </Text>
            <Text style={footerLinkStyle}>
              You're receiving this email because you have an account on {appName}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: colors.cream,
  fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
  margin: '0',
  padding: '24px 0',
} as const;

const containerStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  margin: '0 auto',
  maxWidth: '600px',
  overflow: 'hidden',
} as const;

const headerStyle = {
  backgroundColor: colors.navy.DEFAULT,
  padding: '32px 40px',
  textAlign: 'center' as const,
} as const;

const logoTextStyle = {
  color: colors.gold.DEFAULT,
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '-0.5px',
} as const;

const taglineStyle = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '13px',
  margin: '4px 0 0',
} as const;

const contentStyle = {
  padding: '40px',
} as const;

const dividerStyle = {
  borderColor: colors.gray[100],
  margin: '0 40px',
} as const;

const footerStyle = {
  padding: '24px 40px',
} as const;

const footerTextStyle = {
  color: colors.gray[600],
  fontSize: '12px',
  margin: '0',
  textAlign: 'center' as const,
} as const;

const footerLinkStyle = {
  color: colors.gray[400],
  fontSize: '11px',
  margin: '8px 0 0',
  textAlign: 'center' as const,
} as const;
