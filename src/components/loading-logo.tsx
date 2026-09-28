"use client";

import { useId } from "react";
import {
  LOGO_PATHS,
  LOGO_GRADS,
  WRITE_ORDER,
  GOLD_LIGHT,
  GOLD_DARK,
  SHINE_LIGHT,
  type StrokeKey,
} from "@/components/logo-paths";

// توقيتات الدورة (ثوانٍ)
const STAGGER = 0.45; // الفارق بين بداية كل جرّة
const DRAW = 1.1; // رسم الحدّ
const FILL = 0.5; // الامتلاء
const SHINE = 0.9; // مرور اللمعة
const UNWRITE = 0.5; // مدّة محو الكلمة في نهاية الدورة قبل تكرارها
const CYCLE = 4.6; // طول الدورة الكاملة

const lastDrawDelay = (WRITE_ORDER.length - 1) * STAGGER;
const shineStart = lastDrawDelay + DRAW + FILL; // اللمعة بعد اكتمال آخر جرّة

const pct = (sec: number) => `${((sec / CYCLE) * 100).toFixed(2)}%`;

type Props = {
  width?: number | string;
  className?: string;
};

/**
 * شعار «محمد» لصفحة التحميل (Loading) — يُكتب ويُمحى في حلقة لا نهائية،
 * مع لمعة ذهبية مائلة 45° بعد اكتمال الكلمة في كل دورة.
 */
export default function LoadingLogo({ width = 240, className }: Props) {
  const uid = useId().replace(/[:]/g, "");

  const drawDelayOf = (k: StrokeKey) => WRITE_ORDER.indexOf(k) * STAGGER;

  const css = `
    .${uid}-pp {
      fill-opacity: 0;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: ${uid}-cycle ${CYCLE}s ease-in-out var(--dd) infinite;
    }
    .${uid}-shine {
      opacity: 0;
      transform: translateX(-1100px);
      animation: ${uid}-sweep ${CYCLE}s linear infinite;
    }
    @keyframes ${uid}-cycle {
      0%               { stroke-dashoffset: 1; fill-opacity: 0; stroke-opacity: 1; }
      ${pct(DRAW)}        { stroke-dashoffset: 0; fill-opacity: 0; stroke-opacity: 1; }
      ${pct(DRAW + FILL)} { stroke-dashoffset: 0; fill-opacity: 1; stroke-opacity: 0; }
      ${pct(CYCLE - UNWRITE)} { stroke-dashoffset: 0; fill-opacity: 1; stroke-opacity: 0; }
      100%             { stroke-dashoffset: 1; fill-opacity: 0; stroke-opacity: 1; }
    }
    @keyframes ${uid}-sweep {
      0%                       { opacity: 0; transform: translateX(-1100px); }
      ${pct(shineStart)}          { opacity: 0; transform: translateX(-1100px); }
      ${pct(shineStart + 0.12 * SHINE)} { opacity: 1; }
      ${pct(shineStart + SHINE)}  { opacity: 1; transform: translateX(2600px); }
      ${pct(shineStart + SHINE + 0.12)} { opacity: 0; transform: translateX(2600px); }
      100%                     { opacity: 0; transform: translateX(2600px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .${uid}-pp { animation: none; fill-opacity: 1; stroke-opacity: 0; }
      .${uid}-shine { animation: none; opacity: 0; }
    }
  `;

  return (
    <svg
      className={className}
      width={width}
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="جارٍ التحميل"
      style={{ height: "auto", overflow: "visible" }}
    >
      <title>جارٍ التحميل — شعار محمد</title>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <defs>
        {WRITE_ORDER.map((k) => (
          <linearGradient
            key={k}
            id={`${uid}-g-${k}`}
            gradientUnits="userSpaceOnUse"
            x1={LOGO_GRADS[k].x1}
            y1={LOGO_GRADS[k].y1}
            x2={LOGO_GRADS[k].x2}
            y2={LOGO_GRADS[k].y2}
          >
            <stop offset="0" stopColor={GOLD_DARK} />
            <stop offset="1" stopColor={GOLD_LIGHT} />
          </linearGradient>
        ))}
        <linearGradient id={`${uid}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SHINE_LIGHT} stopOpacity="0" />
          <stop offset="0.5" stopColor={SHINE_LIGHT} stopOpacity="0.92" />
          <stop offset="1" stopColor={SHINE_LIGHT} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${uid}-clip-word`}>
          {WRITE_ORDER.map((k) => (
            <path key={k} d={LOGO_PATHS[k]} />
          ))}
        </clipPath>
      </defs>

      <g fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {WRITE_ORDER.map((k) => (
          <path
            key={k}
            className={`${uid}-pp`}
            pathLength={1}
            d={LOGO_PATHS[k]}
            fill={`url(#${uid}-g-${k})`}
            stroke={GOLD_LIGHT}
            style={{ ["--dd" as string]: `${drawDelayOf(k)}s` }}
          />
        ))}

        {/* لمعة مائلة 45° تتكرّر مع كل دورة */}
        <g clipPath={`url(#${uid}-clip-word)`}>
          <g transform="rotate(45 960 540)">
            <rect
              className={`${uid}-shine`}
              x="0"
              y="-700"
              width="520"
              height="2480"
              fill={`url(#${uid}-shine)`}
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
