import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Item { name: string; qty: number; price: string }
interface Props {
  name?: string
  orderId?: string
  total?: string
  items?: Item[]
}

const Email = ({ name, orderId = '—', total = '—', items = [] }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Order {orderId} confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brand}>
          <Text style={brandText}>THE HEROES AGENCY</Text>
        </Section>
        <Heading style={h1}>Order confirmed</Heading>
        <Text style={text}>
          {name ? `Hi ${name}, ` : 'Hi, '}thanks for your order. Here's your
          receipt.
        </Text>
        <Section style={card}>
          <Row><Column><Text style={label}>Order ID</Text></Column><Column align="right"><Text style={value}>{orderId}</Text></Column></Row>
          <Hr style={hrLight} />
          {items.map((it, i) => (
            <Row key={i}>
              <Column><Text style={value}>{it.name} × {it.qty}</Text></Column>
              <Column align="right"><Text style={value}>{it.price}</Text></Column>
            </Row>
          ))}
          {items.length > 0 && <Hr style={hrLight} />}
          <Row><Column><Text style={label}>Total</Text></Column><Column align="right"><Text style={totalStyle}>{total}</Text></Column></Row>
        </Section>
        <Text style={text}>We'll email you again as soon as it ships.</Text>
        <Hr style={hr} />
        <Text style={footer}>The Heroes Agency · theheroesagency.org</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `Order ${d.orderId ?? ''} confirmed`.trim(),
  displayName: 'Order Confirmation',
  previewData: {
    name: 'Alex', orderId: 'TH-1042', total: '$249.00',
    items: [{ name: 'Shopify CRO Audit', qty: 1, price: '$249.00' }],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica Neue, Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const brand = { borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }
const brandText = { color: '#0369a1', fontSize: '14px', fontWeight: 700, letterSpacing: '2px', margin: 0 }
const h1 = { color: '#0f172a', fontSize: '26px', fontWeight: 700, margin: '0 0 16px' }
const text = { color: '#334155', fontSize: '16px', lineHeight: '26px', margin: '0 0 16px' }
const card = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', margin: '16px 0 24px' }
const label = { color: '#64748b', fontSize: '13px', margin: '4px 0' }
const value = { color: '#0f172a', fontSize: '14px', margin: '4px 0' }
const totalStyle = { color: '#0369a1', fontSize: '16px', fontWeight: 700, margin: '4px 0' }
const hrLight = { borderColor: '#e2e8f0', margin: '12px 0' }
const hr = { borderColor: '#e2e8f0', margin: '32px 0 16px' }
const footer = { color: '#64748b', fontSize: '12px', textAlign: 'center' as const }
