"use client";

import { storeConfig } from "@/lib/store-config";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import Link from "next/link";

export function NewsletterCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 gradient-mesh opacity-50 mix-blend-overlay" />
      
      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Stay Updated with B.K. Infotech
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive enterprise deals, new product announcements, and IT infrastructure tips.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-12">
            <div className="relative w-full">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full pl-6 pr-32 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                Subscribe <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6">
            <span className="text-white/60 text-sm">Need immediate assistance?</span>
            <Link 
              href={storeConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-colors text-sm shadow-lg shadow-green-500/20"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
