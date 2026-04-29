import { Heading, Section, Text } from 'react-email';
import { colors } from '@okil-chai/design-tokens';
import { EmailLayout } from '../components/EmailLayout';
import { EmailButton } from '../components/EmailButton';

interface LawyerVerificationRejectedProps {
  readonly lawyerName: string;
  readonly reason?: string;
  readonly supportUrl: string;
}

export function LawyerVerificationRejected({
  lawyerName,
  reason,
  supportUrl,
}: LawyerVerificationRejectedProps) {
  return (
    <EmailLayout preview="Update required for your OkilChai lawyer application">
      <Heading style={headingStyle}>Application Update Required</Heading>
      <Text style={bodyTextStyle}>Hi {lawyerName},</Text>
      <Text style={bodyTextStyle}>
        Thank you for applying to join OkilChai. After reviewing your application, we were
        unable to verify your credentials at this time.
      </Text>

      {reason !== undefined && reason.length > 0 && (
        <Section style={reasonBoxStyle}>
          <Text style={reasonLabelStyle}>Reason:</Text>
          <Text style={reasonTextStyle}>{reason}</Text>
        </Section>
      )}

      <Text style={bodyTextStyle}>
        Please contact our support team to resolve this and resubmit your application.
      </Text>

      <Section style={ctaSection}>
        <EmailButton href={supportUrl}>Contact Support</EmailButton>
      </Section>
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

const reasonBoxStyle = {
  backgroundColor: colors['error-bg'],
  border: `1px solid ${colors.error}`,
  borderRadius: '8px',
  margin: '20px 0',
  padding: '16px 20px',
} as const;

const reasonLabelStyle = {
  color: colors.error,
  fontSize: '12px',
  fontWeight: '700',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
} as const;

const reasonTextStyle = {
  color: colors.gray[800],
  fontSize: '14px',
  margin: '0',
} as const;

const ctaSection = {
  margin: '28px 0',
  textAlign: 'center' as const,
} as const;
