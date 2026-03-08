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
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="tr" dir="ltr">
    <Head />
    <Preview>BizeUygun'a hoş geldin! E-postanı doğrula.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://dcszgnahtwxxvkoqdlwo.supabase.co/storage/v1/object/public/email-assets/logo.png" width="48" height="48" alt="BizeUygun" style={{ marginBottom: '20px' }} />
        <Heading style={h1}>E-postanı Doğrula</Heading>
        <Text style={text}>
          <Link href={siteUrl} style={link}>
            <strong>BizeUygun</strong>
          </Link>
          'a kayıt olduğun için teşekkürler!
        </Text>
        <Text style={text}>
          E-posta adresini (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) doğrulamak için aşağıdaki butona tıkla:
        </Text>
        <Button style={button} href={confirmationUrl}>
          E-postamı Doğrula
        </Button>
        <Text style={footer}>
          Bu hesabı sen oluşturmadıysan, bu e-postayı dikkate almayabilirsin.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', Arial, sans-serif" }
const container = { padding: '24px 28px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 25px' }
const link = { color: '#f97316', textDecoration: 'underline' }
const button = { backgroundColor: '#0f1d3d', color: '#ffffff', fontSize: '14px', borderRadius: '12px', padding: '12px 24px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '30px 0 0' }
