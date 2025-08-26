import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { unstable_ViewTransition as ViewTransition } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nic Haley",
  description: "Nic Haley's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
          <nav className="p-8">
            <Link href="/">
              <Image
                className="mb-8"
                src="/glasses.webp"
                alt="logo"
                width={48}
                height={48}
              />
            </Link>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/" className="hover:underline">
                  about
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:underline">
                  projects
                </Link>
              </li>
              <li>
                <Link href="/writing" className="hover:underline">
                  writing
                </Link>
              </li>
            </ul>
          </nav>
          <main className="prose prose-lg p- pt-28">
            <ViewTransition default="blur-fade">{children}</ViewTransition>
          </main>
        </div>
      </body>
    </html>
  );
}
