"use client";

import Header from "../../admin-components/Header";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "next-auth/react";
// import Footer from "../../admin-components/Footer";
// import { Provider } from "react-redux";
// import { store } from "../redux/store/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <SessionProvider>
      <ThemeProvider>
        {/* <Provider store={store}> */}
          <div
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            <Header>{children}</Header>

            {/* <Footer /> */}
          </div>
        {/* </Provider> */}
      </ThemeProvider>
    </SessionProvider>
    </>
  );
}
