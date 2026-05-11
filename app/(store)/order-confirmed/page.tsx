"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6 text-[#F5F0EB]">
      <div className="max-w-md w-full bg-[#111] border border-[#333] p-10 text-center">
        <CheckCircle className="w-16 h-16 text-[#6C63FF] mx-auto mb-6" />
        <h1 className="text-3xl font-heading font-bold mb-4">ORDER CONFIRMED</h1>
        <p className="text-[#888] mb-8 leading-relaxed">
          Thank you for choosing Nexus Core. Your order has been securely logged. Our team will contact you shortly to confirm fulfillment details.
        </p>
        
        <div className="bg-[#0A0A0F] border border-[#222] p-4 mb-8">
          <p className="font-mono text-sm text-[#888]">ORDER IDENTIFIER</p>
          <p className="font-mono text-lg text-[#6C63FF] font-bold mt-1">{orderId || "UNKNOWN"}</p>
        </div>

        <Link href="/">
          <button className="w-full bg-[#F5F0EB] text-[#0A0A0F] font-bold py-4 hover:bg-[#6C63FF] hover:text-white transition-colors tracking-widest text-sm">
            RETURN TO STORE
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0F]" />}>
      <OrderConfirmedContent />
    </Suspense>
  );
}
