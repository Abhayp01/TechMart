import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Hr, Row, Column } from '@react-email/components';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
}

export const OrderConfirmation = ({
  orderId = "ORD-00000",
  customerName = "John Doe",
  items = [],
  subtotal = 0,
}: OrderConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmed</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for your order! We'll be in touch shortly. 🎉<br/>
            Our team will reach out within 24 hours to confirm delivery details and payment.
          </Text>
          <Text style={text}><strong>Order ID:</strong> {orderId}</Text>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Order Summary</Heading>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={th}>Item</th>
                  <th style={th}>Qty</th>
                  <th style={th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td style={td}>{item.name} {item.variant ? `(${item.variant})` : ''}</td>
                    <td style={td}>{item.quantity}</td>
                    <td style={td}>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Row>
              <Column align="right">
                <Text style={{ ...text, fontWeight: 'bold' }}>Subtotal: ${subtotal.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          <Text style={footer}>If you have any questions, reply to this email to contact support.</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmation;

const main = {
  backgroundColor: '#0A0A0F',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#1a1a24',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '0 48px',
};

const h1 = {
  color: '#F5F0EB',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  padding: '0 48px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#F5F0EB',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '0 0 10px',
};

const text = {
  color: '#F5F0EB',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 10px',
  padding: '0 48px',
};

const hr = {
  borderColor: '#333',
  margin: '20px 0',
};

const th = {
  borderBottom: '1px solid #333',
  padding: '8px',
  textAlign: 'left' as const,
  fontSize: '14px',
  color: '#aaa',
};

const td = {
  borderBottom: '1px solid #333',
  padding: '8px',
  textAlign: 'left' as const,
  fontSize: '14px',
  color: '#F5F0EB',
};

const footer = {
  color: '#888',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '48px 48px 0',
  textAlign: 'center' as const,
};
