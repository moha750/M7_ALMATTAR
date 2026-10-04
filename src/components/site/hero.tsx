"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Voice } from "@/components/site/voice";
import { HERO } from "@/content/site";
import { DISCIPLINES, skillHref } from "@/lib/disciplines";
import { indexLabel, worksLabel } from "@/lib/format";
import type { Discipline } from "@/lib/database.types";

const EASE = [0.22, 1, 0.36, 1] as const;

/** القسم ١: أنا ومهاراتي. */
export function Hero({
  counts,
  voiceSrc,
}: {
  counts: Record<Discipline, number>;
  voiceSrc: string | null;
}) {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  return (
    <section className="wrap pt-6 lg:pt-10">
      <motion.div
        {...rise(0)}
        className="t-meta flex items-center justify-between border-b border-ink/15 pb-4"
      >
        <span>{HERO.name}</span>
        <span className="text-ink/55">{HERO.place}</span>
      </motion.div>

      <h1 className="t-mega pt-6 lg:pt-10">
        <span className="sr-only">{HERO.name}: </span>
        <motion.span {...rise(0.08)} className="inline-block">
          {HERO.headline}
          <span className="text-accent">.</span>
        </motion.span>
      </h1>

      <div className="mt-8 grid gap-12 border-t border-ink pt-8 lg:mt-10 lg:grid-cols-12 lg:gap-8 lg:pt-10">
        {/* السطر والدعوة */}
        <motion.div {...rise(0.25)} className="flex flex-col lg:col-span-4">
          <p className="max-w-[460px] text-[22px] leading-[1.65] lg:text-[26px]">{HERO.line}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 lg:mt-auto lg:pt-10">
            <Link
              href="/#contact"
              className="group inline-flex h-14 items-center gap-3 bg-ink px-7 text-[16px] font-semibold text-paper transition-colors hover:bg-ink-2"
            >
              تواصل معي
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            {voiceSrc ? (
              <Voice src={voiceSrc} />
            ) : (
              <Link href="/#work" className="py-2 text-[16px] font-medium underline decoration-ink/30 underline-offset-8 transition-colors hover:decoration-ink">
                شاهد أعمالي
              </Link>
            )}
          </div>
        </motion.div>

        {/* الصورة */}
        <motion.div {...rise(0.35)} className="lg:col-span-3">
          <div className="relative mx-auto aspect-[4/5] max-w-[380px] overflow-hidden bg-paper-2 lg:max-w-none">
            <Image
              src="/brand/profile.png"
              alt={HERO.name}
              fill
              priority
              sizes="(max-width: 1024px) 380px, 360px"
              className="object-cover object-[50%_100%]"
            />
          </div>
        </motion.div>

        {/* المهارات */}
        <motion.div {...rise(0.45)} className="lg:col-span-5">
          <p className="t-meta pb-3 text-ink/55">مهاراتي</p>
          <ul className="border-t border-ink">
            {DISCIPLINES.map((d, i) => (
              <li key={d.slug} className="border-b border-ink/15">
                <Link
                  href={skillHref(d.slug)}
                  className="group flex items-center gap-4 py-4 transition-all duration-300 hover:bg-ink hover:px-5 hover:text-paper lg:py-[18px]"
                >
                  <span className="t-meta w-7 text-accent">{indexLabel(i + 1)}</span>
                  <span className="flex-1 font-display text-[30px] leading-[1.25] lg:text-[36px]">{d.title}</span>
                  <span className="t-meta text-ink/50 group-hover:text-paper/60">{worksLabel(counts[d.slug] ?? 0)}</span>
                  <ArrowLeft className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
