// components/ui/card.tsx
import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={`rounded-lg shadow-md overflow-hidden bg-white ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children }: { children: ReactNode }) => (
  <div className="p-4">{children}</div>
);

export const CardHeader = ({ children }: { children: ReactNode }) => (
  <div className="px-4 py-2 border-b">{children}</div>
);

export const CardFooter = ({ children }: { children: ReactNode }) => (
  <div className="px-4 py-2 border-t">{children}</div>
);
