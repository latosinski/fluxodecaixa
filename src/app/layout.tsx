import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "aos/dist/aos.css";
import AOSProvider from "@/components/AOSProvider";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-inter",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["600", "700"],
    variable: "--font-playfair",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Cash Pró - Fluxo de Caixa - Gestão Financeira Completa para Empresas",
    description:
        "Controle lançamentos, fluxo de caixa, metas, DRE, contas a pagar e receber, relatórios e projeções.",
    keywords: [
        "fluxo de caixa",
        "controle financeiro",
        "sistema financeiro",
        "DRE",
        "contas a pagar",
        "contas a receber",
        "plano de contas",
        "gestão financeira",
    ],
    openGraph: {
        title: "Sistema Fluxo de Caixa - Gestão Financeira Completa",
        description:
            "Controle lançamentos, fluxo de caixa, metas, DRE, contas a pagar e receber, relatórios e projeções.",
        url: "https://fluxodecaixa.com.br",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
            <body>
                <AOSProvider>{children}</AOSProvider>
            </body>
        </html>
    );
}