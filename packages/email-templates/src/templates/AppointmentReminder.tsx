import { Heading, Section, Text } from 'react-email';
import { colors } from '@okil-chai/design-tokens';
import { EmailLayout } from '../components/EmailLayout';
import { EmailButton } from '../components/EmailButton';

interface AppointmentReminderProps {
  readonly clientName: string;
  readonly lawyerName: string;
  readonly date: string;
  readonly time: string;
  readonly consultationType: string;
  readonly appointmentUrl: string;
  readonly hoursUntil: number;
}

export function AppointmentReminder({
  clientName,
  lawyerName,
  date,
  time,
  consultationType,
  appointmentUrl,
  hoursUntil,
}: AppointmentReminderProps) {
  return (
    <EmailLayout
      preview={`Reminder: Your appointment with ${lawyerName} is in ${hoursUntil} hours`}
    >
      <Heading style={headingStyle}>Appointment Reminder</Heading>
      <Text style={bodyTextStyle}>Hi {clientName},</Text>
      <Text style={bodyTextStyle}>
        This is a reminder that your appointment with <strong>{lawyerName}</strong> is in{' '}
        <strong>{hoursUntil} hours</strong>.
      </Text>

      <Section style={detailsBoxStyle}>
        <Text style={detailStyle}>
          <span style={labelStyle}>Date:</span> {date}
        </Text>
        <Text style={detailStyle}>
          <span style={labelStyle}>Time:</span> {time}
        </Text>
        <Text style={detailStyle}>
          <span style={labelStyle}>Type:</span> {consultationType}
        </Text>
      </Section>

      <Section style={ctaSection}>
        <EmailButton href={appointmentUrl}>View Details</EmailButton>
      </Section>

      <Text style={noteStyle}>
        Need to cancel? You can do so for free up to 24 hours before the appointment.
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

const detailsBoxStyle = {
  backgroundColor: colors.gray[50],
  borderLeft: `4px solid ${colors.gold.DEFAULT}`,
  borderRadius: '0 8px 8px 0',
  margin: '24px 0',
  padding: '20px 24px',
} as const;

const detailStyle = {
  color: colors.gray[800],
  fontSize: '14px',
  margin: '6px 0',
} as const;

const labelStyle = {
  color: colors.gray[600],
  fontWeight: '600',
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
