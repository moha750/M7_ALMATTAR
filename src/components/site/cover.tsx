import Image from "next/image";
import type { Journey } from "@/lib/journeys";
import type { Discipline } from "@/lib/database.types";

/**
 * غلاف العمل: الصورة المرفوعة، وإن لم توجد فملصق
 * (مخصص للأعمال المختارة، وبلون المهارة الأساسية لبقية الأعمال).
 * يملأ أباه — الأب يحدد المقاس و relative و overflow-hidden.
 */
export function Cover({ w, sizes, priority = false }: { w: Journey; sizes: string; priority?: boolean }) {
  if (w.cover) {
    return (
      <Image
        src={w.cover}
        alt={w.title}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    );
  }
  const Poster = POSTERS[w.slug];
  return (
    <div className="@container absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
      {Poster ? <Poster /> : <TitlePoster title={w.title} skill={w.category} />}
    </div>
  );
}

const SKILL_GRAD: Record<Discipline, string> = {
  graphic: "linear-gradient(135deg,#f0c463,#c78a28)",
  editing: "linear-gradient(135deg,#ef7a5f,#a8321f)",
  motion: "linear-gradient(135deg,#a99dff,#5a48d6)",
  code: "linear-gradient(135deg,#3fd08a,#0f6a45)",
  voice: "linear-gradient(135deg,#6cc0ff,#1d6fb8)",
};

function TitlePoster({ title, skill }: { title: string; skill: Discipline }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-[8cqw]" style={{ background: SKILL_GRAD[skill] }}>
      <span className="text-center font-display text-[14cqw] leading-[1.15] text-[#0b1220]">{title}</span>
    </div>
  );
}

/** خلف الأبواب: باب مفتوح في العتمة، وضوؤه يمتد نحوك. */
function DoorPoster() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="door-bg" cx=".5" cy=".55" r=".6">
          <stop offset="0" stopColor="#1c3354" />
          <stop offset="1" stopColor="#060c16" />
        </radialGradient>
        <linearGradient id="door-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3cf" />
          <stop offset="1" stopColor="#e3a63b" />
        </linearGradient>
        <linearGradient id="door-spill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2c56a" stopOpacity=".7" />
          <stop offset="1" stopColor="#f2c56a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="door-halo" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#f6d58a" stopOpacity=".45" />
          <stop offset="1" stopColor="#f6d58a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#door-bg)" />
      <ellipse cx="760" cy="430" rx="520" ry="380" fill="url(#door-halo)" />
      <rect y="640" width="1600" height="260" fill="#050a12" opacity=".75" />
      <path d="M650 640 L870 640 L1260 900 L260 900 Z" fill="url(#door-spill)" />
      <path d="M650 640 V300 A110 110 0 0 1 870 300 V640 Z" fill="url(#door-light)" />
      <path d="M870 640 V300 L1010 236 V720 Z" fill="#20395a" />
      <circle cx="980" cy="480" r="10" fill="#e3b04b" />
    </svg>
  );
}

/** ركضة وطن: مضمار نحو شمس الأفق. */
function TrackPoster() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="track-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#062a1d" />
          <stop offset=".75" stopColor="#0f6a45" />
          <stop offset="1" stopColor="#e8b04a" />
        </linearGradient>
        <radialGradient id="track-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff0c4" />
          <stop offset=".55" stopColor="#f2c057" />
          <stop offset="1" stopColor="#f2c057" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="track-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e7c4" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="1600" height="470" fill="url(#track-sky)" />
      <circle cx="800" cy="470" r="260" fill="url(#track-sun)" />
      <rect y="470" width="1600" height="430" fill="#063a27" />
      <path d="M330 900 L776 470 L824 470 L1270 900 Z" fill="url(#track-road)" />
      <path d="M630 900 L792 470 M970 900 L808 470" stroke="#0b5136" strokeWidth="10" />
      <path d="M800 900 L800 470" stroke="#e3b04b" strokeWidth="8" strokeDasharray="40 46" />
    </svg>
  );
}

const ADEEB_CHAPTERS = ["بدءُ الحكاية", "حكايةٌ تتناقلها الألسن", "ذروةُ الحكاية", "حكايةٌ تجاوزت الأسوار"];

/** منصة أدِيب: حكاية النادي في أربعة فصول. */
function ChaptersPoster() {
  return (
    <div
      className="flex h-full w-full flex-col justify-start gap-[.2cqw] px-[6cqw] pt-[4.5cqw] text-[#0b1220]"
      style={{ background: "linear-gradient(135deg,#f0c463,#c78a28)" }}
    >
      {ADEEB_CHAPTERS.map((c, i) => (
        <span
          key={c}
          className={`font-display leading-[1.25] ${i === 0 ? "text-[8cqw]" : "text-[3.8cqw]"}`}
          style={{ opacity: [1, 0.62, 0.38, 0.2][i] }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

const POSTERS: Record<string, () => React.JSX.Element> = {
  "خلف-الأبواب": DoorPoster,
  "ركضة-وطن": TrackPoster,
  "منصة-أديب": ChaptersPoster,
};
