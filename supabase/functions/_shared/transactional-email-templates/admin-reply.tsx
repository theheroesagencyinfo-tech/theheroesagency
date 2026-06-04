import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  recipientName?: string
  subject?: string
  message?: string
  senderName?: string
}

const Email = ({
  recipientName,
  message = '',
  senderName = 'The Heroes Agency',
}: Props) => {
  const paragraphs = String(message).split(/\n\s*\n/).filter(Boolean)
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`A reply from ${senderName}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brand}>
            <Text style={brandText}>THE HEROES AGENCY</Text>
          </Section>
          <Heading style={h1}>{recipientName ? `Hi ${recipientName},` : 'Hi there,'}</Heading>
          {paragraphs.length === 0 ? (
            <Text style={text}>{message}</Text>
          ) : (
            paragraphs.map((p, i) => (
              <Text key={i} style={text}>{p}</Text>
            ))
          )}
          <Text style={text}>— {senderName}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            The Heroes Agency · theheroesagency.org<br />
            Reply directly to this email to continue the conversation.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => d.subject ?? 'A message from The Heroes Agency',
  displayName: 'Admin Reply',
  previewData: {
    recipientName: 'Jane',
    subject: 'Re: Your Shopify audit request',
    message: 'Thanks for reaching out — here are the next steps.\n\nLet me know what works for a call.',
    senderName: 'The Heroes Agency',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica Neue, Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const brand = { borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }
const brandText = { color: '#0369a1', fontSize: '14px', fontWeight: 700, letterSpacing: '2px', margin: 0 }
const h1 = { color: '#0f172a', fontSize: '22px', fontWeight: 700, margin: '0 0 16px' }
const text = { color: '#334155', fontSize: '16px', lineHeight: '26px', margin: '0 0 16px', whiteSpace: 'pre-wrap' as const }
const hr = { borderColor: '#e2e8f0', margin: '32px 0 16px' }
const footer = { color: '#64748b', fontSize: '12px', textAlign: 'center' as const, lineHeight: '18px' }
