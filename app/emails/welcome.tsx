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
  } from "@react-email/components";
  import * as React from "react";
  
  interface WelcomeEmailProps {
    userFirstname?: string;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  export const WelcomeEmail = ({
    userFirstname = "Colega",
  }: WelcomeEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Bienvenido a Synapse IPG - Tu cuenta está activa 🚀</Preview>
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  brand: "#2563EB", // Azul institucional IPG
                  offwhite: "#fafbfb",
                },
              },
            },
          }}
        >
          <Body className="bg-offwhite my-auto mx-auto font-sans px-2 py-10">
            <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white shadow-sm">
              
              {/* LOGO / HEADER */}
              <Section className="mt-[20px]">
                  <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                    Synapse <span className="font-bold text-brand">IPG</span>
                  </Heading>
              </Section>
  
              {/* SALUDO Y CONFIRMACIÓN */}
              <Text className="text-black text-[14px] leading-[24px]">
                Hola <strong>{userFirstname}</strong>,
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                ¡Bienvenido a bordo! Nos complace confirmarte que <strong>tu cuenta ha sido correctamente inscrita y activada</strong> en nuestra plataforma.
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                El ecosistema Synapse de IPG ha sido diseñado para centralizar y potenciar nuestro flujo de trabajo. A partir de ahora tienes el control total para:
              </Text>
  
              {/* LISTA DE FUNCIONALIDADES (CREATIVIDAD APLICADA) */}
              <Section className="bg-slate-50 rounded-lg p-4 my-4 border border-slate-100">
                  <Text className="m-0 mb-2 text-[13px] text-slate-700">✅ <strong>Gestión de Recursos:</strong> Sube, visualiza y organiza documentos institucionales.</Text>
                  <Text className="m-0 mb-2 text-[13px] text-slate-700">🤝 <strong>Colaboración Total:</strong> Comparte archivos de forma segura con otros usuarios o grupos de trabajo enteros.</Text>
                  <Text className="m-0 text-[13px] text-slate-700">⚡ <strong>Acceso Rápido:</strong> Descarga lo que necesites, cuando lo necesites, desde cualquier lugar.</Text>
              </Section>
  
              {/* BOTÓN CTA */}
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href={`${baseUrl}/dashboard`}
                >
                  Acceder a la Plataforma
                </Button>
              </Section>
  
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
  
              {/* SOPORTE */}
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                Si tienes alguna duda sobre el uso de la plataforma o necesitas asistencia técnica, no dudes en contactar directamente a:
                <br />
                <Link href="mailto:luis.rivera@ipg.cl" className="text-brand no-underline font-medium">
                  luis.rivera@ipg.cl
                </Link>
              </Text>
              
              <Text className="text-[#666666] text-[12px] leading-[24px] mt-4 text-center">
                © 2026 Synapse IPG. Todos los derechos reservados.
              </Text>
  
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  
  export default WelcomeEmail;