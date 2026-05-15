import { Heading, Section, Text } from 'react-email';
import { colors } from '@repo/design-tokens';
import { EmailLayout } from '../components/EmailLayout';
import { EmailButton } from '../components/EmailButton';

interface PasswordResetProps {
  readonly userName: string;
  readonly resetUrl: string;
  readonly expiresInMinutes: number;
  readonly appName: string;
  readonly appTagline: string;
}

export function PasswordReset({ userName, resetUrl, expiresInMinutes, appName, appTagline }: PasswordResetProps) {
  return (
    <EmailLayout preview={`Reset your ${appName} password`} appName={appName} appTagline={appTagline}>
      <Heading style={headingStyle}>Reset Your Password</Heading>
      <Text style={bodyTextStyle}>Hi {userName},</Text>
      <Text style={bodyTextStyle}>
        We received a request to reset your {appName} password. Click the button below to set
        a new password.
      </Text>

      <Section style={ctaSection}>
        <EmailButton href={resetUrl}>Reset Password</EmailButton>
      </Section>

      <Text style={expiryTextStyle}>
        This link expires in {expiresInMinutes} minutes.
      </Text>

      <Text style={securityNoteStyle}>
        If you didn't request a password reset, you can safely ignore this email. Your
        password will not be changed.
      </Text>
    </EmailLayout>
  );
}

const headingStyle = {
  color: colors.navy.DEFAULT,
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 16px',
} as const;

const bodyTextStyle = {
  color: colors.gray[800],
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 12px',
} as const;

const ctaSection = {
  margin: '28px 0',
  textAlign: 'center' as const,
} as const;

const expiryTextStyle = {
  color: colors.warning,
  fontSize: '13px',
  margin: '0 0 16px',
  textAlign: 'center' as const,
} as const;

const securityNoteStyle = {
  backgroundColor: colors.gray[50],
  borderRadius: '8px',
  color: colors.gray[600],
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0',
  padding: '16px',
} as const;
