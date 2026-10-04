import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { Waypoint } from "@/components/site/waypoint";
import { SkillTabs, WorkGrid, countBySkill } from "@/components/site/work-archive";
import { getJourneys } from "@/lib/queries";
import { DISCIPLINES, isSkill, skillHref } from "@/lib/disciplines";
import { SKILL_INTROS } from "@/content/site";

const fmt = new Intl.NumberFormat("ar-SA");

export function generateStaticParams() {
  return DISCIPLINES.map((d) => ({ skill: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  if (!isSkill(skill)) return {};
  const d = DISCIPLINES.find((x) => x.slug === skill)!;
  return { title: d.title, description: `${d.title} · ${SKILL_INTROS[skill]}` };
}

export default async function SkillPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  if (!isSkill(skill)) notFound();

  const all = await getJourneys();
  const idx = DISCIPLINES.findIndex((d) => d.slug === skill);
  const d = DISCIPLINES[idx];
  const next = DISCIPLINES[(idx + 1) % DISCIPLINES.length];

  // ما كانت هذه مهارته الأساسية أولًا، ثم ما شاركت فيه
  const works = all.filter((w) => w.skills.includes(skill));
  const ordered = [
    ...works.filter((w) => w.category === skill),
    ...works.filter((w) => w.category !== skill),
  ];

  return (
    <PageShell>
      <section className="relative z-10">
        <div className="shell pb-28 pt-10 lg:pt-16">
          <Waypoint label={`مهارة ${fmt.format(idx + 1)} من ${fmt.format(DISCIPLINES.length)}`} />
          <h1 className="mt-6 font-display text-[64px] leading-[1.2] sm:text-[110px]">{d.title}</h1>
          <p className="mt-1 max-w-[720px] font-hand text-2xl leading-[1.6] text-gilt-light sm:text-[34px]">
            {SKILL_INTROS[skill]}
          </p>
          <div className="mt-12">
            <SkillTabs active={skill} total={all.length} counts={countBySkill(all)} />
          </div>
          <div className="mt-10">
            <WorkGrid works={ordered} skill={skill} />
          </div>

          <Link
            href={skillHref(next.slug)}
            className="group mt-24 flex items-center justify-between gap-6 rounded-2xl border border-dashed border-gilt/45 bg-night/85 p-7 transition-colors hover:border-gilt sm:p-9"
          >
            <span className="flex flex-col gap-1">
              <span className="text-[15px] text-gilt">المهارة التالية</span>
              <span className="font-display text-4xl leading-[1.3] sm:text-5xl">{next.title}</span>
            </span>
            <ArrowLeft className="h-7 w-7 shrink-0 text-gilt transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
