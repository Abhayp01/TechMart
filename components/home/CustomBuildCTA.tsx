"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Cpu, HardDrive, Monitor, Zap } from "lucide-react";

export function CustomBuildCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-900" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1920&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-white mb-6">
              <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              Tailored Performance
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Dream PC</span>
            </h2>
            
            <p className="text-lg text-slate-300 mb-8 max-w-xl">
              Whether you need a high-performance workstation for 3D rendering or the ultimate gaming rig, our experts will build it with premium components and cable management.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Expert consultation for optimal component matching",
                "Professional assembly with clean cable management",
                "Stress-tested for thermal and system stability",
                "Comprehensive 1-year build warranty"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <div className="mt-1 bg-primary/20 p-1 rounded-full border border-primary/30">
                    <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            
            <Link 
              href="/custom-build" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-glow-blue"
            >
              Start Your Build
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          
          {/* Floating UI Elements instead of a single image */}
          <motion.div 
            className="relative h-[500px] hidden lg:block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[400px] h-[400px]">
                {/* Center Core */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full border border-primary/50 flex items-center justify-center backdrop-blur-md shadow-glow-blue z-20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Cpu className="w-12 h-12 text-blue-400" />
                </motion.div>
                
                {/* Orbiting elements */}
                <motion.div className="absolute top-[10%] left-[20%] glass p-4 rounded-2xl border border-white/10 shadow-xl z-30" animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                  <img src="/brands/nvidia.png" alt="Nvidia" className="h-8 brightness-0 invert opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <p className="text-xs text-white/70 mt-2 font-mono">RTX 4090 READY</p>
                </motion.div>
                
                <motion.div className="absolute bottom-[20%] right-[10%] glass p-4 rounded-2xl border border-white/10 shadow-xl z-30 flex items-center gap-3" animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                  <HardDrive className="w-8 h-8 text-indigo-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Gen4 NVMe</p>
                    <p className="text-xs text-white/70">7300MB/s Read</p>
                  </div>
                </motion.div>
                
                <motion.div className="absolute top-[30%] right-[5%] glass p-3 rounded-full border border-white/10 shadow-xl z-10" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
                  <Monitor className="w-6 h-6 text-emerald-400" />
                </motion.div>
                
                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 400">
                  <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" className="text-blue-500" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" className="text-indigo-500" strokeWidth="1" strokeDasharray="2 6" />
                </svg>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
