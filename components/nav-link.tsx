"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
};

export default function NavLink({
  href,
  children,
  className,
  exact = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      className={cn("text-stone-500 dark:text-stone-400", className, {
        "text-foreground dark:text-white font-semibold": isActive,
      })}
    >
      {children}
    </Link>
  );
}
