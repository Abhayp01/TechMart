import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Hr, Row, Column } from '@react-email/components';

interface OrderItem {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  variant?: string;
}

interface OrderNotificationProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
}

export const OrderNotification = ({
  orderId = "ORD-00000",
  customerName = "John Doe",
  customerEmail = "john@example.com",
  customerPhone = "123-456-7890",
  address = "123 Main St",
  city = "New York",
  items = [],
  subtotal = 0,
}: OrderNotificationProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Order: {orderId}</Heading>
          <Text style={text}>Action Required. Please review the details below.</Text>

          <Section style={section}>
            <Heading style={h2}>Customer Information</Heading>
            <Text style={text}><strong>Name:</strong> {customerName}</Text>
            <Text style={text}><strong>Email:</strong> {customerEmail}</Text>
            <Text style={text}><strong>Phone:</strong> {customerPhone}</Text>
            <Text style={text}><strong>Address:</strong> {address}, {city}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Order Details</Heading>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={th}>Item</th>
                  <th style={th}>SKU</th>
                  <th style={th}>Qty</th>
                  <th style={th}>Price</th>
                  <th style={th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td style={td}>{item.name} {item.variant ? `(${item.variant})` : ''}</td>
                    <td style={td}>{item.sku}</td>
                    <td style={td}>{item.quantity}</td>
                    <td style={td}>${item.price.toFixed(2)}</td>
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

          <Text style={footer}>Reply directly to this email to contact the customer.</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderNotification;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '0 48px',
};

const h1 = {
  color: '#0A0A0F',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  padding: '0 48px',
};

const h2 = {
  color: '#0A0A0F',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '0 0 10px',
};

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const th = {
  borderBottom: '1px solid #e6ebf1',
  padding: '8px',
  textAlign: 'left' as const,
  fontSize: '14px',
  color: '#666',
};

const td = {
  borderBottom: '1px solid #e6ebf1',
  padding: '8px',
  textAlign: 'left' as const,
  fontSize: '14px',
  color: '#333',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '48px 48px 0',
};
