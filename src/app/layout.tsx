import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import LoaderComponent from "@/components/blocks/LoaderComponent";

const fontInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teacher's App | TestKart",
  icons: ["/static/logo.png"],
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
        <Suspense fallback={<LoaderComponent />}>{children}</Suspense>
      </body>
    </html>
  );
}
