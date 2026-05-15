import { Heading, Section, Text } from 'react-email';
import { colors } from '@repo/design-tokens';
import { EmailLayout } from '../components/EmailLayout';
import { EmailButton } from '../components/EmailButton';

interface BookingConfirmationProps {
  readonly clientName: string;
  readonly lawyerName: string;
  readonly date: string;
  readonly time: string;
  readonly consultationType: 'In Person' | 'Video Call' | 'Phone Call';
  readonly fee: string;
  readonly appointmentUrl: string;
}

export function BookingConfirmation({
  clientName,
  lawyerName,
  date,
  time,
  consultationType,
  fee,
  appointmentUrl,
}: BookingConfirmationProps) {
  return (
    <EmailLayout preview={`Your appointment with ${lawyerName} is confirmed`}>
      <Heading style={headingStyle}>Booking Confirmed!</Heading>
      <Text style={bodyTextStyle}>Hi {clientName},</Text>
      <Text style={bodyTextStyle}>
        Your appointment with <strong>{lawyerName}</strong> has been confirmed.
      </Text>

      <Section style={detailsBoxStyle}>
        <DetailRow label="Date" value={date} />
        <DetailRow label="Time" value={time} />
        <DetailRow label="Type" value={consultationType} />
        <DetailRow label="Fee" value={fee} />
      </Section>

      <Section style={ctaSection}>
        <EmailButton href={appointmentUrl}>View Appointment</EmailButton>
      </Section>

      <Text style={noteStyle}>
        You can cancel for free up to 24 hours before your appointment.
      </Text>
    </EmailLayout>
  );
}

function DetailRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Section style={detailRowStyle}>
      <Text style={detailLabelStyle}>{label}</Text>
      <Text style={detailValueStyle}>{value}</Text>
    </Section>
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

const detailsBoxStyle = {
  backgroundColor: colors.gray[50],
  borderRadius: '8px',
  margin: '24px 0',
  padding: '20px 24px',
} as const;

const detailRowStyle = {
  display: 'flex' as const,
  margin: '6px 0',
} as const;

const detailLabelStyle = {
  color: colors.gray[600],
  fontSize: '13px',
  margin: '0',
  minWidth: '120px',
} as const;

const detailValueStyle = {
  color: colors.gray[800],
  fontSize: '13px',
  fontWeight: '600',
  margin: '0',
} as const;

const ctaSection = {
  margin: '28px 0',
  textAlign: 'center' as const,
} as const;

const noteStyle = {
  color: colors.gray[600],
  fontSize: '13px',
  margin: '0',
} as const;
