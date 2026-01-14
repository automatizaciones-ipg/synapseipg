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
  
  interface ResetPasswordEmailProps {
    userEmail?: string;
    resetLink?: string;
  }
  
  // AJUSTE DE SEGURIDAD: Default a HTTPS para evitar contenido mixto
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";
  
  export const ResetPasswordEmail = ({
    userEmail = "usuario@ipg.cl",
    resetLink = "https://synapse.ipg.cl/reset",
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
                  brand: "#2563EB", // Mismo azul institucional
                  offwhite: "#fafbfb",
                },
              },
            },
          }}
        >
          <Body className="bg-offwhite my-auto mx-auto font-sans px-2 py-10">
            <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white shadow-sm">
              
              {/* LOGO / HEADER IDENTICO */}
              <Section className="mt-[20px]">
                  <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                    Synapse <span className="font-bold text-brand">IPG</span>
                  </Heading>
              </Section>
  
              {/* SALUDO */}
              <Text className="text-black text-[14px] leading-[24px]">
                Hola <strong>{userEmail}</strong>,
              </Text>
              
              <Text className="text-black text-[14px] leading-[24px]">
                Hemos recibido una solicitud para actualizar la contraseña de tu cuenta en el ecosistema <strong>Synapse IPG</strong>.
              </Text>
              
              <Text className="text-black text-[14px] leading-[24px]">
                Para garantizar la seguridad de tus datos y el acceso a los recursos institucionales, por favor utiliza el siguiente enlace seguro (válido por 1 hora):
              </Text>
  
              {/* BOTÓN CTA */}
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href={resetLink}
                >
                  Cambiar mi Contraseña
                </Button>
              </Section>
  
              {/* LINK MANUAL (SEGURIDAD EXTRA) */}
              <Text className="text-slate-500 text-[12px] leading-[20px] mb-4">
                  Si el botón anterior no funciona, copia y pega la siguiente URL en tu navegador:
              </Text>
              <Link 
                  href={resetLink}
                  className="text-blue-600 no-underline text-[12px] break-all"
              >
                  {resetLink}
              </Link>
  
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
  
              {/* AVISO DE SEGURIDAD */}
              <Section className="bg-yellow-50 rounded p-3 mb-4 border border-yellow-100">
                  <Text className="text-yellow-800 text-[12px] leading-[20px] m-0 font-medium">
                    ⚠️ Importante: Si tú no has solicitado este cambio, por favor ignora este correo. Tu contraseña actual seguirá funcionando y tus datos permanecerán seguros.
                  </Text>
              </Section>
  
              {/* SOPORTE (IDENTICO A WELCOME) */}
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                ¿Necesitas ayuda? Contacta a soporte técnico:
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
  
  export default ResetPasswordEmail;