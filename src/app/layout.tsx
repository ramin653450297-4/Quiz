"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="container">
          <SessionProvider>{children}</SessionProvider>
        </div>
      </body>
    </html>
  );
}
