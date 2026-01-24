import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NeuroDiet - Nutrição Adaptativa & Gamificada",
  description: "Plataforma de nutrição com IA e gamificação para alcançar seus objetivos de saúde",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NeuroDiet",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
