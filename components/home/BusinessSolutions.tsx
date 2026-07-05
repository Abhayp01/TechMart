"use client";

import { storeConfig } from "@/lib/store-config";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Building2, GraduationCap, Landmark, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  Building2, GraduationCap, Landmark, Users
};

export function BusinessSolutions() {
  return (
    <section className="py-24 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader 
          overline="B2B Hardware & Services"
          title="Enterprise Solutions"
          subtitle="Specialized IT infrastructure and hardware procurement for organizations of all sizes."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeConfig.businessSolutions.map((solution, i) => {
            const Icon = iconMap[solution.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="group border border-border bg-card rounded-2xl overflow-hidden hover-glow transition-all"
              >
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{solution.title}</h3>
                  <p className="text-sm font-semibold text-primary mb-3">{solution.audience}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{solution.description}</p>
                </div>
                
                <div className="px-6 py-4 border-t border-border bg-muted/30">
                  <Link 
                    href="/business" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
