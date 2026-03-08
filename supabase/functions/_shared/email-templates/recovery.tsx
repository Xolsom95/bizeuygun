/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="tr" dir="ltr">
    <Head />
    <Preview>BizeUygun şifre sıfırlama</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://dcszgnahtwxxvkoqdlwo.supabase.co/storage/v1/object/public/email-assets/logo.png" width="48" height="48" alt="BizeUygun" style={{ marginBottom: '20px' }} />
        <Heading style={h1}>Şifreni Sıfırla</Heading>
        <Text style={text}>
          BizeUygun hesabın için şifre sıfırlama talebi aldık. Yeni bir şifre belirlemek için aşağıdaki butona tıkla.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Şifremi Sıfırla
        </Button>
        <Text style={footer}>
          Bu talebi sen yapmadıysan, bu e-postayı dikkate almayabilirsin. Şifren değişmeyecektir.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', Arial, sans-serif" }
const container = { padding: '24px 28px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 25px' }
const button = { backgroundColor: '#0f1d3d', color: '#ffffff', fontSize: '14px', borderRadius: '12px', padding: '12px 24px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '30px 0 0' }
