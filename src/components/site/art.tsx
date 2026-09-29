import { ADEEB_CHAPTERS, type StoryFrame } from "@/lib/journeys";

/** الباب المفتوح بضوئه — رسم بديل لنتيجة «خلف الأبواب». */
export function DoorArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="doorLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7E3AE" stopOpacity="0.6" />
          <stop offset="1" stopColor="#D8A850" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <path d="M70 372 L330 372 L400 400 L0 400 Z" fill="#D8A850" fillOpacity="0.1" />
      <path d="M130 372 V184 A70 70 0 0 1 270 184 V372 Z" fill="url(#doorLight)" />
      <path d="M130 372 V184 A70 70 0 0 1 270 184 V372" stroke="#D8A850" strokeWidth="3" />
      <path
        d="M270 372 V184 Q300 150 332 176 V392 Z"
        fill="#0E2A47"
        stroke="#D8A850"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="318" cy="290" r="5" fill="#D8A850" />
      <path d="M332 252 Q354 238 362 214" stroke="#D8A850" strokeWidth="3" strokeLinecap="round" />
      <circle cx="364" cy="206" r="7" stroke="#D8A850" strokeWidth="3" />
    </svg>
  );
}

/** فصول حكاية أدِيب — رسم بديل لنتيجة «منصة أدِيب». */
export function ChaptersArt({ compact = false }: { compact?: boolean }) {
  const fades = ["", "opacity-55", "opacity-35", "opacity-20"];
  return (
    <div className={`flex flex-col ${compact ? "gap-2" : "gap-3"}`}>
      <span className={`${compact ? "text-xs" : "text-sm"} text-ivory/60`}>حكاية النادي في أربعة فصول</span>
      {ADEEB_CHAPTERS.map((c, i) => (
        <span
          key={c}
          className={`font-display leading-[1.6] ${
            i === 0 ? "text-gilt" : `text-ivory ${fades[i]}`
          } ${compact ? (i === 0 ? "text-base sm:text-xl" : "text-sm sm:text-base") : i === 0 ? "text-4xl" : "text-3xl"}`}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

/** إطار واحد من لوحة القصة المرسومة. */
export function StoryFrameCard({ frame }: { frame: StoryFrame }) {
  const door = frame.kind === "door";
  return (
    <div
      className={`flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed sm:aspect-auto sm:h-[150px] ${
        door ? "border-gilt" : "border-ivory/35"
      }`}
    >
      <svg width="64" height="56" viewBox="0 0 80 70" fill="none" aria-hidden>
        {door ? (
          <>
            <path d="M26 64 V26 A14 14 0 0 1 54 26 V64" stroke="#F0D38F" strokeWidth="2" strokeLinecap="round" />
            <circle cx="48" cy="46" r="2.5" fill="#F0D38F" />
            <path d="M54 40 Q64 34 66 24" stroke="#F0D38F" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="40" cy="22" r="12" stroke="rgba(242,235,221,0.75)" strokeWidth="2" />
            <path d="M16 64 Q40 34 64 64" stroke="rgba(242,235,221,0.75)" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
      <span className={`font-hand text-lg sm:text-xl ${door ? "text-gilt-light" : "text-ivory/85"}`}>
        {frame.label}
      </span>
    </div>
  );
}

/** مخطّط سلكي عام — رسم بديل لمسودة لم تُرفع بعد. */
export function WireframeArt() {
  return (
    <div className="flex h-full flex-col gap-3" aria-hidden>
      <span className="h-3.5 rounded border border-dashed border-ivory/35" />
      <span className="h-24 rounded-md border border-dashed border-ivory/35" />
      <span className="h-2.5 w-3/4 rounded border border-dashed border-ivory/35" />
      <span className="h-2.5 w-1/2 rounded border border-dashed border-ivory/35" />
    </div>
  );
}

/** نجمة الشرارة. */
export function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden>
      <path d="M22 0 L27 17 L44 22 L27 27 L22 44 L17 27 L0 22 L17 17 Z" fill="currentColor" />
    </svg>
  );
}
