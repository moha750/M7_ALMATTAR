"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Journey } from "@/lib/journeys";
import { WORK_TYPES, workTypeLabel } from "@/content/site";

const fmt = new Intl.NumberFormat("ar-SA");

export function WorkArchive({ works }: { works: Journey[] }) {
  const [type, setType] = useState<string>("all");
  const reduce = useReducedMotion();

  const types = useMemo(
    () =>
      WORK_TYPES.map((t) => ({
        ...t,
        count: works.filter((w) => (t.cats as readonly string[]).includes(w.category)).length,
      })).filter((t) => t.count > 0),
    [works],
  );

  const shown =
    type === "all"
      ? works
      : works.filter((w) =>
          (types.find((t) => t.key === type)?.cats as readonly string[] | undefined)?.includes(w.category),
        );

  return (
    <div>
      <div role="group" aria-label="فرز حسب النوع" className="flex flex-wrap gap-2.5">
        <Chip active={type === "all"} onClick={() => setType("all")}>
          الكل <span className="opacity-70">{fmt.format(works.length)}</span>
        </Chip>
        {types.map((t) => (
          <Chip key={t.key} active={type === t.key} onClick={() => setType(t.key)}>
            {t.label} <span className="opacity-70">{fmt.format(t.count)}</span>
          </Chip>
        ))}
      </div>

      <motion.ul layout={!reduce} className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((w) => (
            <motion.li
              key={w.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
            >
              <WorkCard w={w} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-[16px] transition-colors ${
        active
          ? "border border-gilt bg-gilt text-night"
          : "border border-dashed border-ivory/40 text-ivory hover:border-gilt/70"
      }`}
    >
      {children}
    </button>
  );
}

function WorkCard({ w }: { w: Journey }) {
  return (
    <Link href={w.href} className="group flex flex-col gap-4">
      <div className="panel-result relative aspect-[4/3] overflow-hidden rounded-2xl border border-gilt/25 transition-colors group-hover:border-gilt/60">
        {w.cover ? (
          <Image
            src={w.cover}
            alt={w.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center px-6 text-center font-display text-5xl leading-[1.3] text-ivory/[0.13] transition-colors group-hover:text-gilt/25 sm:text-6xl"
          >
            {w.title}
          </span>
        )}
        <span className="absolute right-4 top-3.5 text-sm font-medium text-gilt">
          {workTypeLabel(w.category)}
        </span>
        {w.featured && (
          <span className="absolute left-4 top-3 rounded-full border border-gilt/60 bg-night/80 px-3 py-1 text-xs text-gilt-light">
            رحلة كاملة
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-[34px] leading-[1.3] transition-colors group-hover:text-gilt-light">
          {w.title}
        </h2>
        {w.subtitle && <p className="text-[16px] text-ivory/70">{w.subtitle}</p>}
      </div>
    </Link>
  );
}
