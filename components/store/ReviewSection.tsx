"use client";

import { Star } from "lucide-react";

export function ReviewSection({ productId }: { productId: string }) {
  return (
    <div>
      <div className="flex items-end justify-between border-b border-border pb-4 mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground">Customer Reviews</h2>
        <button className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Write a Review
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3">
          <div className="text-6xl font-heading font-extrabold text-foreground mb-2">4.8</div>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
          </div>
          <p className="text-sm text-muted-foreground font-medium">Based on 254 reviews</p>
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <div className="bg-card p-6 border border-border rounded-xl shadow-sm">
            <div className="flex justify-between mb-4">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Excellent Product, Fast Delivery</h4>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-medium">10 May 2026</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              &quot;The product quality is excellent and exactly as described. B.K. Infotech&apos;s team was helpful throughout. Setup was seamless and it works perfectly. Highly recommended!&quot;
            </p>
            <p className="text-xs font-semibold text-emerald-600 mt-4">✓ Verified Purchase</p>
          </div>
        </div>
      </div>
    </div>
  );
}
