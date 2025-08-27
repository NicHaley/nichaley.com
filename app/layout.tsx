import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import NavLink from "@/components/nav-link";
import { Geist, Geist_Mono } from "next/font/google";
import { unstable_ViewTransition as ViewTransition } from "react";
import Glasses from "@/public/glasses.svg";
import { ThemeProvider } from "next-themes";
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

const sections = [
  {
    title: "about",
    href: "/",
    exact: true,
  },
  {
    title: "projects",
    href: "/projects",
  },

  {
    title: "writing",
    href: "/writing",
  },

  {
    title: "shelf",
    href: "/shelf",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-dvh p-4 md:p-12 flex flex-col md:grid md:grid-cols-[auto_1fr] md:items-start gap-8 md:gap-24 flex-1 relative">
            <nav className="md:sticky md:top-12 flex md:flex-col max-md:items-center md:h-[calc(100vh-6rem)]">
              <Link href="/">
                <Image
                  className="dark:invert"
                  src={Glasses}
                  alt="logo"
                  width={48}
                  height={48}
                />
              </Link>
              <ul className="flex md:flex-col gap-2 md:mt-8 max-md:ml-auto">
                {sections.map((section) => (
                  <li key={section.href}>
                    <NavLink href={section.href} exact={section.exact}>
                      {section.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <main className="prose prose-lg prose-stone dark:prose-invert md:mt-[78px]">
              <ViewTransition default="blur-fade">{children}</ViewTransition>
            </main>
          </div>
          <div className="p-4 md:p-12">
            <Link
              className="no-underline hover:underline text-stone-500 dark:text-stone-400"
              href="https://github.com/NicHaley/nichaley.com"
              target="_blank"
            >
              ↗ source
            </Link>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
