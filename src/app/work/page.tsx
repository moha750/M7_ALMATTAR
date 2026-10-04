import { Shell } from "@/components/site/shell";
import { SkillTabs, WorkGrid, countBySkill } from "@/components/site/work-grid";
import { getJourneys } from "@/lib/queries";
import { worksLabel } from "@/lib/format";

export const metadata = {
  title: "كل الأعمال",
  description: "أعمال محمد المطر في مهاراته الخمس: تصميم جرافيك، ومونتاج، وموشن جرافيك، وبرمجة، وتعليق صوتي.",
};

export default async function WorkIndexPage() {
  const works = await getJourneys();
  return (
    <Shell>
      <section className="wrap pb-28 pt-8 lg:pb-40 lg:pt-14">
        <div className="flex items-end justify-between gap-6">
          <h1 className="t-xl">كل الأعمال</h1>
          <span className="t-meta pb-3 text-ink/55 lg:pb-5">{worksLabel(works.length)}</span>
        </div>
        <div className="mt-6">
          <SkillTabs active="all" total={works.length} counts={countBySkill(works)} />
        </div>
        <div className="mt-12 lg:mt-16">
          <WorkGrid works={works} />
        </div>
      </section>
    </Shell>
  );
}
