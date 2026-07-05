import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CartDrawer } from "@/components/store/CartDrawer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "B.K. Infotech — Enterprise IT Solutions | Nehru Place, Delhi",
    template: "%s | B.K. Infotech",
  },
  description: "Delhi's trusted IT partner since 2006. Laptops, Desktops, Printers, UPS, Networking, Custom Gaming PCs & Enterprise Hardware from Dell, HP, Lenovo, Apple, Cisco & more.",
  keywords: ["laptops", "desktops", "printers", "networking", "UPS", "custom PC", "Nehru Place", "Delhi", "IT hardware", "B.K. Infotech"],
  openGraph: {
    title: "B.K. Infotech — Enterprise IT Solutions",
    description: "Powering businesses with laptops, desktops, networking, enterprise hardware & custom-built PCs since 2006.",
    type: "website",
    locale: "en_IN",
    siteName: "B.K. Infotech",
  },
  twitter: {
    card: "summary_large_image",
    title: "B.K. Infotech — Enterprise IT Solutions",
    description: "Delhi's trusted IT partner. Sale & Repair: Laptop, Desktop, Printer, UPS, Networking & Accessories.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-[family-name:var(--font-sans)] min-h-screen flex flex-col bg-background text-foreground`}>
        <Navbar />
        <CartDrawer />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <Toaster richColors position="top-center" theme="light" />
      </body>
    </html>
  );
}
