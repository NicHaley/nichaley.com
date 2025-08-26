import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import NavLink from "@/components/nav-link";
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
        <div className="min-h-dvh p-12">
          <div className="mb-8">
            <Link href="/">
              <Image src="/glasses.webp" alt="logo" width={48} height={48} />
            </Link>
          </div>
          <div className="md:grid md:grid-cols-[auto_1fr] gap-24">
            <nav className="">
              <ul className="flex flex-col gap-4">
                <li>
                  <NavLink href="/" exact>
                    about
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/projects">projects</NavLink>
                </li>
                <li>
                  <NavLink href="/writing">writing</NavLink>
                </li>
              </ul>
            </nav>
            <main className="prose prose-lg">
              <ViewTransition default="blur-fade">{children}</ViewTransition>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
