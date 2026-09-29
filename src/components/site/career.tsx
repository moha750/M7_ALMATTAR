import { Download } from "lucide-react";
import { Waypoint } from "@/components/site/waypoint";
import { Reveal } from "@/components/reveal";
import type { ExperienceItem } from "@/content/site";

export function Career({
  items,
  cvUrl,
}: {
  items: ExperienceItem[];
  cvUrl: string | null;
}) {
  return (
    <section id="career" className="relative z-10 scroll-mt-24">
      <div className="shell pt-28 lg:pt-[140px]">
        <Waypoint label="٤ · الأثر" />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-display text-5xl leading-[1.3] sm:text-[72px]">المسيرة</h2>
          {cvUrl ? (
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-[10px] border border-dashed border-gilt/60 px-5 py-3 text-[16px] text-gilt-light transition-colors hover:bg-gilt/10"
            >
              <Download className="h-[18px] w-[18px]" />
              حمّل السيرة الذاتية
            </a>
          ) : (
            <span className="inline-flex items-center gap-2.5 rounded-[10px] border border-dashed border-ivory/25 px-5 py-3 text-[15px] text-ivory/55">
              <Download className="h-[18px] w-[18px]" />
              السيرة الذاتية [قريبًا]
            </span>
          )}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          {items.map((e, i) => (
            <Reveal key={e.org} delay={i * 0.06}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-dashed border-gilt/45 bg-night/85 p-6 sm:p-7">
                <span className="text-[15px] text-gilt">{e.period}</span>
                <span className="font-display text-[30px] leading-[1.35] sm:text-[32px]">{e.org}</span>
                {e.role && <span className="text-[16px] font-semibold text-ivory/90">{e.role}</span>}
                <p className="text-[17px] leading-[1.8] text-ivory/80">{e.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
