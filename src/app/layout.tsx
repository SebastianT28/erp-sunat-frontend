import type { Metadata } from "next"; //prueba de logs
import dynamic from 'next/dynamic';
import { Spectral, Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ERP SUNAT - Sistema Contable",
  description: "Sistema Web de Servicios Administrativos y Contables",
};

const HelpDeskWidget = dynamic(() => import('@/components/HelpDeskWidget/HelpDeskWidget'));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${nunitoSans.variable} ${spectral.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <HelpDeskWidget />
      </body>
    </html>
  );
}