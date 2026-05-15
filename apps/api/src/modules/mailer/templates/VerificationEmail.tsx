import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'react-email';
import { render } from 'react-email';
import * as React from 'react';

interface VerificationEmailProps {
  readonly firstName: string;
  readonly verifyUrl: string;
}

function VerificationEmail({ firstName, verifyUrl }: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Verify your OkilChai email address</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px' }}>
          <Heading style={{ fontSize: '24px', color: '#1a1a1a', marginBottom: '8px' }}>
            Hi {firstName},
          </Heading>
          <Text style={{ color: '#4b5563', lineHeight: '1.6' }}>
            Thank you for creating an OkilChai account. Please verify your email address to unlock full access.
          </Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button
              href={verifyUrl}
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
              Verify Email Address
            </Button>
          </Section>
          <Text style={{ color: '#9ca3af', fontSize: '13px' }}>
            This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderVerificationEmail(firstName: string, verifyUrl: string): Promise<string> {
  return render(<VerificationEmail firstName={firstName} verifyUrl={verifyUrl} />);
}
