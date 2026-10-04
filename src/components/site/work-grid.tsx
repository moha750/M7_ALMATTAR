import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Cover } from "@/components/site/cover";
import type { Journey } from "@/lib/journeys";
import type { Discipline } from "@/lib/database.types";
import { DISCIPLINES, skillHref, skillTitle } from "@/lib/disciplines";

const ar = new Intl.NumberFormat("ar-SA");

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
    { href: "/work", label: "الكل", n: total, on: active === "all" },
    ...DISCIPLINES.map((d) => ({ href: skillHref(d.slug), label: d.title, n: counts[d.slug] ?? 0, on: active === d.slug })),
  ];
  return (
    <nav aria-label="المهارات" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 [scrollbar-width:none]">
      <ul className="flex min-w-max gap-7 border-b border-ink/15 sm:gap-10">
        {tabs.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={`relative flex items-start gap-1.5 py-4 text-[16px] transition-colors ${
                t.on ? "font-semibold text-ink" : "text-ink/55 hover:text-ink"
              }`}
            >
              {t.label}
              <sup className="mt-1 text-[11px] font-medium">{ar.format(t.n)}</sup>
              {t.on && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-ink" />}
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
      <div className="border-y border-ink/15 py-24 text-center">
        <p className="font-display text-[44px]">قريبًا.</p>
        <p className="mt-2 text-ink/60">الأعمال في الطريق.</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
      {works.map((w, i) => (
        <li key={w.slug}>
          <Reveal delay={Math.min(i % 3, 2) * 0.06}>
            <Link href={w.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
                <Cover w={w} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 470px" />
              </div>
              <p className="t-meta mt-4">
                {w.skills.map((s, j) => (
                  <span key={s} className={skill && s !== skill ? "text-ink/45" : "text-ink/75"}>
                    {j > 0 && " · "}
                    {skillTitle(s)}
                  </span>
                ))}
              </p>
              <h2 className="mt-1 font-display text-[34px] leading-[1.25] lg:text-[38px]">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-[position:100%_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                  {w.title}
                </span>
              </h2>
              {w.subtitle && <p className="mt-1 text-[16px] text-ink/60">{w.subtitle}</p>}
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
