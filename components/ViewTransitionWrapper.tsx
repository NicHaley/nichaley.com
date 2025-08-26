"use client";

import { unstable_ViewTransition as ViewTransition } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function ViewTransitionWrapper({ children, className }: Props) {
  return (
    <ViewTransition default="blur-fade">
      <div className={className}>{children}</div>
    </ViewTransition>
  );
}
