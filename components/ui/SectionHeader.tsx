"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  overline?: string;
  align?: "left" | "center";
}

export function SectionHeader({ title, subtitle, overline, align = "left" }: SectionHeaderProps) {
  return (
    <div className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
      {overline && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-primary font-semibold tracking-wider uppercase text-sm mb-3"
        >
          {overline}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
