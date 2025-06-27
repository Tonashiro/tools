import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snapshoter - Modern Next.js 15 Application",
  description:
    "A clean, well-structured Next.js 15 application built with best practices, featuring semantic HTML and modern UI components.",
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Modern Web Development",
  ],
  authors: [{ name: "Snapshoter Team" }],
  creator: "Snapshoter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://snapshoter.app",
    title: "Snapshoter - Modern Next.js 15 Application",
    description:
      "A clean, well-structured Next.js 15 application built with best practices.",
    siteName: "Snapshoter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snapshoter - Modern Next.js 15 Application",
    description:
      "A clean, well-structured Next.js 15 application built with best practices.",
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
        <QueryProvider>
          <MobileSidebar>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </MobileSidebar>
        </QueryProvider>
      </body>
    </html>
  );
}
