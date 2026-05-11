"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function ReviewSection({ productId }: { productId: string }) {
  return (
    <div>
      <div className="flex items-end justify-between border-b border-[#222] pb-4 mb-8">
        <h2 className="text-2xl font-heading font-bold">CUSTOMER TELEMETRY</h2>
        <button className="bg-[#6C63FF] text-[#F5F0EB] text-xs font-mono font-bold px-6 py-2 hover:bg-[#524ac4] transition-colors">
          LOG REVIEW
        </button>
      </div>

      {/* Placeholder layout for reviews */}
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3">
          <div className="text-6xl font-mono font-bold text-[#F5F0EB] mb-2">4.8</div>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
          </div>
          <p className="text-xs text-[#888] font-mono">BASED ON 254 ENTRIES</p>
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <div className="bg-[#111] p-6 border border-[#222]">
            <div className="flex justify-between mb-4">
              <div>
                <h4 className="font-bold text-[#F5F0EB] mb-1">Exceptional Architecture</h4>
                <div className="flex gap-1"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /></div>
              </div>
              <span className="text-xs text-[#666] font-mono">10.05.2026</span>
            </div>
            <p className="text-sm text-[#888] leading-relaxed">
              "The precision and performance of this unit is unmatched. Setup was seamless and it integrates perfectly with my current rack. Highly recommended for enterprise applications."
            </p>
            <p className="text-xs text-[#6C63FF] font-mono mt-4">VERIFIED ACQUISITION</p>
          </div>
        </div>
      </div>
    </div>
  );
}
