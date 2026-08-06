import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

interface CustomBuildInquiryEmailProps {
  name: string;
  phone: string;
  useCase: string;
  budget: string;
  requirements: string;
  inquiryId: string;
}

export default function CustomBuildInquiryEmail({ name, phone, useCase, budget, requirements, inquiryId }: CustomBuildInquiryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New custom PC build request from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Custom PC Build Request</Heading>
          <Text style={text}>A customer has submitted a custom-build inquiry.</Text>
          <Section style={section}>
            <Heading as="h2" style={h2}>Customer details</Heading>
            <Text style={text}><strong>Name:</strong> {name}</Text>
            <Text style={text}><strong>Phone:</strong> {phone}</Text>
            <Text style={text}><strong>Inquiry ID:</strong> {inquiryId}</Text>
          </Section>
          <Hr style={hr} />
          <Section style={section}>
            <Heading as="h2" style={h2}>Build preferences</Heading>
            <Text style={text}><strong>Primary use:</strong> {useCase}</Text>
            <Text style={text}><strong>Estimated budget:</strong> {budget}</Text>
            <Text style={text}><strong>Requirements:</strong><br />{requirements || "No additional requirements provided."}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>NEXUS CORE Custom Build System</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", marginBottom: "64px" };
const section = { padding: "0 48px" };
const h1 = { color: "#333", fontSize: "24px", fontWeight: "bold", padding: "0 48px", margin: "40px 0" };
const h2 = { color: "#333", fontSize: "18px", fontWeight: "bold", margin: "20px 0 10px" };
const text = { color: "#333", fontSize: "16px", lineHeight: "26px", margin: "0 0 10px" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = { color: "#8898aa", fontSize: "12px", lineHeight: "16px", padding: "0 48px" };
