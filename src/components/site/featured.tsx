import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Cover } from "@/components/site/cover";
import { Stack } from "@/components/site/stack";
import { BigLink } from "@/components/site/big-link";
import { WORKS } from "@/content/site";
import { DISCIPLINES } from "@/lib/disciplines";
import { worksLabel } from "@/lib/format";
import { isPending, type Journey } from "@/lib/journeys";

const ar = new Intl.NumberFormat("ar-SA");
const BY = new Map(DISCIPLINES.map((d) => [d.slug, d]));
const TOPS = ["top-24", "top-[120px]", "top-36"];

/** القسم ٢: أعمال مختارة + الطريق إلى كل الأعمال. */
export function Featured({ works, total }: { works: Journey[]; total: number }) {
  return (
    <section id="work" className="scroll-mt-20 pt-28 lg:pt-36">
      <div className="wrap">
        <Reveal className="mb-12 grid items-end gap-5 lg:mb-14 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="text-[13px] font-semibold text-sun">{WORKS.eyebrow}</span>
            <h2 className="mt-2 font-display text-[clamp(52px,7vw,116px)] leading-[1.12]">{WORKS.title}</h2>
          </div>
          <span className="text-[14px] text-bone/60">
            {ar.format(works.length)} من {worksLabel(total)}
          </span>
        </Reveal>

        <Stack>
          {works.map((w, i) => (
            <Card key={w.slug} w={w} n={i + 1} of={works.length} top={TOPS[i] ?? "top-36"} priority={i === 0} />
          ))}
        </Stack>

        <Reveal className="mt-5">
          <BigLink href="/work" label="كل أعمالي" meta={`${worksLabel(total)} في خمس مهارات`} />
        </Reveal>
      </div>
    </section>
  );
}

function Card({ w, n, of, top, priority }: { w: Journey; n: number; of: number; top: string; priority: boolean }) {
  const line = !isPending(w.summary) ? w.summary : null;
  return (
    <Link
      href={w.href}
      data-card
      className={`group sticky ${top} mb-10 block h-[min(78vh,760px)] origin-top overflow-hidden rounded-[32px] border border-bone/10 shadow-[0_-30px_60px_rgba(0,0,0,.35)]`}
    >
      <Cover w={w} priority={priority} sizes="(max-width: 1480px) 100vw, 1360px" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,9,16,.92)_0%,rgba(5,9,16,.55)_32%,transparent_62%)]" />
      <div className="absolute inset-x-0 bottom-0 grid items-end gap-5 p-7 lg:grid-cols-[1fr_auto] lg:p-12">
        <div>
          <span className="text-[14px] font-semibold text-sun">
            {ar.format(n)} / {ar.format(of)}
          </span>
          <h3 className="mt-1 font-display text-[clamp(48px,6.4vw,104px)] leading-[1.1]">{w.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {w.skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium backdrop-blur">
                <i className="h-2 w-2 rounded-full" style={{ background: BY.get(s)?.color }} />
                {BY.get(s)?.title}
              </span>
            ))}
          </div>
          {line && <p className="mt-3 max-w-[560px] text-[17px] text-bone/78 sm:text-[18px]">{line}</p>}
        </div>
        <span className="hidden h-[76px] w-[76px] place-items-center rounded-full bg-bone text-[28px] text-void transition-all duration-300 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-sun lg:grid">
          ←
        </span>
      </div>
    </Link>
  );
}
