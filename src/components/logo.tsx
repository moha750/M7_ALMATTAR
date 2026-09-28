"use client";

import { useId } from "react";
import {
  LOGO_PATHS,
  LOGO_GRADS,
  WRITE_ORDER,
  GOLD_LIGHT,
  GOLD_DARK,
} from "@/components/logo-paths";

type Props = {
  className?: string;
  title?: string;
};

/**
 * شعار «محمد» ثابت بالتدرّج الذهبي — يُرسم من المسارات المشتركة بدل صورة.
 * الحجم يُضبط عبر className (مثل h-11 w-auto)؛ النسبة 1920×1080 محفوظة.
 */
export function Logo({ className, title = "شعار محمد المطر" }: Props) {
  const uid = useId().replace(/[:]/g, "");

  return (
    <svg
      className={className}
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        {WRITE_ORDER.map((k) => (
          <linearGradient
            key={k}
            id={`${uid}-${k}`}
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
      </defs>
      {WRITE_ORDER.map((k) => (
        <path key={k} d={LOGO_PATHS[k]} fill={`url(#${uid}-${k})`} />
      ))}
    </svg>
  );
}
