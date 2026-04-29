import { Heading, Section, Text } from 'react-email';
import { colors } from '@okil-chai/design-tokens';
import { EmailLayout } from '../components/EmailLayout';
import { EmailButton } from '../components/EmailButton';

interface WelcomeEmailProps {
  readonly userName: string;
  readonly role: 'client' | 'lawyer';
  readonly ctaUrl: string;
}

const CLIENT_STEPS = [
  'Search lawyers by specialty, location, and language',
  'View detailed profiles and verified credentials',
  'Book an appointment in minutes',
] as const;

const LAWYER_STEPS = [
  'Complete your profile to go live',
  'Set your availability and consultation types',
  'Start receiving bookings from clients',
] as const;

export function WelcomeEmail({ userName, role, ctaUrl }: WelcomeEmailProps) {
  const isLawyer = role === 'lawyer';
  const steps = isLawyer ? LAWYER_STEPS : CLIENT_STEPS;
  const ctaLabel = isLawyer ? 'Complete My Profile' : 'Find a Lawyer';

  return (
    <EmailLayout preview={`Welcome to OkilChai, ${userName}!`}>
      <Heading style={headingStyle}>Welcome to OkilChai, {userName}!</Heading>
      <Text style={bodyTextStyle}>
        {isLawyer
          ? "We're excited to have you join our network of verified legal professionals."
          : "Getting legal help has never been easier. Here's how to get started:"}
      </Text>

      <Section style={stepsBoxStyle}>
        {steps.map((step, index) => (
          <Text key={step} style={stepStyle}>
            <span style={stepNumberStyle}>{index + 1}</span> {step}
          </Text>
        ))}
      </Section>

      <Section style={ctaSection}>
        <EmailButton href={ctaUrl} variant={isLawyer ? 'gold' : 'primary'}>
          {ctaLabel}
        </EmailButton>
      </Section>

      <Text style={signoffStyle}>Welcome aboard,</Text>
      <Text style={signoffNameStyle}>The OkilChai Team</Text>
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
  margin: '0 0 20px',
} as const;

const stepsBoxStyle = {
  margin: '0 0 24px',
} as const;

const stepStyle = {
  color: colors.gray[800],
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 10px',
} as const;

const stepNumberStyle = {
  backgroundColor: colors.navy.DEFAULT,
  borderRadius: '50%',
  color: colors.gold.DEFAULT,
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: '700',
  height: '22px',
  lineHeight: '22px',
  marginRight: '10px',
  textAlign: 'center' as const,
  width: '22px',
} as const;

const ctaSection = {
  margin: '28px 0',
  textAlign: 'center' as const,
} as const;

const signoffStyle = {
  color: colors.gray[600],
  fontSize: '14px',
  margin: '16px 0 0',
} as const;

const signoffNameStyle = {
  color: colors.navy.DEFAULT,
  fontSize: '14px',
  fontWeight: '600',
  margin: '2px 0 0',
} as const;
