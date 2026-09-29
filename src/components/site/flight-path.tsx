"use client";

import { useEffect, useId, useRef, useState } from "react";

type Pt = { x: number; y: number };
type Geo = { d: string; w: number; h: number; start: Pt; end: Pt; small: boolean };

/** يحوّل نقاطًا إلى منحنى ناعم يمرّ بها (Catmull-Rom → Bézier). */
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/**
 * مسار التحليق: خط ذهبي منقّط يمرّ بمحطات الصفحة ([data-waypoint-dot])
 * على حافتها، ويُضاء تدريجيًّا مع التمرير. يوضع داخل حاوية relative.
 */
export function FlightPath() {
  const uid = useId().replace(/[:]/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);

  // قياس المحطات وبناء المسار
  useEffect(() => {
    const wrap = wrapRef.current;
    const host = wrap?.parentElement;
    if (!wrap || !host) return;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hostRect = host.getBoundingClientRect();
        const dots = Array.from(
          host.querySelectorAll<HTMLElement>("[data-waypoint-dot]"),
        );
        if (dots.length < 2) {
          setGeo(null);
          return;
        }
        const w = host.clientWidth;
        const h = host.scrollHeight;
        const pts = dots.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - hostRect.left,
            y: r.top + r.height / 2 - hostRect.top,
          };
        });

        const room = Math.max(6, w - pts[0].x - 8);
        const amp = Math.min(56, room);
        const small = amp < 32;
        const start = { x: pts[0].x, y: Math.max(10, pts[0].y - (small ? 60 : 90)) };

        const all: Pt[] = [start];
        const hug = Math.min(amp * 0.85, 48);
        pts.forEach((p, i) => {
          if (i > 0) all.push({ x: Math.min(w - 4, p.x + hug), y: p.y - 36 });
          all.push(p);
          const q = pts[i + 1];
          if (!q) return;
          all.push({ x: Math.min(w - 4, p.x + hug), y: p.y + 36 });
          const dy = q.y - p.y;
          const m = Math.max(1, Math.round((dy - 72) / 420));
          for (let j = 1; j <= m; j++) {
            const t = (36 + ((dy - 72) * j) / (m + 1)) / dy;
            const baseX = p.x + (q.x - p.x) * t;
            const a = j % 2 === 1 ? amp : amp * 0.45;
            all.push({ x: Math.min(w - 4, baseX + a), y: p.y + dy * t });
          }
        });

        setGeo({ d: smoothPath(all), w, h, start, end: pts[pts.length - 1], small });
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // الإضاءة مع التمرير
  useEffect(() => {
    const path = baseRef.current;
    const mask = maskRef.current;
    const head = headRef.current;
    const host = wrapRef.current?.parentElement;
    if (!geo || !path || !mask || !head || !host) return;

    const total = path.getTotalLength();
    const n = Math.max(20, Math.ceil(total / 12));
    const samples: { l: number; y: number }[] = [];
    for (let i = 0; i <= n; i++) {
      const l = (total * i) / n;
      samples.push({ l, y: path.getPointAtLength(l).y });
    }
    const lengthAtY = (y: number) => {
      if (y <= samples[0].y) return 0;
      if (y >= samples[samples.length - 1].y) return total;
      let lo = 0;
      let hi = samples.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].y < y) lo = mid + 1;
        else hi = mid;
      }
      return samples[lo].l;
    };

    mask.style.strokeDasharray = `${total}`;
    const apply = (l: number) => {
      mask.style.strokeDashoffset = `${total - l}`;
      const p = path.getPointAtLength(Math.max(0.01, l));
      head.setAttribute("transform", `translate(${p.x} ${p.y})`);
      head.style.opacity = l > 4 && l < total - 4 ? "1" : "0";
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      apply(total);
      return;
    }

    let cur = 0;
    let target = 0;
    let raf = 0;
    const tick = () => {
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.5) cur = target;
      apply(cur);
      raf = cur !== target ? requestAnimationFrame(tick) : 0;
    };
    const onScroll = () => {
      const top = host.getBoundingClientRect().top;
      target = lengthAtY(window.innerHeight * 0.62 - top);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    onScroll();
    cur = target;
    apply(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [geo]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {geo && (
        <svg
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          fill="none"
          className="absolute left-0 top-0"
        >
          <defs>
            <mask
              id={`${uid}-m`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={geo.w}
              height={geo.h}
            >
              <path
                ref={maskRef}
                d={geo.d}
                stroke="#fff"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </mask>
          </defs>
          <path
            ref={baseRef}
            d={geo.d}
            stroke="#D8A850"
            strokeOpacity="0.22"
            strokeWidth={geo.small ? 2.5 : 3}
            strokeLinecap="round"
            strokeDasharray="1 10"
          />
          <path
            d={geo.d}
            stroke="#E6BE6E"
            strokeWidth={geo.small ? 2.5 : 3}
            strokeLinecap="round"
            strokeDasharray="1 10"
            mask={`url(#${uid}-m)`}
          />
          <g
            transform={`translate(${geo.start.x} ${geo.start.y}) scale(${geo.small ? 0.55 : 1})`}
          >
            <path
              d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5 Z"
              fill="#D8A850"
            />
          </g>
          <g ref={headRef} style={{ opacity: 0 }}>
            <circle r="11" fill="#D8A850" fillOpacity="0.16" />
            <circle r="3.5" fill="#F7E3AE" />
          </g>
          <circle
            cx={geo.end.x}
            cy={geo.end.y}
            r={geo.small ? 10 : 12}
            stroke="#D8A850"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </div>
  );
}
