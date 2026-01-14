// ARCHIVO: src/emails/components/email-layout.tsx
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
} from '@react-email/components';

interface EmailLayoutProps {
  previewText: string;
  heading?: string;
  children: React.ReactNode;
}

export const EmailLayout = ({ previewText, heading, children }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans px-2 py-10">
          <Container className="bg-white border border-slate-200 rounded mx-auto p-5 max-w-[480px]">
            {/* LOGO O TÍTULO */}
            <Section className="mb-4">
              <Text className="text-xl font-bold text-slate-900 m-0">
                Synapse IPG
              </Text>
            </Section>

            {/* TÍTULO DEL MENSAJE */}
            {heading && (
                <Text className="text-xl text-slate-800 font-semibold mb-4">
                  {heading}
                </Text>
            )}

            {/* CONTENIDO DINÁMICO */}
            <Section>
                {children}
            </Section>

            <Hr className="border-slate-200 my-6" />

            {/* FOOTER */}
            <Text className="text-xs text-slate-500 text-center">
              Synapse IPG System - Notificaciones Automáticas
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};