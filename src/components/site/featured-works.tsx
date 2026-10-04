import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Waypoint } from "@/components/site/waypoint";
import { Reveal } from "@/components/reveal";
import { ChaptersArt, DoorArt, TrackArt } from "@/components/site/art";
import { skillTitle } from "@/lib/disciplines";
import type { Journey } from "@/lib/journeys";

// رسم بديل لكل عمل مختار حتى تُرفع صورته
const ART: Record<string, "track"> = { "ركضة-وطن": "track" };

/** القسم ٢: أبرز أعمالي — بطاقات بصرية وزر لكل الأعمال. */
export function FeaturedWorks({ works, total }: { works: Journey[]; total: number }) {
  const n = new Intl.NumberFormat("ar-SA").format(total);
  return (
    <section id="work" className="relative z-10 scroll-mt-24">
      <div className="shell pt-16 lg:pt-[96px]">
        <Waypoint label="٢ · أعمالي" />
        <Reveal>
          <h2 className="mt-6 font-display text-5xl leading-[1.3] sm:text-[72px]">أبرز أعمالي</h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:grid-rows-[330px_330px]">
          {works.map((w, i) => (
            <Reveal key={w.slug} delay={i * 0.08} className={i === 0 ? "lg:row-span-2" : ""}>
              <WorkTile w={w} big={i === 0} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
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

function WorkTile({ w, big }: { w: Journey; big: boolean }) {
  return (
    <Link
      href={w.href}
      className={`panel-result group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-gilt/25 transition-colors hover:border-gilt/70 ${
        big ? "min-h-[440px]" : "min-h-[320px]"
      }`}
    >
      <Visual w={w} big={big} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-night via-night/75 to-transparent" />
      <div className="relative mt-auto flex items-end justify-between gap-4 p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gilt">{w.skills.map(skillTitle).join(" · ")}</p>
          <h3 className={`font-display leading-[1.25] ${big ? "text-5xl sm:text-[68px]" : "text-4xl sm:text-[48px]"}`}>
            {w.title}
          </h3>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-gilt bg-night/80 text-gilt transition-all group-hover:bg-gilt group-hover:text-night">
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function Visual({ w, big }: { w: Journey; big: boolean }) {
  if (w.cover) {
    return (
      <Image
        src={w.cover}
        alt={w.title}
        fill
        sizes={big ? "(max-width: 1024px) 100vw, 760px" : "(max-width: 1024px) 100vw, 540px"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
    );
  }
  const box = "absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.04]";
  if (w.art === "door") {
    return (
      <div className={`${box} pb-20`}>
        <DoorArt className={big ? "h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]" : "h-48 w-48"} />
      </div>
    );
  }
  if (w.art === "chapters") {
    return (
      <div className={`${box} items-start px-8 pt-8 sm:px-10`}>
        <div className="w-full">
          <ChaptersArt limit={big ? undefined : 2} />
        </div>
      </div>
    );
  }
  if (ART[w.slug] === "track") {
    return (
      <div className={`${box} items-start`}>
        <TrackArt className="h-full w-full" />
      </div>
    );
  }
  return (
    <span
      aria-hidden
      className={`${box} px-6 pb-16 text-center font-display text-6xl leading-[1.3] text-ivory/[0.1]`}
    >
      {w.title}
    </span>
  );
}
