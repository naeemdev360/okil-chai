import { Body, Button, Container, Head, Heading, Html, Preview, render, Section, Text } from 'react-email';
import { PASSWORD_RESET_EXPIRES_MINUTES } from '../mail.constants';

interface PasswordResetEmailProps {
  readonly firstName: string;
  readonly resetUrl: string;
  readonly appName: string;
}

function PasswordResetEmail({ firstName, resetUrl, appName }: PasswordResetEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your {appName} password</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px' }}>
          <Heading style={{ fontSize: '24px', color: '#1a1a1a', marginBottom: '8px' }}>
            Reset Your Password
          </Heading>
          <Text style={{ color: '#4b5563', lineHeight: '1.6' }}>
            Hi {firstName},
          </Text>
          <Text style={{ color: '#4b5563', lineHeight: '1.6' }}>
            We received a request to reset your {appName} password. Click the button below to set a new password.
          </Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: '#1e6f50',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '15px',
                textDecoration: 'none',
              }}
            >
              Reset Password
            </Button>
          </Section>
          <Text style={{ color: '#f59e0b', fontSize: '13px', textAlign: 'center' }}>
            This link expires in <strong>{PASSWORD_RESET_EXPIRES_MINUTES} minutes</strong>.
          </Text>
          <Text style={{ backgroundColor: '#f9fafb', borderRadius: '8px', color: '#6b7280', fontSize: '13px', lineHeight: '1.6', padding: '16px' }}>
            If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderPasswordResetEmail(
  firstName: string,
  resetUrl: string,
  appName: string,
): Promise<string> {
  return render(<PasswordResetEmail firstName={firstName} resetUrl={resetUrl} appName={appName} />);
}
