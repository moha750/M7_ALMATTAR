import { notFound } from "next/navigation";
import { Shell } from "@/components/site/shell";
import { BigLink } from "@/components/site/big-link";
import { SkillTabs, WorkGrid, countBySkill } from "@/components/site/work-grid";
import { getJourneys } from "@/lib/queries";
import { DISCIPLINES, isSkill, skillHref } from "@/lib/disciplines";
import { indexLabel } from "@/lib/format";
import { SKILL_INTROS } from "@/content/site";

export function generateStaticParams() {
  return DISCIPLINES.map((d) => ({ skill: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  if (!isSkill(skill)) return {};
  const d = DISCIPLINES.find((x) => x.slug === skill)!;
  return { title: d.title, description: SKILL_INTROS[skill] };
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
  const ordered = [...works.filter((w) => w.category === skill), ...works.filter((w) => w.category !== skill)];

  return (
    <Shell>
      <section className="wrap pb-28 pt-8 lg:pb-40 lg:pt-14">
        <p className="t-meta text-ink/55">
          <span className="text-accent">{indexLabel(idx + 1)}</span> / {indexLabel(DISCIPLINES.length)} · مهارة
        </p>
        <h1 className="t-xl mt-3">{d.title}</h1>
        <p className="mt-3 max-w-[760px] text-[20px] leading-[1.7] text-ink/70 lg:text-[24px]">{SKILL_INTROS[skill]}</p>
        <div className="mt-10">
          <SkillTabs active={skill} total={all.length} counts={countBySkill(all)} />
        </div>
        <div className="mt-12 lg:mt-16">
          <WorkGrid works={ordered} skill={skill} />
        </div>
        <div className="mt-24 lg:mt-32">
          <p className="t-meta mb-3 text-ink/55">المهارة التالية</p>
          <BigLink href={skillHref(next.slug)} label={next.title} />
        </div>
      </section>
    </Shell>
  );
}
