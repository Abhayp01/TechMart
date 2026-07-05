"use client";

import { storeConfig } from "@/lib/store-config";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Award, ShieldCheck, Truck, Building, Headphones, Receipt, Wrench, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  Award, ShieldCheck, Truck, Building, Headphones, Receipt, Wrench, BadgeCheck
};

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader 
          overline="The B.K. Infotech Advantage"
          title="Why Choose Us"
          subtitle="We've been delivering excellence in IT hardware and services since 2006."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {storeConfig.whyChooseUs.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 hover-glow group bg-card"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {Icon && <Icon className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
