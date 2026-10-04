import type { Journey } from "@/lib/journeys";

// أجزاء صفحة العمل: الجسر بين المسودة والنتيجة، والملاحظات.

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
  // ما بين [أقواس] ينتظر معلومة — لا يظهر للزوار
  const items = [
    { k: "التحدي", v: j.challenge },
    { k: "الفكرة", v: j.idea },
    { k: "التنفيذ", v: j.execution },
  ].filter((x) => x.v && !x.v.trim().startsWith("["));
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
