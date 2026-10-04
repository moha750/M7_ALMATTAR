import { notFound } from "next/navigation";
import { Shell } from "@/components/site/shell";
import { PageHead } from "@/components/site/page-head";
import { BigLink } from "@/components/site/big-link";
import { SkillTabs, WorkGrid, countBySkill } from "@/components/site/work-grid";
import { getJourneys } from "@/lib/queries";
import { DISCIPLINES, isSkill, skillHref } from "@/lib/disciplines";
import { worksLabel } from "@/lib/format";
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
  const Icon = d.icon;
  const next = DISCIPLINES[(idx + 1) % DISCIPLINES.length];

  // ما كانت هذه مهارته الأساسية أولًا، ثم ما شاركت فيه
  const works = all.filter((w) => w.skills.includes(skill));
  const ordered = [...works.filter((w) => w.category === skill), ...works.filter((w) => w.category !== skill)];

  return (
    <Shell>
      <PageHead>
        <div style={{ "--c": d.color } as React.CSSProperties}>
          <span className="inline-flex items-center gap-3 text-[13px] font-semibold text-[var(--c)]">
            <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[color-mix(in_srgb,var(--c)_18%,transparent)]">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            {worksLabel(works.length)}
          </span>
          <h1 className="mt-4 font-display text-[clamp(60px,8vw,132px)] leading-[1.08]">{d.title}</h1>
          <p className="mt-2 text-[clamp(18px,1.6vw,24px)] text-bone/65">{SKILL_INTROS[skill]}</p>
        </div>
        <div className="mt-10">
          <SkillTabs active={skill} total={all.length} counts={countBySkill(all)} />
        </div>
      </PageHead>
      <section className="wrap pb-28 pt-12 lg:pb-36">
        <WorkGrid works={ordered} skill={skill} />
        <div className="mt-24">
          <p className="mb-3 text-[13px] font-semibold text-bone/55">المهارة التالية</p>
          <BigLink href={skillHref(next.slug)} label={next.title} />
        </div>
      </section>
    </Shell>
  );
}
