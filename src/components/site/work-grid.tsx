import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Cover } from "@/components/site/cover";
import type { Journey } from "@/lib/journeys";
import type { Discipline } from "@/lib/database.types";
import { DISCIPLINES, skillHref } from "@/lib/disciplines";

const ar = new Intl.NumberFormat("ar-SA");
const BY = new Map(DISCIPLINES.map((d) => [d.slug, d]));

/** عدد الأعمال في كل مهارة. */
export function countBySkill(works: Journey[]): Record<Discipline, number> {
  const c = { graphic: 0, editing: 0, motion: 0, code: 0, voice: 0 } as Record<Discipline, number>;
  for (const w of works) for (const s of w.skills) c[s] += 1;
  return c;
}

/** تبويبات: الكل + المهارات الخمس — كل تبويب صفحة. */
export function SkillTabs({
  active,
  total,
  counts,
}: {
  active: Discipline | "all";
  total: number;
  counts: Record<Discipline, number>;
}) {
  const tabs = [
    { href: "/work", label: "الكل", n: total, on: active === "all", color: "var(--color-bone)" },
    ...DISCIPLINES.map((d) => ({ href: skillHref(d.slug), label: d.title, n: counts[d.slug] ?? 0, on: active === d.slug, color: d.color })),
  ];
  return (
    <nav aria-label="المهارات" className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
      <ul className="flex min-w-max gap-2.5">
        {tabs.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              style={{ "--c": t.color } as React.CSSProperties}
              className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-colors ${
                t.on ? "bg-[var(--c)] text-deep" : "glass text-bone/75 hover:text-bone"
              }`}
            >
              {!t.on && <i className="h-2 w-2 rounded-full bg-[var(--c)]" />}
              {t.label}
              <span className="opacity-60">{ar.format(t.n)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function WorkGrid({ works, skill }: { works: Journey[]; skill?: Discipline }) {
  if (works.length === 0) {
    return (
      <div className="glass rounded-[28px] px-6 py-24 text-center">
        <p className="font-display text-[44px]">قريبًا.</p>
        <p className="mt-2 text-bone/60">الأعمال في الطريق.</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
      {works.map((w, i) => (
        <li key={w.slug}>
          <Reveal delay={Math.min(i % 3, 2) * 0.06}>
            <Link href={w.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-bone/10">
                <Cover w={w} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 460px" />
                <span className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-full bg-bone text-[18px] text-void opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1">
                  ←
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-medium">
                {w.skills.map((s) => (
                  <span key={s} className={`inline-flex items-center gap-1.5 ${skill && s !== skill ? "text-bone/45" : "text-bone/80"}`}>
                    <i className="h-1.5 w-1.5 rounded-full" style={{ background: BY.get(s)?.color }} />
                    {BY.get(s)?.title}
                  </span>
                ))}
              </div>
              <h2 className="mt-1.5 font-display text-[34px] leading-[1.25] transition-colors group-hover:text-sun lg:text-[38px]">
                {w.title}
              </h2>
              {w.subtitle && <p className="mt-0.5 text-[15px] text-bone/55">{w.subtitle}</p>}
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
