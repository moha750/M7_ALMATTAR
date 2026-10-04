"use client";

import { useEffect, useRef } from "react";

/** الكروت المتراكبة: كل كرت يصغر ويخفت قليلًا حين يغطيه التالي. */
export function Stack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(host.querySelectorAll<HTMLElement>("[data-card]"));
    let raf = 0;
    const update = () => {
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const top = next.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, 1 - (top - 120) / (window.innerHeight * 0.8)));
        c.style.transform = `scale(${1 - p * 0.06})`;
        c.style.filter = `brightness(${1 - p * 0.35})`;
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}
