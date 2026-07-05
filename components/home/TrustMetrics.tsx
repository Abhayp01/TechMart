"use client";

import { storeConfig } from "@/lib/store-config";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Award, Users, Building, Headphones, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  Award, Users, Building, Headphones, ShieldCheck
};

export function TrustMetrics() {
  return (
    <section className="py-12 border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
          {storeConfig.trustMetrics.map((metric, index) => {
            const Icon = iconMap[metric.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center justify-center text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 text-primary group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                  {Icon && <Icon className="w-6 h-6" />}
                </div>
                <div className="text-3xl font-heading font-extrabold tracking-tight text-foreground mb-1">
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {metric.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
