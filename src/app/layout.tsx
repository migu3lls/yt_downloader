import type { Metadata } from "next";
import "./globals.css";
import { BrandFooter } from "@/components/brand/BrandFooter";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { SessionProvider } from "@/components/session/SessionProvider";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "10Ativas Media Studio — Conversor e Downloader de Alta Fidelidade",
  description:
    "Extraia e converta áudios em MP3 e vídeos em MP4 (até 1080p) com velocidade instantânea, privacidade efêmera e sem anúncios.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.svg",
    apple: "/brand/logo-icone.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-brand-obsidian text-white flex flex-col antialiased selection:bg-brand-green selection:text-brand-obsidian">
        <SessionProvider>
          <BrandHeader />
          <main className="flex-1 flex flex-col">{children}</main>
          <BrandFooter />
          <CookieBanner />
          <Toaster richColors position="bottom-right" theme="dark" />
        </SessionProvider>
      </body>
    </html>
  );
}
