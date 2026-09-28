"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LOGO_PATHS, LOGO_GRADS } from "@/components/logo-paths";

/**
 * شعار «محمد» متحرّك — كل جرّة تُرسَم بالقلم الذهبي ثم تمتلئ بالتدرّج
 * ثم تمرّ عليها لمعة ذهبية.
 *
 * ترتيب الكتابة (عدّل هذه المصفوفة فقط لتغيير التسلسل):
 *   "mid" = الجرّة الوسطى (م)
 *   "mah" = الجرّة اليمنى (مح)
 *   "dal" = الجرّة اليسرى (د)
 */
const ORDER: Array<"mid" | "mah" | "dal"> = ["mid", "mah", "dal"];

// توقيتات أساسية (بالثواني) — المدّة الكلّية = STAGGER×2 + DRAW + FILL + SHINE_HOLD + SHINE ≈ 2.3s
const STAGGER = 0.28; // الفارق بين بداية كل جرّة والتي تليها
const DRAW = 0.8; // مدّة رسم الحدّ
const FILL = 0.35; // مدّة امتلاء التدرّج
const SHINE = 0.6; // مدّة مرور اللمعة

// مسارات الشعار وتدرّجاته — مستوردة من الملف المشترك
const PATHS = LOGO_PATHS;
const GRADS = LOGO_GRADS;

type Props = {
  /** عرض الشعار (CSS). الارتفاع يتبع نسبة 1920×1080 تلقائيًّا. */
  width?: number | string;
  className?: string;
  /** متى تبدأ الحركة: عند الظهور على الشاشة (افتراضي) أو فورًا أو حلقة متكرّرة. */
  play?: "in-view" | "immediate" | "loop";
};

export default function AnimatedLogo({
  width = 320,
  className,
  play = "in-view",
}: Props) {
  const uid = useId().replace(/[:]/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(play !== "in-view");

  useEffect(() => {
    if (play !== "in-view") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  // تأخير رسم كل جرّة حسب موضعها في ترتيب الكتابة
  const drawDelayOf = (key: "mid" | "mah" | "dal") => ORDER.indexOf(key) * STAGGER;

  // لمعة واحدة على الكلمة كلها تأتي مباشرة بعد اكتمال آخر جرّة
  const SHINE_HOLD = 0; // سكون قبل مرور اللمعة (0 = فورًا)
  const wordShineDelay =
    (ORDER.length - 1) * STAGGER + DRAW + FILL + SHINE_HOLD;

  const css = `
    .${uid}-pp {
      fill-opacity: 0;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: ${uid}-drawfill ${DRAW + FILL}s ease-in-out var(--dd) both;
      animation-play-state: paused;
    }
    .${uid}-shine {
      opacity: 0;
      transform: translateX(-1100px);
      animation: ${uid}-sweep ${SHINE}s ease-out var(--sd) both;
      animation-play-state: paused;
    }
    .${uid}-on .${uid}-pp,
    .${uid}-on .${uid}-shine { animation-play-state: running; }
    ${
      play === "loop"
        ? `.${uid}-on .${uid}-pp { animation-iteration-count: infinite; animation-direction: alternate; }
           .${uid}-on .${uid}-shine { animation-iteration-count: infinite; }`
        : ""
    }
    @keyframes ${uid}-drawfill {
      0%   { stroke-dashoffset: 1; fill-opacity: 0; stroke-opacity: 1; }
      ${Math.round((DRAW / (DRAW + FILL)) * 100)}% { stroke-dashoffset: 0; fill-opacity: 0; stroke-opacity: 1; }
      100% { stroke-dashoffset: 0; fill-opacity: 1; stroke-opacity: 0; }
    }
    @keyframes ${uid}-sweep {
      0%   { opacity: 0; transform: translateX(-1100px); }
      12%  { opacity: 1; }
      88%  { opacity: 1; }
      100% { opacity: 0; transform: translateX(2600px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .${uid}-pp { animation: none; fill-opacity: 1; stroke-opacity: 0; }
      .${uid}-shine { animation: none; opacity: 0; }
    }
  `;

  return (
    <svg
      ref={ref}
      className={`${active ? `${uid}-on ` : ""}${className ?? ""}`}
      width={width}
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="شعار محمد"
      style={{ height: "auto", overflow: "visible" }}
    >
      <title>شعار محمد</title>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <defs>
        {(Object.keys(GRADS) as Array<"mid" | "mah" | "dal">).map((k) => (
          <linearGradient
            key={k}
            id={`${uid}-g-${k}`}
            gradientUnits="userSpaceOnUse"
            x1={GRADS[k].x1}
            y1={GRADS[k].y1}
            x2={GRADS[k].x2}
            y2={GRADS[k].y2}
          >
            <stop offset="0" stopColor="#C19955" />
            <stop offset="1" stopColor="#D2AE6B" />
          </linearGradient>
        ))}

        {/* تدرّج اللمعة: شفاف ← ذهبي فاتح ← شفاف */}
        <linearGradient id={`${uid}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFF6DF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFF6DF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFF6DF" stopOpacity="0" />
        </linearGradient>

        {/* قناع يجمع كل الجرّات لتمرّ اللمعة على الكلمة كاملة */}
        <clipPath id={`${uid}-clip-word`}>
          {(Object.keys(PATHS) as Array<"mid" | "mah" | "dal">).map((k) => (
            <path key={k} d={PATHS[k]} />
          ))}
        </clipPath>
      </defs>

      <g fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {ORDER.map((k) => (
          <path
            key={k}
            className={`${uid}-pp`}
            pathLength={1}
            d={PATHS[k]}
            fill={`url(#${uid}-g-${k})`}
            stroke="#D2AE6B"
            style={{ ["--dd" as string]: `${drawDelayOf(k)}s` }}
          />
        ))}

        {/* لمعة واحدة مائلة 45° تمرّ على الكلمة كلها بعد اكتمالها */}
        <g clipPath={`url(#${uid}-clip-word)`}>
          <g transform="rotate(45 960 540)">
            <rect
              className={`${uid}-shine`}
              x="0"
              y="-700"
              width="520"
              height="2480"
              fill={`url(#${uid}-shine)`}
              style={{ ["--sd" as string]: `${wordShineDelay}s` }}
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
