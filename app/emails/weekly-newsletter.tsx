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
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

// --- INTERFACES ---

interface ResourceItem {
    id: string;
    title: string;
    category: string;
    created_at: string;
}

interface NewsItem {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface WeeklyNewsletterEmailProps {
    newResources?: ResourceItem[];
    totalNewResources?: number;
    companyNews?: NewsItem[];
    dashboardUrl?: string;
}

// --- DATOS POR DEFECTO ---

const defaultNews: NewsItem[] = [
    { id: "1", title: "N/A", description: "Sin noticias", icon: "ℹ️" }
];

export const WeeklyNewsletterEmail = ({
    newResources = [],
    totalNewResources = 0,
    companyNews = defaultNews,
    dashboardUrl = "https://ipg.cl/dashboard",
}: WeeklyNewsletterEmailProps) => {

    const safeResources = Array.isArray(newResources) ? newResources.slice(0, 5) : [];
    const totalString = String(totalNewResources);

    return (
        <Html>
            <Head />
            <Preview>{`Boletín Synapse: ${totalString} nuevos recursos globales disponibles.`}</Preview>

            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#003366", // Azul corporativo
                                textMain: "#1f2937",
                                textMuted: "#6b7280",
                                bgBody: "#f3f4f6",
                                bgCard: "#ffffff",
                            },
                        },
                    },
                }}
            >
                <Body className="bg-bgBody my-auto mx-auto font-sans px-2 py-8">
                    <Container className="bg-bgCard border border-solid border-[#e5e7eb] rounded mx-auto max-w-[480px] p-[20px] shadow-sm">

                        {/* 1. HEADER */}
                        <Section className="mt-[20px] mb-[30px] text-center">
                            <Heading className="text-textMain text-[24px] font-normal text-center p-0 my-0 mx-0">
                                Synapse <span className="font-bold text-brand">IPG</span>
                            </Heading>
                            <Text className="text-textMuted text-[12px] uppercase tracking-widest mt-2">
                                Boletín de Novedades
                            </Text>
                        </Section>

                        <Text className="text-textMain text-[14px] leading-[24px]">
                            Estimado Colaborador,
                        </Text>

                        <Text className="text-textMain text-[14px] leading-[24px]">
                            Compartimos contigo los recursos <strong>Globales</strong> más recientes añadidos a la plataforma, junto con noticias de interés institucional.
                        </Text>

                        {/* 2. RECURSOS GLOBALES */}
                        <Section className="bg-slate-50 rounded p-4 my-6 border border-slate-100">
                            <Heading className="text-brand text-[14px] font-bold m-0 mb-4 uppercase">
                                🌍 Recursos Globales del Mes
                            </Heading>

                            {safeResources.length > 0 ? (
                                safeResources.map((item, index) => (
                                    <div
                                        key={item.id}
                                        // LÓGICA SEGURA: Sin pseudo-clases, estilo limpio.
                                        className={index === safeResources.length - 1 ? "mb-0" : "mb-3 border-b border-slate-200 pb-3"}
                                    >
                                        <Text className="text-textMain font-semibold text-[13px] m-0">
                                            📄 {item.title}
                                        </Text>
                                        <Text className="text-textMuted text-[11px] m-0 mt-1 uppercase">
                                            {item.category} • {new Date(item.created_at).toLocaleDateString('es-CL')}
                                        </Text>
                                    </div>
                                ))
                            ) : (
                                <Text className="text-textMuted text-[12px] italic">
                                    No se han publicado recursos globales este mes.
                                </Text>
                            )}
                        </Section>

                        {/* 3. NOTICIAS CORPORATIVAS */}
                        <Section className="my-6">
                            <Heading className="text-textMain text-[16px] font-bold mb-4 border-l-4 border-brand pl-2">
                                Noticias IPG
                            </Heading>

                            {companyNews.map((news, index) => (
                                <Row key={news.id} className={index === companyNews.length - 1 ? "mb-0" : "mb-5"}>
                                    <Column className="w-8 align-top pt-1">
                                        <Text className="m-0 text-[18px]">{news.icon}</Text>
                                    </Column>
                                    <Column className="pl-2">
                                        <Text className="text-brand font-bold text-[13px] m-0">
                                            {news.title}
                                        </Text>
                                        <Text className="text-textMuted text-[12px] leading-[18px] m-0 mt-1">
                                            {news.description}
                                        </Text>
                                    </Column>
                                </Row>
                            ))}
                        </Section>

                        {/* 4. BOTÓN ESTÁNDAR (Estilo Welcome) */}
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-brand rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={dashboardUrl}
                            >
                                Ir al Dashboard
                            </Button>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        {/* 5. FOOTER SIMPLE */}
                        <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                            © {new Date().getFullYear()} Synapse IPG. Gestión Documental.
                        </Text>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WeeklyNewsletterEmail;