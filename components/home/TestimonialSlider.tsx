"use client";

import { storeConfig } from "@/lib/store-config";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function TestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-success/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <SectionHeader 
          overline="Client Stories"
          title="Trusted by Delhi's Best"
          subtitle="See what our enterprise and individual clients have to say about our service."
          align="center"
        />

        <div className="flex overflow-x-auto pb-12 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 gap-6 snap-x snap-mandatory hide-scrollbar">
          {storeConfig.testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[300px] w-[85vw] sm:w-[350px] lg:w-auto shrink-0 snap-center glass-card rounded-2xl p-8 relative hover:-translate-y-2 transition-transform duration-300"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} 
                  />
                ))}
              </div>
              
              <p className="text-foreground leading-relaxed mb-8 italic relative z-10">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} {testimonial.company && <span className="font-semibold text-primary">@ {testimonial.company}</span>}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
