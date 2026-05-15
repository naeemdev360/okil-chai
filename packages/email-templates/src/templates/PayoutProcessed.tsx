import { Heading, Section, Text } from 'react-email';
import { colors } from '@repo/design-tokens';
import { EmailLayout } from '../components/EmailLayout';
import { EmailButton } from '../components/EmailButton';

interface PayoutProcessedProps {
  readonly lawyerName: string;
  readonly amount: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly appointmentCount: number;
  readonly dashboardUrl: string;
  readonly appName: string;
  readonly appTagline: string;
}

export function PayoutProcessed({
  lawyerName,
  amount,
  periodStart,
  periodEnd,
  appointmentCount,
  dashboardUrl,
  appName,
  appTagline,
}: PayoutProcessedProps) {
  return (
    <EmailLayout preview={`Your ${appName} payout of ${amount} has been processed`} appName={appName} appTagline={appTagline}>
      <Heading style={headingStyle}>Payout Processed</Heading>
      <Text style={bodyTextStyle}>Hi {lawyerName},</Text>
      <Text style={bodyTextStyle}>
        Your payout for the period {periodStart} – {periodEnd} has been processed and is on
        its way to your bank account.
      </Text>

      <Section style={amountBoxStyle}>
        <Text style={amountLabelStyle}>Payout Amount</Text>
        <Text style={amountValueStyle}>{amount}</Text>
        <Text style={appointmentCountStyle}>
          From {appointmentCount} completed appointment{appointmentCount !== 1 ? 's' : ''}
        </Text>
      </Section>

      <Text style={bodyTextStyle}>
        Funds typically arrive within 2–5 business days depending on your bank.
      </Text>

      <Section style={ctaSection}>
        <EmailButton href={dashboardUrl} variant="gold">
          View Earnings
        </EmailButton>
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

const amountBoxStyle = {
  backgroundColor: colors.navy.DEFAULT,
  borderRadius: '12px',
  margin: '24px 0',
  padding: '28px',
  textAlign: 'center' as const,
} as const;

const amountLabelStyle = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '13px',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
} as const;

const amountValueStyle = {
  color: colors.gold.DEFAULT,
  fontSize: '40px',
  fontWeight: '700',
  margin: '0 0 8px',
} as const;

const appointmentCountStyle = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '13px',
  margin: '0',
} as const;

const ctaSection = {
  margin: '28px 0',
  textAlign: 'center' as const,
} as const;
