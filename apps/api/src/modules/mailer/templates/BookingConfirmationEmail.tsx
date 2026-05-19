import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  render,
  Section,
  Text,
} from 'react-email';

interface BookingConfirmationEmailProps {
  readonly firstName: string;
  readonly appointmentDate: string;
  readonly consultationType: string;
  readonly isLawyer: boolean;
}

function BookingConfirmationEmail({
  firstName,
  appointmentDate,
  consultationType,
  isLawyer,
}: BookingConfirmationEmailProps) {
  const headline = isLawyer
    ? 'You have a new confirmed appointment'
    : 'Your appointment is confirmed!';

  const body = isLawyer
    ? `A client has booked a ${consultationType} consultation with you.`
    : `Your ${consultationType} consultation has been booked and payment confirmed.`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{headline}</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px' }}>
          <Heading style={{ fontSize: '24px', color: '#1a1a1a', marginBottom: '8px' }}>
            Hi {firstName},
          </Heading>
          <Text style={{ color: '#4b5563', lineHeight: '1.6' }}>{body}</Text>
          <Section style={{ backgroundColor: '#f3f4f6', borderRadius: '6px', padding: '16px', margin: '24px 0' }}>
            <Text style={{ margin: 0, color: '#111827', fontWeight: 'bold' }}>
              📅 {appointmentDate}
            </Text>
            <Text style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '14px' }}>
              Type: {consultationType}
            </Text>
          </Section>
          <Text style={{ color: '#9ca3af', fontSize: '13px' }}>
            Log in to OkilChai to view full details or make any changes before the appointment.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export async function renderBookingConfirmationEmail(
  firstName: string,
  appointmentDate: string,
  consultationType: string,
  isLawyer: boolean,
): Promise<string> {
  return render(
    <BookingConfirmationEmail
      firstName={firstName}
      appointmentDate={appointmentDate}
      consultationType={consultationType}
      isLawyer={isLawyer}
    />,
  );
}
