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
    Font,
} from "@react-email/components";
import * as React from "react";

interface SharedResourceEmailProps {
    senderName: string;
    resourceTitle: string;
    resourceLink: string;
}

export const SharedResourceEmail = ({
    senderName,
    resourceTitle,
    resourceLink,
}: SharedResourceEmailProps) => {
    const previewText = `${senderName} ha compartido un documento contigo en Synapse`;

    return (
        <Html lang="es">
            <Head>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-[#f3f4f6] my-auto mx-auto font-sans px-2 py-10">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white shadow-md">

                        {/* LOGO / HEADER */}
                        <Section className="mt-[20px] text-center">
                            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                Synapse <span className="font-bold text-[#2563EB]">IPG</span>
                            </Heading>
                        </Section>

                        {/* SALUDO */}
                        <Text className="text-[#333333] text-[14px] leading-[24px]">
                            Hola,
                        </Text>
                        <Text className="text-[#333333] text-[14px] leading-[24px]">
                            <strong>{senderName}</strong> te ha enviado un nuevo documento o recurso a través de la plataforma colaborativa.
                        </Text>

                        {/* TARJETA DEL RECURSO */}
                        <Section className="bg-[#f8fafc] rounded-lg p-6 my-6 border border-[#e2e8f0] text-center">
                            {/* Ícono simulado con texto para asegurar compatibilidad */}
                            <div className="mx-auto mb-3 text-[32px]">
                                📄
                            </div>
                            <Text className="m-0 mb-1 text-[18px] font-semibold text-[#1e293b]">
                                {resourceTitle}
                            </Text>
                            <Text className="m-0 text-[13px] text-[#64748b]">
                                Disponible para descarga o visualización
                            </Text>
                        </Section>

                        {/* BOTÓN CTA - BLINDADO */}
                        <Section className="text-center mt-[10px] mb-[32px]">
                            <Button
                                className="bg-[#2563EB] rounded text-white text-[14px] font-bold no-underline text-center px-6 py-3 block w-full max-w-[200px] mx-auto"
                                href={resourceLink}
                            >
                                Ver Recurso Ahora
                            </Button>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        {/* FOOTER / SOPORTE */}
                        <Text className="text-[#666666] text-[12px] leading-[20px]">
                            Si no esperabas este archivo, puedes ignorar este correo.
                            <br />
                            Para asistencia técnica, contacta a: {" "}
                            <Link href="mailto:luis.rivera@ipg.cl" className="text-[#2563EB] no-underline font-medium">
                                luis.rivera@ipg.cl
                            </Link>
                        </Text>

                        <Text className="text-[#9ca3af] text-[11px] leading-[20px] mt-4 text-center">
                            © 2026 Synapse IPG. Plataforma de Gestión Documental.
                        </Text>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default SharedResourceEmail;