"use client";

import { motion, useReducedMotion } from "framer-motion";

/** الخيط الذهبي الذي «يرسم نفسه» خلف الصورة في الهيرو. */
export function HeroThread() {
  const reduce = useReducedMotion();
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 480"
      className="pointer-events-none absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)]"
      fill="none"
    >
      <motion.path
        d="M40 120 C 120 40, 320 60, 360 200 S 120 380, 200 460"
        stroke="var(--color-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={reduce ? { opacity: 0.55 } : { pathLength: 0, opacity: 0 }}
        animate={reduce ? { opacity: 0.55 } : { pathLength: 1, opacity: 0.55 }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
      />
    </svg>
  );
}
