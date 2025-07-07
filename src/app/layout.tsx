import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { WagmiProvider } from "@/providers/wagmi-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nadtools - Monad Tooling Platform",
  description:
    "Nadtools is a powerful tooling platform built for Monad, enabling users to easily interact with collections, and activities on Monad. Empower your experience with intuitive tools designed for the Monad ecosystem.",
  keywords: [
    "Monad",
    "Nadtools",
    "NFT",
    "Token",
    "Airdrop",
    "Bulk Transfer",
    "Messenger",
    "Web3",
    "Blockchain",
    "Tooling Platform",
  ],
  authors: [{ name: "Tonashiro" }],
  creator: "Tonashiro",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nadtools.app",
    title: "Nadtools - Monad Tooling Platform",
    description:
      "Nadtools is a powerful tooling platform built for Monad, enabling users to easily interact with collections, and activities on Monad. Empower your experience with intuitive tools designed for the Monad ecosystem.",
    siteName: "Nadtools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nadtools - Monad Tooling Platform",
    description:
      "Nadtools is a powerful tooling platform built for Monad, enabling users to easily interact with collections, and activities on Monad. Empower your experience with intuitive tools designed for the Monad ecosystem.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}
      >
        <SessionProvider>
          <QueryProvider>
            <WagmiProvider>
              <MobileSidebar>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </MobileSidebar>
            </WagmiProvider>
          </QueryProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
