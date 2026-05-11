import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CartDrawer } from "@/components/store/CartDrawer";
import Navbar from "@/components/layout/Navbar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Nexus Core",
  description: "Precision engineered in the dark.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${cormorant.variable} ${jetbrainsMono.variable} antialiased font-sans min-h-screen flex flex-col bg-[#0A0A0F] text-[#F5F0EB]`}>
        {/* Simplified Navbar for demo, actual would be in components/layout/Navbar */}
        <Navbar />
        <CartDrawer />
        <main className="flex-1 flex flex-col">{children}</main>
        <Toaster richColors position="top-center" theme="dark" />
      </body>
    </html>
  );
}
