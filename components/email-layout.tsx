import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
  Link,
} from '@react-email/components';

interface EmailLayoutProps {
  previewText: string;
  heading?: string;
  children: React.ReactNode;
}

// Configuración de tema con tu color exacto
const config = {
  theme: {
    extend: {
      colors: {
        brand: '#067DFE', // Tu azul institucional
        brandDark: '#0056b3',
        offwhite: '#f9fafb',
        textMain: '#334155',
        textMuted: '#64748b',
      },
    },
  },
};

export const EmailLayout = ({ previewText, heading, children }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={config}>
        <Body className="bg-offwhite font-sans px-2 py-10 my-auto mx-auto">
          <Container className="bg-white border border-slate-200 rounded-lg mx-auto p-8 max-w-[520px] shadow-sm">
            
            {/* LOGO TEXTUAL */}
            <Section className="mb-6">
              <Text className="text-2xl font-bold text-slate-900 m-0 text-center">
                Synapse <span className="text-brand">IPG</span>
              </Text>
            </Section>

            {/* TÍTULO */}
            {heading && (
              <Text className="text-xl text-slate-800 font-semibold mb-6 text-center">
                {heading}
              </Text>
            )}

            {/* CONTENIDO */}
            <Section>
              {children}
            </Section>

            <Hr className="border-slate-100 my-8" />

            {/* FOOTER */}
            <Section className="text-center">
              <Text className="text-xs text-textMuted leading-5">
                © {new Date().getFullYear()} Synapse IPG. Todos los derechos reservados.<br/>
                <Link href="https://ipg.cl" className="text-brand no-underline">www.ipg.cl</Link>
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailLayout;