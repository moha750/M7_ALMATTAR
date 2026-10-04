"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Waypoint } from "@/components/site/waypoint";
import { HERO } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section id="top" className="relative z-10">
      <div className="shell grid items-start gap-10 pb-24 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_540px] lg:gap-12 lg:pb-12 lg:pt-[86px]">
        {/* النص */}
        <div className="flex flex-col">
          <Waypoint label={HERO.waypoint} />

          <motion.h1
            {...rise(0.15)}
            className="mt-6 font-display text-[72px] leading-[1.2] text-ivory sm:text-[112px] lg:text-[150px]"
          >
            {HERO.lead} <span className="text-gilt">{HERO.highlight}</span>
          </motion.h1>

          <motion.p
            {...rise(0.35)}
            className="mt-5 max-w-[560px] text-lg leading-[1.9] text-ivory/85 sm:text-[22px]"
          >
            {HERO.intro}
          </motion.p>

          <motion.p
            initial={reduce ? undefined : { opacity: 0, clipPath: "inset(0 0 0 100%)" }}
            animate={reduce ? undefined : { opacity: 1, clipPath: "inset(0 0 0 0%)" }}
            transition={{ duration: 1.4, delay: 1.1, ease: "easeInOut" }}
            className="mt-8 max-w-[600px] font-hand text-2xl leading-[1.7] text-gilt-light sm:text-[30px]"
          >
            {HERO.note}
          </motion.p>

          <motion.div {...rise(0.55)} className="mt-10 flex flex-wrap gap-3.5">
            <Link
              href="/#contact"
              className="rounded-[10px] bg-gilt px-7 py-4 text-[17px] font-semibold text-night transition-transform hover:scale-[1.03]"
            >
              عندك فكرة؟ لنحلّق بها
            </Link>
            <Link
              href="/#work"
              className="rounded-[10px] border border-dashed border-ivory/40 px-6 py-4 text-[17px] text-ivory transition-colors hover:border-gilt hover:text-gilt-light"
            >
              تتبّع المسار ↓
            </Link>
          </motion.div>
        </div>

        {/* الصورة داخل الدائرة المرسومة */}
        <PhotoOrbit />
      </div>
    </section>
  );
}

function PhotoOrbit() {
  const reduce = useReducedMotion();
  return (
    <div className="relative order-first mx-auto w-full max-w-[300px] pt-10 sm:max-w-[420px] lg:order-none lg:mx-0 lg:max-w-[540px]">
      {/* خط الأبعاد */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0, scaleX: 0 }}
        animate={reduce ? undefined : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: EASE }}
        className="absolute inset-x-0 top-0 flex items-center gap-2.5"
        aria-hidden
      >
        <span className="h-3.5 w-px bg-gilt/70" />
        <span className="h-px flex-1 bg-gilt/50" />
        <span className="px-1.5 text-sm text-gilt">{HERO.range}</span>
        <span className="h-px flex-1 bg-gilt/50" />
        <span className="h-3.5 w-px bg-gilt/70" />
      </motion.div>

      <div className="relative aspect-square w-full">
        <svg viewBox="0 0 520 520" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <motion.path
            d="M260 16 C 400 10, 506 120, 504 262 C 502 404, 396 506, 256 504 C 116 502, 14 398, 18 258 C 22 128, 120 22, 268 20"
            stroke="#D8A850"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={reduce ? undefined : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={{ duration: 1.8, delay: 0.2, ease: "easeInOut" }}
          />
        </svg>
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          className="absolute inset-[6%] overflow-hidden rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 72%, #1C4470 0%, #0E2A47 70%)",
          }}
        >
          <Image
            src="/brand/profile.png"
            alt="محمد المطر"
            fill
            priority
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 510px"
            className="object-contain object-bottom"
            style={{ transform: "translateY(2%) scale(0.93)", transformOrigin: "bottom" }}
          />
        </motion.div>
      </div>

      {/* «هذا أنا» بخط اليد */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.9 }}
        className="pointer-events-none absolute -bottom-12 left-[4%] flex items-end gap-1 sm:-bottom-14"
        aria-hidden
      >
        <span className="font-hand text-2xl text-gilt-light sm:text-[30px]">{HERO.me}</span>
        <svg width="84" height="62" viewBox="0 0 110 80" fill="none" className="mb-6 -scale-x-100">
          <path d="M100 70 C 76 66, 40 50, 26 14" stroke="#F0D38F" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 26 L26 12 L37 24" stroke="#F0D38F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  );
}
