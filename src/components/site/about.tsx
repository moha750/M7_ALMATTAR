import { Waypoint } from "@/components/site/waypoint";
import { Reveal } from "@/components/reveal";
import { VoicePlayer } from "@/components/site/voice-player";

// مواقع العقد حول «الفكرة» (نسبة مئوية من اللوحة 616×700)
const SPOTS: Array<[number, number]> = [
  [26, 10],
  [71.4, 12.9],
  [90.9, 28.6],
  [14.6, 27.1],
  [92.5, 48.6],
  [11.4, 48.6],
  [84.4, 67.1],
  [17.9, 65.7],
  [63.3, 81.4],
  [29.2, 82.9],
];
const CENTER: [number, number] = [50, 48.6];

export function About({
  bio,
  skills,
  learning,
  voiceSrc,
}: {
  bio: string;
  skills: string[];
  learning: string;
  voiceSrc: string | null;
}) {
  const placed = skills.slice(0, SPOTS.length);
  const extra = skills.slice(SPOTS.length);

  return (
    <section id="about" className="relative z-10 scroll-mt-24">
      <div className="shell pt-24 lg:pt-[110px]">
        <Waypoint label="٣ · النضج" />
        <div className="mt-6 grid gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col gap-6">
            <h2 className="font-display text-5xl leading-[1.3] sm:text-[72px]">مهارات تكبر مع كل فكرة</h2>
            <p className="text-lg leading-[1.9] text-ivory/85 sm:text-[21px]">{bio}</p>
            <VoicePlayer src={voiceSrc} />
          </Reveal>

          {/* كوكبة المهارات — سطح المكتب */}
          <Reveal delay={0.1} className="hidden lg:block">
            <div className="relative mx-auto aspect-[616/700] w-full max-w-[616px]">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
                {placed.map((_, i) => (
                  <line
                    key={i}
                    x1={CENTER[0]}
                    y1={CENTER[1]}
                    x2={SPOTS[i][0]}
                    y2={SPOTS[i][1]}
                    stroke="#D8A850"
                    strokeOpacity="0.35"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <line x1={50} y1={48.6} x2={50} y2={4.3} stroke="#F2EBDD" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
                <line x1={50} y1={48.6} x2={50} y2={94.3} stroke="#D8A850" strokeOpacity="0.8" strokeWidth="1.5" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
              </svg>

              <div className="absolute left-1/2 top-[48.6%] flex h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gilt bg-midnight font-display text-[32px] text-gilt-light">
                الفكرة
              </div>

              <Node x={50} y={4.3} variant="next">+ القادم</Node>
              {placed.map((s, i) => (
                <Node key={s} x={SPOTS[i][0]} y={SPOTS[i][1]}>
                  {s}
                </Node>
              ))}
              <Node x={50} y={94.3} variant="learning">
                أتعلّم الآن: {learning}
              </Node>
            </div>
            {extra.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                {extra.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            )}
          </Reveal>

          {/* المهارات — الجوال */}
          <div className="flex flex-col items-center gap-5 lg:hidden">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gilt bg-midnight font-display text-2xl text-gilt-light">
              الفكرة
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {skills.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
              <Chip variant="learning">أتعلّم الآن: {learning}</Chip>
              <Chip variant="next">+ القادم</Chip>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Node({
  x,
  y,
  variant,
  children,
}: {
  x: number;
  y: number;
  variant?: "learning" | "next";
  children: React.ReactNode;
}) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <Chip variant={variant}>{children}</Chip>
    </span>
  );
}

function Chip({
  variant,
  children,
}: {
  variant?: "learning" | "next";
  children: React.ReactNode;
}) {
  const cls =
    variant === "learning"
      ? "border-[1.5px] border-dashed border-gilt bg-[#13304F] text-gilt-light"
      : variant === "next"
        ? "border border-dashed border-ivory/40 bg-night text-ivory/70"
        : "border border-gilt/45 bg-night text-ivory";
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-4 py-2 text-[15px] ${cls}`}>
      {children}
    </span>
  );
}
