"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  LOGO_PATHS,
  LOGO_GRADS,
  WRITE_ORDER,
  GOLD_LIGHT,
  GOLD_DARK,
  SHINE_LIGHT,
  type StrokeKey,
} from "@/components/logo-paths";

// توقيتات (ثوانٍ)
const STAGGER = 0.45; // الفارق بين بداية كل جرّة
const DRAW = 1.1; // رسم الحدّ
const FILL = 0.5; // الامتلاء
const SHINE = 0.9; // مرور اللمعة

const lastDrawDelay = (WRITE_ORDER.length - 1) * STAGGER;
const shineDelay = lastDrawDelay + DRAW + FILL; // فورًا بعد اكتمال آخر جرّة
const TOTAL = shineDelay + SHINE; // المدّة الكاملة للحركة

type Props = {
  width?: number | string;
  className?: string;
  /** يُستدعى بعد انتهاء الحركة كاملة — لإخفاء صفحة الـ Splash والانتقال. */
  onFinish?: () => void;
};

/**
 * شعار «محمد» لصفحة Splash — يُرسَم مرّة واحدة ويبقى ممتلئًا،
 * ثم يستدعي onFinish بعد انتهاء الحركة (واللمعة).
 */
export default function SplashLogo({ width = 360, className, onFinish }: Props) {
  const uid = useId().replace(/[:]/g, "");
  const finished = useRef(false);

  useEffect(() => {
    if (!onFinish) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const delay = prefersReduced ? 300 : TOTAL * 1000 + 150;
    const id = window.setTimeout(() => {
      if (!finished.current) {
        finished.current = true;
        onFinish();
      }
    }, delay);
    return () => window.clearTimeout(id);
  }, [onFinish]);

  const drawDelayOf = (k: StrokeKey) => WRITE_ORDER.indexOf(k) * STAGGER;

  const css = `
    .${uid}-pp {
      fill-opacity: 0;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: ${uid}-drawfill ${DRAW + FILL}s ease-in-out var(--dd) forwards;
    }
    .${uid}-shine {
      opacity: 0;
      transform: translateX(-1100px);
      animation: ${uid}-sweep ${SHINE}s ease-out ${shineDelay}s forwards;
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
      className={className}
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

        {/* لمعة مائلة 45° تمرّ مرّة واحدة بعد اكتمال الكلمة */}
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
