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

interface ResourceSharedEmailProps {
    recipientName?: string;
    senderName: string;
    resourceTitle: string;
    resourceId: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const ResourceSharedEmail = ({
    recipientName = "Colega",
    senderName = "Un usuario",
    resourceTitle = "Documento sin título",
    resourceId = "",
}: ResourceSharedEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>{senderName} te ha compartido un recurso en Synapse IPG 📂</Preview>
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

                        {/* CUERPO DEL MENSAJE */}
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hola <strong>{recipientName}</strong>,
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            <strong>{senderName}</strong> te ha dado acceso a un nuevo recurso en la plataforma institucional.
                        </Text>

                        <Section className="bg-blue-50 rounded-lg p-4 my-4 border border-blue-100 text-center">
                            <Text className="m-0 text-[16px] font-semibold text-blue-800">
                                📄 {resourceTitle}
                            </Text>
                            <Text className="m-0 text-[12px] text-blue-600 mt-1">
                                Disponible ahora en tu biblioteca
                            </Text>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Puedes visualizar, descargar o gestionar este archivo directamente ingresando a tu panel de control.
                        </Text>

                        {/* BOTÓN CTA */}
                        <Section className="text-center mt-[32px] mb-[32px]">
                            {/* Ajusta la URL según tu ruteo, por ejemplo al dashboard o al preview del recurso */}
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${baseUrl}/dashboard?open=${resourceId}`}
                            >
                                Ver Recurso Compartido
                            </Button>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        {/* FOOTER */}
                        <Text className="text-[#666666] text-[12px] leading-[24px] mt-4 text-center">
                            Has recibido este correo porque formas parte del equipo Synapse IPG.
                            <br />
                            © 2026 Synapse IPG. Todos los derechos reservados.
                        </Text>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ResourceSharedEmail;