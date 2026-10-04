import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Cover } from "@/components/site/cover";
import { BigLink } from "@/components/site/big-link";
import { skillTitle } from "@/lib/disciplines";
import { indexLabel, worksLabel } from "@/lib/format";
import { isPending, type Journey } from "@/lib/journeys";

const ar = new Intl.NumberFormat("ar-SA");

/** القسم ٢: أبرز أعمالي + الطريق إلى كل الأعمال. */
export function Featured({ works, total }: { works: Journey[]; total: number }) {
  return (
    <section id="work" className="wrap scroll-mt-20 pt-28 lg:pt-44">
      <Reveal className="flex items-end justify-between gap-6 border-b border-ink pb-6">
        <h2 className="t-xl">أبرز أعمالي</h2>
        <span className="t-meta hidden pb-4 text-ink/55 sm:block">
          {ar.format(works.length)} من {ar.format(total)}
        </span>
      </Reveal>

      <div className="divide-y divide-ink/15">
        {works.map((w, i) => (
          <Reveal key={w.slug}>
            <Case w={w} n={i + 1} priority={i === 0} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6">
        <BigLink href="/work" label="كل الأعمال" meta={worksLabel(total)} />
      </Reveal>
    </section>
  );
}

function Case({ w, n, priority }: { w: Journey; n: number; priority: boolean }) {
  const line = !isPending(w.summary) ? w.summary : !isPending(w.idea) ? w.idea : null;
  return (
    <article className="py-12 lg:py-16">
      <Link href={w.href} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-2 sm:aspect-[16/9] lg:aspect-[2/1]">
          <Cover w={w} priority={priority} sizes="(max-width: 1520px) 100vw, 1410px" />
        </div>
        <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="flex items-baseline gap-4 lg:col-span-7 lg:gap-6">
            <span className="t-meta text-accent">{indexLabel(n)}</span>
            <h3 className="t-lg">{w.title}</h3>
          </div>
          <div className="flex items-end justify-between gap-6 lg:col-span-5">
            <div className="flex flex-col gap-1.5">
              <p className="t-meta text-ink/55">{w.skills.map(skillTitle).join(" · ")}</p>
              {line && <p className="text-[18px] leading-[1.7] text-ink/80">{line}</p>}
            </div>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
