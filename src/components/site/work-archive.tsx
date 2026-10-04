import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { Journey } from "@/lib/journeys";
import type { Discipline } from "@/lib/database.types";
import { DISCIPLINES, skillHref, skillTitle } from "@/lib/disciplines";

const fmt = new Intl.NumberFormat("ar-SA");

/** عدد الأعمال في كل مهارة. */
export function countBySkill(works: Journey[]): Record<Discipline, number> {
  const c = { graphic: 0, editing: 0, motion: 0, code: 0, voice: 0 } as Record<Discipline, number>;
  for (const w of works) for (const s of w.skills) c[s] += 1;
  return c;
}

/** صف التنقل بين «الكل» والمهارات الخمس — كل خانة صفحة مستقلة. */
export function SkillTabs({
  active,
  total,
  counts,
}: {
  active: Discipline | "all";
  total: number;
  counts: Record<Discipline, number>;
}) {
  return (
    <nav aria-label="المهارات" className="flex flex-wrap gap-2 sm:gap-2.5">
      <Tab href="/work" active={active === "all"}>
        الكل <span className="opacity-70">{fmt.format(total)}</span>
      </Tab>
      {DISCIPLINES.map((d) => (
        <Tab key={d.slug} href={skillHref(d.slug)} active={active === d.slug}>
          {d.title} <span className="opacity-70">{fmt.format(counts[d.slug] ?? 0)}</span>
        </Tab>
      ))}
    </nav>
  );
}

function Tab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2.5 text-[15px] transition-colors sm:gap-2 sm:px-5 sm:py-3 sm:text-[16px] ${
        active
          ? "border border-gilt bg-gilt text-night"
          : "border border-dashed border-ivory/40 text-ivory hover:border-gilt/70"
      }`}
    >
      {children}
    </Link>
  );
}

export function WorkGrid({ works, skill }: { works: Journey[]; skill?: Discipline }) {
  if (works.length === 0) {
    return (
      <div className="rounded-2xl border-[1.5px] border-dashed border-gilt/40 px-6 py-20 text-center">
        <p className="font-hand text-3xl text-gilt-light">الأعمال في الطريق.</p>
        <p className="mt-2 text-ivory/65">قريبًا تجدها هنا.</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((w, i) => (
        <li key={w.slug}>
          <Reveal delay={Math.min(i, 5) * 0.05}>
            <WorkCard w={w} skill={skill} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

function WorkCard({ w, skill }: { w: Journey; skill?: Discipline }) {
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
        {w.featured && (
          <span className="absolute left-4 top-3 rounded-full border border-gilt/60 bg-night/80 px-3 py-1 text-xs text-gilt-light">
            رحلة كاملة
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">
          {w.skills.map((s, i) => (
            <span key={s} className={skill && s !== skill ? "text-ivory/55" : "text-gilt"}>
              {i > 0 && <span className="text-ivory/35"> · </span>}
              {skillTitle(s)}
            </span>
          ))}
        </p>
        <h2 className="font-display text-[34px] leading-[1.3] transition-colors group-hover:text-gilt-light">
          {w.title}
        </h2>
        {w.subtitle && <p className="text-[16px] text-ivory/70">{w.subtitle}</p>}
      </div>
    </Link>
  );
}
