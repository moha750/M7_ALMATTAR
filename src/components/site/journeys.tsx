import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Waypoint } from "@/components/site/waypoint";
import { Reveal } from "@/components/reveal";
import { SketchPanel, ResultPanel } from "@/components/site/journey-panels";
import type { Journey } from "@/lib/journeys";

export function Journeys({ journeys, total }: { journeys: Journey[]; total: number }) {
  const [featured, ...rest] = journeys;
  const n = new Intl.NumberFormat("ar-SA").format(total);
  return (
    <section id="work" className="relative z-10 scroll-mt-24">
      <div className="shell pt-16 lg:pt-[96px]">
        <Waypoint label="٢ · أعمالي" />
        <Reveal>
          <h2 className="mt-6 font-display text-5xl leading-[1.3] sm:text-[72px]">أبرز أعمالي</h2>
          <p className="mt-2 text-lg text-ivory/80 sm:text-xl">من المسودة الأولى حتى ما رآه الناس.</p>
        </Reveal>

        {featured && <FeaturedJourney j={featured} />}

        {rest.length > 0 && (
          <div className="mt-24 grid gap-14 md:grid-cols-2 md:gap-10">
            {rest.map((j, i) => (
              <Reveal key={j.slug} delay={i * 0.08}>
                <JourneyCard j={j} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 rounded-[10px] bg-gilt px-8 py-4 text-[17px] font-semibold text-night transition-transform hover:scale-[1.03]"
          >
            تصفّح كل أعمالي
            <span className="rounded-full bg-night/15 px-2.5 py-0.5 text-[15px]">{n}</span>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Bridge({ text, vertical = false }: { text: string | null; vertical?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center gap-1.5 ${
        vertical ? "flex-row py-2" : "flex-col px-2"
      }`}
      aria-hidden
    >
      <svg
        width="120"
        height="60"
        viewBox="0 0 120 60"
        fill="none"
        className={vertical ? "h-12 w-16 -rotate-90" : ""}
      >
        <path d="M112 40 C 84 6, 40 6, 12 34" stroke="#D8A850" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 7" />
        <path d="M10 20 L11 36 L27 36" stroke="#D8A850" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text && <span className="font-hand text-xl text-gilt-light sm:text-[22px]">{text}</span>}
    </div>
  );
}

export function Notes({ j }: { j: Journey }) {
  const items = [
    { k: "التحدي", v: j.challenge },
    { k: "الفكرة", v: j.idea },
    { k: "التنفيذ", v: j.execution },
  ].filter((x) => x.v && !x.v.trim().startsWith("[")); // ما بين [أقواس] لا يظهر للزوار
  if (items.length === 0) return null;
  return (
    <div className="grid gap-8 md:grid-cols-3 md:gap-10">
      {items.map((x) => (
        <div key={x.k} className="flex flex-col gap-3 border-t border-dashed border-gilt/50 pt-4">
          <span className="text-[15px] font-semibold text-gilt">{x.k}</span>
          <p className="text-[18px] leading-[1.85] text-ivory/85 sm:text-[19px]">{x.v}</p>
        </div>
      ))}
    </div>
  );
}

function FeaturedJourney({ j }: { j: Journey }) {
  return (
    <article className="mt-16 lg:mt-20">
      <Reveal>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
          <h3 className="font-display text-[56px] leading-[1.25] sm:text-[88px]">
            <Link href={j.href} className="hover:text-gilt-light">
              {j.title}
            </Link>
          </h3>
          {j.subtitle && <p className="text-lg text-ivory/75 sm:text-[22px]">{j.subtitle}</p>}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 grid items-stretch lg:grid-cols-[minmax(0,1fr)_140px_minmax(0,1.35fr)]">
          <div className="lg:min-h-[460px]">
            <SketchPanel j={j} />
          </div>
          <div className="hidden lg:flex">
            <Bridge text={j.bridge} />
          </div>
          <div className="lg:hidden">
            <Bridge text={j.bridge} vertical />
          </div>
          <div className="min-h-[320px] lg:min-h-[460px]">
            <ResultPanel j={j} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12">
          <Notes j={j} />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          {j.roles.length > 0 && (
            <p className="text-[15px] text-ivory/70">{j.roles.join(" · ")}</p>
          )}
          <Link
            href={j.href}
            className="inline-flex items-center gap-2 rounded-[10px] border border-dashed border-gilt/60 px-5 py-3 text-[16px] text-gilt-light transition-colors hover:bg-gilt/10"
          >
            الرحلة كاملة
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </article>
  );
}

function JourneyCard({ j }: { j: Journey }) {
  return (
    <article className="group flex flex-col gap-4">
      <Link href={j.href} aria-label={j.title} className="relative grid h-[340px] grid-cols-2 gap-3 sm:h-[360px] sm:gap-4">
        <SketchPanel j={j} compact />
        <ResultPanel j={j} compact />
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] border-gilt bg-night text-gilt transition-transform group-hover:scale-110">
          <ArrowLeft className="h-4 w-4" />
        </span>
      </Link>
      <h3 className="mt-2 font-display text-5xl leading-[1.3] sm:text-[60px]">
        <Link href={j.href} className="hover:text-gilt-light">
          {j.title}
        </Link>
      </h3>
      {(j.idea || j.summary) && (
        <p className={`text-[18px] leading-[1.85] ${j.placeholder ? "text-ivory/60" : "text-ivory/85"}`}>
          {j.summary ?? j.idea}
        </p>
      )}
      {j.roles.length > 0 && <p className="text-[15px] text-ivory/70">{j.roles.join(" · ")}</p>}
    </article>
  );
}
