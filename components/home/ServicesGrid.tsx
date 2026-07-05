"use client";

import { storeConfig } from "@/lib/store-config";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Wrench, Shield, Network, Cpu, HardDrive, Printer, Monitor, Server, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  Wrench, Shield, Network, Cpu, HardDrive, Printer, Monitor, Server
};

export function ServicesGrid() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="flex-1">
            <SectionHeader 
              overline="Beyond Hardware"
              title="Professional IT Services"
              subtitle="Comprehensive repair, maintenance, and setup services by certified engineers."
            />
          </div>
          <Link 
            href="/services" 
            className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors mb-12"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {storeConfig.services.map((service, i) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {Icon && <Icon className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-foreground">{service.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-primary font-semibold"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
