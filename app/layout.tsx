import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
        {children}
        {/* <div className="min-h-dvh md:grid md:grid-cols-[240px_1fr]">
          <aside className="md:sticky md:top-0 md:h-dvh">
            <nav className="px-4 pb-4 md:px-6 md:pb-6">
              <ul className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                <li>
                  <Link href="/" className="hover:underline">
                    about
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/nicholas-haley-22757389/"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    projects
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@nichaley.com"
                    className="hover:underline"
                  >
                    writing
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
          <main>{children}</main>
        </div> */}
      </body>
    </html>
  );
}
