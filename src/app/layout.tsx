import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import LoaderComponent from "@/components/blocks/LoaderComponent";
import { Toaster } from "@/components/ui/sonner";

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
        <Toaster position="top-center" theme="light" richColors />
      </body>
    </html>
  );
}
