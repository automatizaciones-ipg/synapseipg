import * as React from "react";
import { EmailLayout } from "./email-layout";
import { Text, Section, Button, Link } from "@react-email/components";

interface WelcomeEmailProps {
  userFirstname?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://synapse.ipg.cl";

export const WelcomeEmail = ({
  userFirstname = "Colega",
}: WelcomeEmailProps) => {
  
  return (
    <EmailLayout 
      previewText={`Bienvenido a Synapse IPG - Tu cuenta está activa 🚀`}
      heading="¡Bienvenido a bordo!"
    >
      <Text className="text-textMain text-[15px] leading-[26px]">
        Hola <strong>{userFirstname}</strong>,
      </Text>
      
      <Text className="text-textMain text-[15px] leading-[26px]">
        Nos complace confirmarte que <strong>tu cuenta ha sido correctamente inscrita y activada</strong> en nuestra plataforma.
      </Text>

      <Text className="text-textMain text-[15px] leading-[26px]">
        El ecosistema Synapse de IPG ha sido diseñado para centralizar los recursos institucionales.
      </Text>

      {/* LISTA ESTILIZADA */}
      <Section className="bg-slate-50 rounded-lg p-5 my-6 border border-slate-100">
        <Text className="m-0 mb-2 text-[14px] text-slate-700">✅ <strong>Gestión:</strong> Sube y organiza recursos institucionales.</Text>
        <Text className="m-0 mb-2 text-[14px] text-slate-700">🤝 <strong>Colaboración:</strong> Comparte archivos de forma segura con usuarios de ipg.</Text>
        <Text className="m-0 text-[14px] text-slate-700">⚡ <strong>Acceso:</strong> Descarga lo que necesites desde cualquier dispositivo y lugar.</Text>
        <br/>
        <Text className="m-0 text-[14px] text-slate-700">⚡ <strong>Cuenta:</strong> Tu contraseña actual es: ABCabc123 y te recomendamos cambiarla desde el login de la plataforma.</Text>
      </Section>

      {/* BOTÓN CTA */}
      <Section className="text-center my-8">
        <Button
          className="bg-brand rounded-md text-white text-[14px] font-semibold no-underline text-center px-6 py-3"
          href={`${baseUrl}/dashboard`}
        >
          Acceder a la Plataforma
        </Button>
      </Section>

      <Text className="text-textMuted text-[13px] leading-[22px]">
        Si tienes alguna duda, contacta a{" "}
        <Link href="mailto:luis.rivera@ipg.cl" className="text-brand font-medium no-underline">
          luis.rivera@ipg.cl
        </Link>
      </Text>
    </EmailLayout>
  );
};

export default WelcomeEmail;