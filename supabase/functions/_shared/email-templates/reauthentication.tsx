/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="tr" dir="ltr">
    <Head />
    <Preview>BizeUygun doğrulama kodun</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://dcszgnahtwxxvkoqdlwo.supabase.co/storage/v1/object/public/email-assets/logo.png" width="48" height="48" alt="BizeUygun" style={{ marginBottom: '20px' }} />
        <Heading style={h1}>Kimlik Doğrulama</Heading>
        <Text style={text}>Kimliğini doğrulamak için aşağıdaki kodu kullan:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          Bu kod kısa süre içinde geçerliliğini yitirecektir. Bu talebi sen yapmadıysan, bu e-postayı dikkate almayabilirsin.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', Arial, sans-serif" }
const container = { padding: '24px 28px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 25px' }
const codeStyle = { fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: 'bold' as const, color: '#0f1d3d', letterSpacing: '4px', margin: '0 0 30px' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '30px 0 0' }
