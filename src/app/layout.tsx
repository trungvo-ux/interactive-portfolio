import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { FloatingNav } from "@/components/FloatingNav";
import { CommandPalette } from "@/components/CommandPalette";

const siteUrl = "https://portfolio-apple-eight.vercel.app";

const title = "Trung Vo — Product Designer";
const description =
  "Trung Vo designs systems for complex data work, currently at IBM on watsonx.data";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Trung Vo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <body>
        <FloatingNav />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
