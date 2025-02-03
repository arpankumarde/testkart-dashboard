import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const fontInter = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Teacher's App | TestKart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontInter.variable} antialiased font-[family-name:var(--font-inter)]`}
      >
        {children}
      </body>
    </html>
  );
}
