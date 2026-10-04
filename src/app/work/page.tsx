import Link from "next/link";
import { PageShell } from "@/components/site/page-shell";
import { Waypoint } from "@/components/site/waypoint";
import { SkillTabs, WorkGrid, countBySkill } from "@/components/site/work-archive";
import { getJourneys } from "@/lib/queries";

export const metadata = {
  title: "كل الأعمال",
  description:
    "أعمال محمد المطر في مهاراته الخمس: تصميم جرافيك، ومونتاج، وموشن جرافيك، وبرمجة، وتعليق صوتي.",
};

export default async function WorkIndexPage() {
  const works = await getJourneys();
  return (
    <PageShell>
      <section className="relative z-10">
        <div className="shell pb-28 pt-10 lg:pt-16">
          <Waypoint label="الأرشيف" />
          <h1 className="mt-6 font-display text-[64px] leading-[1.2] sm:text-[110px]">كل الأعمال</h1>
          <p className="mt-2 max-w-[640px] text-lg leading-[1.9] text-ivory/80 sm:text-xl">
            كل فكرة عشتها، مرتبة على مهاراتي الخمس. الأعمال المختارة تجدها كرحلات كاملة في{" "}
            <Link href="/#work" className="text-gilt-light underline underline-offset-4">
              الصفحة الرئيسية
            </Link>
            .
          </p>
          <div className="mt-12">
            <SkillTabs active="all" total={works.length} counts={countBySkill(works)} />
          </div>
          <div className="mt-10">
            <WorkGrid works={works} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
