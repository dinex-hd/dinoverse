import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dinoverse - Portfolio, Services & Digital Store",
  description: "A modern platform combining portfolio showcase, service marketplace, blog, and digital storefront. Connect with Dinoverse for creative, technical, and trading services.",
  keywords: "portfolio, services, blog, digital store, web development, design, trading",
  authors: [{ name: "Dinoverse" }],
  openGraph: {
    title: "Dinoverse - Portfolio, Services & Digital Store",
    description: "A modern platform combining portfolio showcase, service marketplace, blog, and digital storefront.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
