import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
  Link,
  Img,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  userEmail?: string;
  resetLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://synapseipg.vercel.app";

export const ResetPasswordEmail = ({
  userEmail = "usuario@ipg.cl",
  resetLink = "https://synapseipg.vercel.app/update-password",
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Restablecer contraseña - Synapse IPG 🔒</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2563EB", // Azul institucional exacto
                offwhite: "#fafbfb",
                textMain: "#1a1a1a",
                textMuted: "#666666",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite my-auto mx-auto font-sans px-2 py-10">
          <Container className="border border-solid border-[#eaeaea] rounded-lg my-[40px] mx-auto p-[20px] max-w-[465px] bg-white shadow-sm">
            
            {/* HEADER: LOGO */}
            <Section className="mt-[20px] mb-[32px] text-center">
               <Heading className="text-textMain text-[24px] font-normal text-center p-0 my-0 mx-0">
                  Synapse <span className="font-bold text-brand">IPG</span>
               </Heading>
            </Section>

            {/* CONTENIDO PRINCIPAL */}
            <Text className="text-textMain text-[14px] leading-[24px]">
              Hola <strong>{userEmail}</strong>,
            </Text>

            <Text className="text-textMain text-[14px] leading-[24px]">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta corporativa. 
              Si fuiste tú, puedes crear una nueva contraseña de forma segura usando el botón a continuación:
            </Text>

            {/* CTA BUTTON */}
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-brand rounded-md text-white text-[14px] font-semibold no-underline text-center px-6 py-3 block w-full max-w-[280px] mx-auto"
                href={resetLink}
              >
                Restablecer Contraseña
              </Button>
            </Section>

            <Text className="text-textMain text-[14px] leading-[24px]">
              O copia y pega este enlace en tu navegador (válido por 1 hora):
            </Text>
            
            <Link 
              href={resetLink}
              className="text-brand no-underline text-[12px] break-all"
            >
              {resetLink}
            </Link>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            {/* AVISO DE SEGURIDAD */}
            <Section className="bg-orange-50 rounded p-3 mb-6 border border-orange-100">
                <Text className="text-orange-800 text-[12px] leading-[20px] m-0 font-medium">
                  🔒 Seguridad: Si no solicitaste este cambio, ignora este correo. Tu cuenta permanece segura.
                </Text>
            </Section>

            {/* FOOTER */}
            <Text className="text-textMuted text-[12px] leading-[24px] text-center">
              © 2026 Synapse IPG System. <br/>
              Departamento de Tecnología e Informática.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;