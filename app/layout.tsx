import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import NavLink from "@/components/nav-link";
import { Geist, Geist_Mono } from "next/font/google";
import { unstable_ViewTransition as ViewTransition } from "react";
import Glasses from "@/public/glasses.svg";
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh p-4 md:p-12 flex flex-col antialiased bg-background md:grid md:grid-cols-[auto_1fr] md:items-start gap-8 md:gap-24 flex-1 relative`}
      >
        <nav className="md:sticky md:top-12 flex md:flex-col max-md:items-center">
          <Link href="/">
            <Image src={Glasses} alt="logo" width={48} height={48} />
          </Link>
          <ul className="flex md:flex-col gap-2 md:mt-8 max-md:ml-auto">
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
            {/* <li className="mt-auto">
              <Link
                className="no-underline hover:underline text-stone-500"
                href="https://github.com/NicHaley/nichaley.com"
                target="_blank"
              >
                ↗ source
              </Link>
            </li> */}
          </ul>
        </nav>
        <main className="prose prose-lg prose-stone md:mt-[78px]">
          <ViewTransition default="blur-fade">{children}</ViewTransition>
        </main>
        {/* <div className="min-h-dvh p-12 flex flex-col">
          <div className="mb-8 hidden md:block">
            <Link href="/">
              <Image src="/glasses.svg" alt="logo" width={48} height={48} />
            </Link>
          </div>
          <div className="mb-8 flex items-center justify-between md:hidden">
            <Link href="/">
              <Image src="/glasses.svg" alt="logo" width={48} height={48} />
            </Link>
            <ul className="flex items-center gap-4">
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
          </div>
          <div className="md:grid md:grid-cols-[auto_1fr] gap-24 flex-1">
            <nav className="hidden md:block">
              <ul className="flex flex-col gap-2 h-full">
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
                <li className="mt-auto">
                  <Link
                    className="no-underline hover:underline text-stone-500"
                    href="https://github.com/NicHaley/nichaley.com"
                    target="_blank"
                  >
                    ↗ source
                  </Link>
                </li>
              </ul>
            </nav>
            <main className="prose prose-lg prose-stone">
              <ViewTransition default="blur-fade">{children}</ViewTransition>
            </main>
          </div>
        </div> */}
      </body>
    </html>
  );
}
