"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Waypoint } from "@/components/site/waypoint";
import { VoicePlayer } from "@/components/site/voice-player";
import { HERO } from "@/content/site";
import { DISCIPLINES, skillHref } from "@/lib/disciplines";
import type { Discipline } from "@/lib/database.types";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({
  counts,
  learning,
  voiceSrc,
}: {
  counts: Record<Discipline, number>;
  /** المهارة التي يتعلمها الآن — تحل محل «+ القادم» حين تُحدَّد */
  learning: string | null;
  voiceSrc: string | null;
}) {
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
      <div className="shell pb-24 pt-8 sm:pt-12 lg:pb-12 lg:pt-[72px]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-12">
          {/* النص */}
          <div className="flex flex-col">
            <Waypoint label={HERO.waypoint} />

            <motion.h1 {...rise(0.15)} className="mt-6">
              <span className="block text-2xl font-medium text-ivory/80 sm:text-[30px]">{HERO.name}</span>
              <span className="mt-1 block font-display text-[72px] leading-[1.2] text-ivory sm:text-[112px] lg:text-[140px]">
                {HERO.lead} <span className="text-gilt">{HERO.highlight}</span>
              </span>
            </motion.h1>

            <motion.p
              initial={reduce ? undefined : { opacity: 0, clipPath: "inset(0 0 0 100%)" }}
              animate={reduce ? undefined : { opacity: 1, clipPath: "inset(0 0 0 0%)" }}
              transition={{ duration: 1.4, delay: 0.9, ease: "easeInOut" }}
              className="mt-3 max-w-[600px] font-hand text-2xl leading-[1.7] text-gilt-light sm:text-[30px]"
            >
              {HERO.note}
            </motion.p>

            <motion.div {...rise(0.45)} className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link
                href="/#contact"
                className="rounded-[10px] bg-gilt px-7 py-4 text-[17px] font-semibold text-night transition-transform hover:scale-[1.03]"
              >
                تواصل معي
              </Link>
              {voiceSrc ? (
                <VoicePlayer src={voiceSrc} compact />
              ) : (
                <Link
                  href="/#work"
                  className="rounded-[10px] border border-dashed border-ivory/40 px-6 py-4 text-[17px] text-ivory transition-colors hover:border-gilt hover:text-gilt-light"
                >
                  أعمالي ↓
                </Link>
              )}
            </motion.div>
          </div>

          {/* الصورة داخل الدائرة المرسومة */}
          <PhotoOrbit />
        </div>

        {/* مهاراتي — كل مهارة صفحة */}
        <motion.div {...rise(0.6)} id="skills" className="mt-20 scroll-mt-28 lg:mt-24">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[15px] font-semibold text-gilt">مهاراتي</h2>
            <span className="rounded-full border border-dashed border-ivory/40 px-4 py-1.5 text-[14px] text-ivory/65">
              {learning ? `أتعلّم الآن: ${learning}` : "+ القادم"}
            </span>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
            {DISCIPLINES.map((d, i) => (
              <li key={d.slug} className={i === DISCIPLINES.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <SkillTile
                  href={skillHref(d.slug)}
                  title={d.title}
                  Icon={d.icon}
                  count={counts[d.slug] ?? 0}
                />
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function worksLabel(n: number): string {
  const f = new Intl.NumberFormat("ar-SA").format(n);
  if (n === 0) return "قريبًا";
  if (n === 1) return "عمل واحد";
  if (n === 2) return "عملان";
  if (n <= 10) return `${f} أعمال`;
  return `${f} عملًا`;
}

function SkillTile({
  href,
  title,
  Icon,
  count,
}: {
  href: string;
  title: string;
  Icon: LucideIcon;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full items-center gap-4 rounded-2xl border border-gilt/25 bg-night/75 p-4 transition-colors hover:border-gilt hover:bg-midnight lg:min-h-[196px] lg:flex-col lg:items-stretch lg:justify-between lg:gap-6 lg:p-6"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gilt/50 text-gilt transition-colors group-hover:bg-gilt group-hover:text-night">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-display text-[26px] leading-[1.35] lg:text-[32px]">{title}</span>
        <span className="text-sm text-ivory/55">{worksLabel(count)}</span>
      </span>
      <ArrowLeft
        aria-hidden
        className="ms-auto h-5 w-5 shrink-0 text-gilt transition-all group-hover:-translate-x-1 lg:absolute lg:left-6 lg:top-6 lg:opacity-0 lg:group-hover:opacity-100"
      />
    </Link>
  );
}

function PhotoOrbit() {
  const reduce = useReducedMotion();
  return (
    <div className="relative order-first mx-auto w-full max-w-[300px] pt-10 sm:max-w-[420px] lg:order-none lg:mx-0 lg:max-w-[480px]">
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
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 460px"
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
