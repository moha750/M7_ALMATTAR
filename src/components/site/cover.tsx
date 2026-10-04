import Image from "next/image";
import type { Journey } from "@/lib/journeys";
import type { Discipline } from "@/lib/database.types";

/**
 * غلاف العمل: الصورة المرفوعة، وإن لم توجد فملصق مسطّح جريء
 * (مخصص للأعمال المختارة، وبلون المهارة الأساسية لبقية الأعمال).
 * يملأ أباه — الأب يحدد النسبة و relative و overflow-hidden.
 */
export function Cover({
  w,
  sizes,
  priority = false,
}: {
  w: Journey;
  sizes: string;
  priority?: boolean;
}) {
  if (w.cover) {
    return (
      <Image
        src={w.cover}
        alt={w.title}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    );
  }
  const Poster = POSTERS[w.slug];
  return (
    <div className="@container absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
      {Poster ? <Poster /> : <TitlePoster title={w.title} skill={w.category} />}
    </div>
  );
}

const SKILL_BG: Record<Discipline, { bg: string; fg: string }> = {
  graphic: { bg: "bg-skill-graphic", fg: "text-ink" },
  editing: { bg: "bg-skill-editing", fg: "text-paper" },
  motion: { bg: "bg-skill-motion", fg: "text-paper" },
  code: { bg: "bg-skill-code", fg: "text-paper" },
  voice: { bg: "bg-skill-voice", fg: "text-paper" },
};

function TitlePoster({ title, skill }: { title: string; skill: Discipline }) {
  const c = SKILL_BG[skill];
  return (
    <div className={`flex h-full w-full items-center justify-center px-[8cqw] ${c.bg}`}>
      <span className={`text-center font-display text-[13cqw] leading-[1.15] ${c.fg}`}>{title}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ملصقات الأعمال المختارة
// ---------------------------------------------------------------------------

/** خلف الأبواب: باب مفتوح في العتمة، وضوؤه يمتد نحوك. */
function DoorPoster() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="dp-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBE9BC" />
          <stop offset="1" stopColor="#D9A646" />
        </linearGradient>
        <linearGradient id="dp-spill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9C06A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#E9C06A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="#0D1B2A" />
      <rect y="690" width="1600" height="210" fill="#0A1622" />
      <path d="M640 690 L860 690 L1120 900 L380 900 Z" fill="url(#dp-spill)" />
      <path d="M640 690 V330 A110 110 0 0 1 860 330 V690 Z" fill="url(#dp-light)" />
      <path d="M860 690 V330 L990 270 V760 Z" fill="#1B3149" />
      <circle cx="962" cy="520" r="9" fill="#D9A646" />
    </svg>
  );
}

/** ركضة وطن: مضمار أخضر يمتد نحو شمس الأفق. */
function TrackPoster() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <clipPath id="tp-sky">
          <rect width="1600" height="440" />
        </clipPath>
      </defs>
      <rect width="1600" height="900" fill="#0E4D35" />
      <rect y="440" width="1600" height="460" fill="#0A3B29" />
      <circle cx="800" cy="440" r="120" fill="#E2B64F" clipPath="url(#tp-sky)" />
      <path d="M360 900 L770 440 L830 440 L1240 900 Z" fill="#F4F1EA" />
      <path d="M650 900 L790 440 M950 900 L810 440" stroke="#0A3B29" strokeWidth="9" />
    </svg>
  );
}

const ADEEB_CHAPTERS = ["بدءُ الحكاية", "حكايةٌ تتناقلها الألسن", "ذروةُ الحكاية", "حكايةٌ تجاوزت الأسوار"];

/** منصة أدِيب: حكاية النادي في أربعة فصول. */
function ChaptersPoster() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-[1.2cqw] bg-skill-graphic px-[7cqw] text-ink">
      {ADEEB_CHAPTERS.map((c, i) => (
        <div key={c} className="flex items-baseline gap-[2.5cqw]" style={{ opacity: 1 - i * 0.2 }}>
          <span className="w-[4cqw] font-sans text-[2.4cqw] font-semibold">
            {new Intl.NumberFormat("ar-SA").format(i + 1)}
          </span>
          <span className={`font-display leading-[1.25] ${i === 0 ? "text-[8.5cqw]" : "text-[5.6cqw]"}`}>{c}</span>
        </div>
      ))}
    </div>
  );
}

const POSTERS: Record<string, () => React.JSX.Element> = {
  "خلف-الأبواب": DoorPoster,
  "ركضة-وطن": TrackPoster,
  "منصة-أديب": ChaptersPoster,
};
