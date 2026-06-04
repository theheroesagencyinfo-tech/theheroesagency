import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  title?: string
  message?: string
  ctaLabel?: string
  ctaUrl?: string
}

const Email = ({
  title = 'You have a new notification',
  message = '',
  ctaLabel,
  ctaUrl,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brand}>
          <Text style={brandText}>THE HEROES AGENCY</Text>
        </Section>
        <Heading style={h1}>{title}</Heading>
        {message && <Text style={text}>{message}</Text>}
        {ctaLabel && ctaUrl && (
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button href={ctaUrl} style={button}>{ctaLabel}</Button>
          </Section>
        )}
        <Hr style={hr} />
        <Text style={footer}>The Heroes Agency · theheroesagency.org</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => d.title ?? 'You have a new notification',
  displayName: 'Notification',
  previewData: {
    title: 'Your strategy call is confirmed',
    message: 'See you Thursday at 3:00 PM UTC.',
    ctaLabel: 'View details',
    ctaUrl: 'https://www.theheroesagency.org',
  },
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
