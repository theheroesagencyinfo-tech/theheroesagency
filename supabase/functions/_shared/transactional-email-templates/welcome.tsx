import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  ctaUrl?: string
}

const Email = ({ name, ctaUrl = 'https://www.theheroesagency.org' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to The Heroes Agency</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brand}>
          <Text style={brandText}>THE HEROES AGENCY</Text>
        </Section>
        <Heading style={h1}>Welcome{name ? `, ${name}` : ''}.</Heading>
        <Text style={text}>
          You're in. We help ambitious DTC and Shopify Plus brands ship
          high-converting stores, retention systems, and AI commercials —
          founder-led, no junior hand-offs.
        </Text>
        <Text style={text}>
          When you're ready, book a free strategy call and we'll map the
          fastest path to your next revenue milestone.
        </Text>
        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button href={ctaUrl} style={button}>Book a Strategy Call</Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>The Heroes Agency · theheroesagency.org</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Welcome to The Heroes Agency',
  displayName: 'Welcome',
  previewData: { name: 'Alex' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica Neue, Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const brand = { borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }
const brandText = { color: '#0369a1', fontSize: '14px', fontWeight: 700, letterSpacing: '2px', margin: 0 }
const h1 = { color: '#0f172a', fontSize: '26px', fontWeight: 700, margin: '0 0 16px' }
const text = { color: '#334155', fontSize: '16px', lineHeight: '26px', margin: '0 0 16px' }
const button = {
  background: 'linear-gradient(90deg,#38bdf8,#0ea5e9,#0369a1)',
  color: '#ffffff', padding: '14px 28px', borderRadius: '8px',
  textDecoration: 'none', fontWeight: 600, fontSize: '15px',
}
const hr = { borderColor: '#e2e8f0', margin: '32px 0 16px' }
const footer = { color: '#64748b', fontSize: '12px', textAlign: 'center' as const }
