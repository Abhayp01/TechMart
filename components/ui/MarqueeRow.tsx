"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface MarqueeRowProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}

export function MarqueeRow({ 
  children, 
  direction = "left", 
  speed = "normal",
  pauseOnHover = true 
}: MarqueeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContentWidth(containerRef.current.scrollWidth / 2);
    }
  }, [children]);

  const durationMap = {
    fast: 15,
    normal: 30,
    slow: 45
  };

  return (
    <div className="overflow-hidden whitespace-nowrap flex w-full relative">
      <motion.div
        ref={containerRef}
        className="flex min-w-full shrink-0 items-center gap-16 py-4"
        animate={{
          x: direction === "left" ? [0, -contentWidth] : [-contentWidth, 0],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: durationMap[speed],
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : {}}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
