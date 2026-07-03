import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { FloatingNav } from "@/components/FloatingNav";

export const metadata: Metadata = {
  title: "Trung Vo — Product Designer",
  description:
    "Trung Vo designs systems for complex data work, currently at IBM on watsonx.data. A portfolio, and an interactive passport.",
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
        {children}
      </body>
    </html>
  );
}
