import { Shell } from "@/components/site/shell";
import { PageHead } from "@/components/site/page-head";
import { SkillTabs, WorkGrid, countBySkill } from "@/components/site/work-grid";
import { getJourneys } from "@/lib/queries";
import { worksLabel } from "@/lib/format";

export const metadata = {
  title: "كل الأعمال",
  description: "أعمال محمد المطر: تصميم جرافيك، ومونتاج، وموشن جرافيك، وبرمجة، وتعليق صوتي.",
};

export default async function WorkIndexPage() {
  const works = await getJourneys();
  return (
    <Shell>
      <PageHead>
        <span className="text-[13px] font-semibold text-sun">{worksLabel(works.length)}</span>
        <h1 className="mt-2 font-display text-[clamp(60px,8vw,132px)] leading-[1.08]">كل أعمالي.</h1>
        <div className="mt-10">
          <SkillTabs active="all" total={works.length} counts={countBySkill(works)} />
        </div>
      </PageHead>
      <section className="wrap pb-28 pt-12 lg:pb-36">
        <WorkGrid works={works} />
      </section>
    </Shell>
  );
}
