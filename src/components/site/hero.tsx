import Image from "next/image";
import Link from "next/link";
import { Voice } from "@/components/site/voice";
import { HERO, TRUST } from "@/content/site";
import { DISCIPLINES, skillHref } from "@/lib/disciplines";
import { worksLabel } from "@/lib/format";
import type { Discipline } from "@/lib/database.types";

const ar = new Intl.NumberFormat("ar-SA");

/** القسم ١: أنا ومهاراتي. */
export function Hero({
  counts,
  total,
  voiceSrc,
}: {
  counts: Record<Discipline, number>;
  total: number;
  voiceSrc: string | null;
}) {
  const last = HERO.lines.length - 1;
  return (
    <section className="relative isolate overflow-hidden pt-[112px] lg:pt-[120px]">
      {/* الإضاءة */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(42% 55% at 22% 45%, rgba(227,176,75,.24), transparent 70%), radial-gradient(35% 40% at 90% 8%, rgba(59,163,240,.10), transparent 70%), radial-gradient(60% 50% at 50% 105%, rgba(139,123,255,.10), transparent 70%)",
        }}
      />

      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[1.45fr_.85fr] lg:gap-6">
          {/* النص */}
          <div>
            <span className="fade-up glass inline-flex items-center gap-3 rounded-full px-4 py-2 text-[14px] font-medium text-bone/65">
              <span className="pulse-dot h-2 w-2 rounded-full bg-s-code" />
              {HERO.status}
            </span>

            <h1 className="mt-7 font-display text-[clamp(84px,9.2vw,156px)] leading-[1.08]">
              <span className="sr-only">{HERO.name}: </span>
              {HERO.lines.map((l, i) => (
                <span key={l} className="line-mask">
                  <span style={{ animationDelay: `${i * 0.12}s` }} className={i === last ? "relative text-sun" : ""}>
                    {l}
                    {i === last && (
                      <svg
                        aria-hidden
                        viewBox="0 0 300 30"
                        preserveAspectRatio="none"
                        className="absolute -bottom-[.06em] -right-[2%] h-[.3em] w-[104%] overflow-visible"
                      >
                        <path d="M4 22 C 80 6, 200 4, 296 16" className="draw-line" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>
                </span>
              ))}
            </h1>

            <p className="fade-up mt-7 max-w-[580px] text-[clamp(18px,1.5vw,22px)] leading-[1.85] text-bone/62" style={{ animationDelay: ".55s" }}>
              <b className="font-semibold text-bone">{HERO.name}</b>، {HERO.lead}
            </p>

            <div className="fade-up mt-9 flex flex-wrap items-center gap-3.5" style={{ animationDelay: ".7s" }}>
              <Link
                href="/#work"
                className="inline-flex h-[60px] items-center rounded-full bg-sun px-8 text-[17px] font-semibold text-[#120c02] transition-all hover:-translate-y-0.5 hover:bg-sun-2"
              >
                شاهد أعمالي ↓
              </Link>
              {voiceSrc ? (
                <Voice src={voiceSrc} />
              ) : (
                <Link
                  href="/#contact"
                  className="inline-flex h-[60px] items-center rounded-full border border-bone/30 px-8 text-[17px] font-semibold transition-all hover:-translate-y-0.5 hover:border-bone"
                >
                  لنعمل معًا
                </Link>
              )}
            </div>
          </div>

          {/* الصورة */}
          <div className="fade-up relative mx-auto aspect-[4/5] w-full max-w-[520px]" style={{ animationDelay: ".55s" }}>
            <div
              aria-hidden
              className="absolute inset-x-[6%] bottom-0 top-[16%] overflow-hidden rounded-[260px_260px_32px_32px]"
              style={{ background: "linear-gradient(180deg,#f0c86a 0%,#c98f2c 55%,#6b4613 100%)" }}
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.07)_0_1px,transparent_1px_22px)]" />
            </div>
            <Image
              src="/brand/profile.png"
              alt={HERO.name}
              width={1023}
              height={1041}
              priority
              sizes="(max-width: 1100px) 90vw, 500px"
              className="absolute bottom-0 left-1/2 w-[96%] -translate-x-1/2 drop-shadow-[0_30px_40px_rgba(0,0,0,.45)]"
            />
            {/* شارة تدور */}
            <div className="absolute -left-[4%] top-[8%] grid h-[120px] w-[120px] place-items-center rounded-full border border-bone/10 bg-void sm:h-[150px] sm:w-[150px]">
              <svg viewBox="0 0 150 150" className="spin-slow absolute inset-0 h-full w-full" style={{ direction: "ltr" }} aria-hidden>
                <defs>
                  <path id="badge-ring" d="M75,75 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0" />
                </defs>
                <text className="fill-bone font-sans text-[12.5px] font-semibold">
                  <textPath href="#badge-ring">{HERO.badge}</textPath>
                </text>
              </svg>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-sun text-[20px] text-[#120c02]">✦</span>
            </div>
            {/* بطاقة الاسم */}
            <div className="absolute -right-[2%] bottom-[7%] rounded-[18px] border border-bone/10 bg-void/80 px-[18px] py-3.5 backdrop-blur-md">
              <b className="block font-display text-[22px] font-normal leading-[1.4]">{HERO.name}</b>
              <span className="text-[13px] text-bone/60">
                {worksLabel(total)} · {ar.format(DISCIPLINES.length)} مهارات
              </span>
            </div>
          </div>
        </div>

        {/* المهارات */}
        <div id="skills" className="scroll-mt-24 pb-9 pt-16">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-[13px] font-semibold text-sun">مهاراتي</h2>
            <span className="text-[14px] text-bone/60">اضغط على مهارة لترى أعمالها</span>
          </div>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {DISCIPLINES.map((d, i) => {
              const Icon = d.icon;
              return (
                <li key={d.slug} className={i === DISCIPLINES.length - 1 ? "col-span-2 lg:col-span-1" : ""}>
                  <Link
                    href={skillHref(d.slug)}
                    style={{ "--c": d.color } as React.CSSProperties}
                    className="glass group relative flex h-full min-h-[170px] flex-col justify-between gap-7 overflow-hidden rounded-[22px] p-5 transition-all duration-300 ease-out before:absolute before:inset-0 before:translate-y-full before:bg-[var(--c)] before:transition-transform before:duration-500 before:ease-out hover:-translate-y-1.5 hover:border-transparent hover:before:translate-y-0"
                  >
                    <span className="relative grid h-12 w-12 place-items-center rounded-[14px] bg-[color-mix(in_srgb,var(--c)_18%,transparent)] text-[var(--c)] transition-colors group-hover:bg-deep">
                      <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                    </span>
                    <span aria-hidden className="absolute left-5 top-6 text-[20px] text-bone/60 transition-all group-hover:-translate-x-1 group-hover:text-deep">
                      ←
                    </span>
                    <span className="relative">
                      <span className="block font-display text-[clamp(22px,2vw,30px)] leading-[1.35] transition-colors group-hover:text-deep">
                        {d.title}
                      </span>
                      <span className="text-[13px] text-bone/60 transition-colors group-hover:text-deep">
                        {worksLabel(counts[d.slug] ?? 0)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* جهات */}
      <div className="flex items-stretch overflow-hidden border-y border-bone/10">
        <span className="relative z-10 flex shrink-0 items-center bg-gradient-to-l from-void from-70% to-transparent py-5 pe-7 ps-5 text-[13px] font-semibold text-bone/60 lg:ps-16">
          أعمالي مع
        </span>
        <div className="marquee flex shrink-0 items-center gap-14 whitespace-nowrap py-5 font-display text-[clamp(22px,2.2vw,32px)] text-bone/45">
          {[...TRUST, ...TRUST].map((t, i) => (
            <span key={i} className="flex items-center gap-14">
              {t}
              <span className="text-[.6em] text-sun">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
