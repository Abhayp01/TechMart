import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderInquiryEmailProps {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: any[];
  subtotal: number;
}

export const OrderInquiryEmail = ({
  contactInfo,
  items,
  subtotal,
}: OrderInquiryEmailProps) => {
  const previewText = `New Order Inquiry from ${contactInfo.name}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Order Inquiry</Heading>
          <Text style={text}>
            You have received a new order inquiry from <strong>{contactInfo.name}</strong>.
          </Text>

          <Section style={section}>
            <Heading as="h2" style={h2}>Customer Details</Heading>
            <Text style={text}><strong>Name:</strong> {contactInfo.name}</Text>
            <Text style={text}><strong>Email:</strong> {contactInfo.email}</Text>
            <Text style={text}><strong>Phone:</strong> {contactInfo.phone}</Text>
            <Text style={text}><strong>Address:</strong> {contactInfo.address}, {contactInfo.city}</Text>
          </Section>
          
          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h2" style={h2}>Requested Items</Heading>
            {items.map((item, index) => (
              <Text key={index} style={itemText}>
                {item.quantity}x {item.name} - ₹{(item.price * item.quantity).toFixed(2)}
              </Text>
            ))}
            <Text style={totalText}>
              <strong>Estimated Total: ₹{subtotal.toFixed(2)}</strong>
            </Text>
          </Section>
          
          <Hr style={hr} />
          <Text style={footer}>
            B. K. Infotech Order System
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderInquiryEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const section = {
  padding: "0 48px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0 48px",
  margin: "40px 0",
};

const h2 = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 10px",
};

const itemText = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 5px",
};

const totalText = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  lineHeight: "24px",
  margin: "15px 0 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 48px",
};
