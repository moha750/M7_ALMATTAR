"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { publicUrl } from "@/lib/storage";
import type { Project } from "@/lib/database.types";

type Craft = { slug: string; title: string };

export function WorkGallery({
  projects,
  crafts,
}: {
  projects: Project[];
  crafts: Craft[];
}) {
  const [active, setActive] = useState<string>("all");
  const reduce = useReducedMotion();

  const present = new Set(projects.map((p) => p.category));
  const filters = [
    { slug: "all", title: "الكل" },
    ...crafts.filter((c) => present.has(c.slug as Project["category"])),
  ];
  const shown =
    active === "all" ? projects : projects.filter((p) => p.category === active);
  const label = (slug: string) =>
    crafts.find((c) => c.slug === slug)?.title ?? slug;

  return (
    <div>
      {/* فلاتر التخصصات */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = active === f.slug;
          return (
            <button
              key={f.slug}
              onClick={() => setActive(f.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-espresso text-cream"
                  : "border border-espresso/15 text-espresso/70 hover:bg-espresso/5"
              }`}
            >
              {f.title}
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => {
            const cover = publicUrl(p.cover_path);
            return (
              <motion.li
                key={p.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/work/${p.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-espresso/10 bg-parchment transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={p.title_ar}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-espresso/30">
                        بلا غلاف
                      </div>
                    )}
                    {p.is_featured && (
                      <span className="absolute end-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-espresso">
                        مميّز
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="font-[family-name:var(--font-tech)] text-xs font-medium tracking-wide text-gold-deep">
                      {label(p.category)}
                    </span>
                    <h3 className="mt-1.5 font-[family-name:var(--font-heading)] text-lg font-bold">
                      {p.title_ar}
                    </h3>
                    {p.summary_ar && (
                      <p className="mt-1 line-clamp-2 text-sm text-espresso/65">
                        {p.summary_ar}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
