import { Heading, Section, Text } from 'react-email';
import { colors } from '@okil-chai/design-tokens';
import { EmailLayout } from '../components/EmailLayout';
import { EmailButton } from '../components/EmailButton';

interface LawyerVerificationApprovedProps {
  readonly lawyerName: string;
  readonly dashboardUrl: string;
  readonly appName: string;
  readonly appTagline: string;
}

export function LawyerVerificationApproved({
  lawyerName,
  dashboardUrl,
  appName,
  appTagline,
}: LawyerVerificationApprovedProps) {
  return (
    <EmailLayout preview={`Your ${appName} lawyer profile has been approved!`} appName={appName} appTagline={appTagline}>
      <Heading style={headingStyle}>You're live on {appName}!</Heading>
      <Text style={bodyTextStyle}>Hi {lawyerName},</Text>
      <Text style={bodyTextStyle}>
        Congratulations! Your profile has been verified and is now live on {appName}. Clients
        can find you and book appointments starting right now.
      </Text>

      <Section style={highlightBoxStyle}>
        <Text style={highlightTextStyle}>
          Complete your profile to attract more clients — add a professional photo, detailed
          bio, and set your availability.
        </Text>
      </Section>

      <Section style={ctaSection}>
        <EmailButton href={dashboardUrl} variant="gold">
          Go to My Dashboard
        </EmailButton>
      </Section>

      <Text style={noteStyle}>Welcome to the {appName} network. We're glad to have you.</Text>
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

const highlightBoxStyle = {
  backgroundColor: colors.gold.pale,
  border: `1px solid ${colors.gold.DEFAULT}`,
  borderRadius: '8px',
  margin: '24px 0',
  padding: '20px 24px',
} as const;

const highlightTextStyle = {
  color: colors.navy.DEFAULT,
  fontSize: '14px',
  lineHeight: '1.6',
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
