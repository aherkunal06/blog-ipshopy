// app/components/ClientLayoutWrapper.tsx
"use client";

import { FloatingBg } from "./FloatingGig";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";

export const ClientLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <FloatingBg />
      {children}
    </ThemeProvider>
  );
};
