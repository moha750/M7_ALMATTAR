"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import SplashLogo from "@/components/splash-logo";
import { Logo } from "@/components/logo";

const NAV_LINKS = [
  { href: "/#work", label: "الأعمال" },
  { href: "/#services", label: "الخدمات" },
  { href: "/#contact", label: "تواصل" },
];

// ——— قيم قابلة للضبط للافتتاحية ———
// أولاً: الشعار يُرسَم أنميشن على خلفية مستقلّة والتمرير مقفل. بعد انتهاء الرسم
// يُفتح التمرير فيطير الشعار إلى زاويته ويظهر الهيدر والمحتوى من رأس الهيرو.
const SCROLL_RANGE = 480; // مسافة التمرير (px) لإتمام طيران الشعار
const INTRO_SCALE = 5.4; // حجم الشعار وهو وسط الشاشة (مضاعفات حجم الزاوية)
const HEADER_CENTER_Y = 40; // منتصف شريط الهيدر رأسياً (h-20 = 80px)
const LOGO_W = 78; // عرض الشعار عند h-11
const LOGO_TOP = 18; // أعلى الشعار داخل الهيدر = (80-44)/2

// كريمي الموقع (#e9e3d7) شفّافًا ثم بعتامة عند استقرار الهيدر
const BG_TOP = "rgba(233, 227, 215, 0)";
const BG_SCROLLED = "rgba(233, 227, 215, 0.85)";

// useLayoutEffect على العميل دون تحذير على الخادم
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function SiteHeader() {
  const reduce = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);

  // إعادة الافتتاحية مع كل تحميل: ابدأ من الأعلى دائماً
  useIso(() => {
    if (reduce) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, [reduce]);

  // عند انتهاء الطيران: تُزال منطقة التمرير، فنعوّض الموضع دون قفزة
  useIso(() => {
    if (dismissed) {
      window.scrollTo(0, Math.max(0, window.scrollY - SCROLL_RANGE));
    }
  }, [dismissed]);

  if (reduce || dismissed) return <PlainHeader />;
  return <IntroHeader onComplete={() => setDismissed(true)} />;
}

/**
 * الافتتاحية: (١) الشعار يُرسَم أنميشن والتمرير مقفل، (٢) بعد انتهاء الرسم
 * يُفتح التمرير فيطير الشعار إلى الزاوية ويظهر الموقع. أحاديّة الاتجاه: تكتمل
 * مرّة ثم تُقفل، وتُعاد عند تحديث الصفحة.
 */
function IntroHeader({ onComplete }: { onComplete: () => void }) {
  const { scrollY } = useScroll();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState({ cornerX: 0, dx: 0, dy: 0 });
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawn, setDrawn] = useState(false);

  // اقفل التمرير حتى ينتهي رسم الشعار، ثم افتحه (الحاوية المتمرّرة هي <html>)
  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
    };
  }, []);
  useEffect(() => {
    if (drawn) {
      document.documentElement.style.overflow = "";
      window.scrollTo(0, 0); // ابدأ الطيران من الصفر بعد فتح التمرير
    }
  }, [drawn]);

  useEffect(() => {
    const measure = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect(); // x ثابت بصرف النظر عن التمرير
      const cornerX = r.left + r.width / 2;
      setMetrics({
        cornerX,
        dx: window.innerWidth / 2 - cornerX,
        dy: window.innerHeight / 2 - HEADER_CENTER_Y,
      });
      setReady(true);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // 0 في البداية (الشعار وسط الشاشة) ← 1 بعد التمرير (الشعار في الزاوية)
  const progress = useTransform(scrollY, [0, SCROLL_RANGE], [0, 1], {
    clamp: true,
  });

  const x = useTransform(progress, (p) => metrics.dx * (1 - p));
  const y = useTransform(progress, (p) => metrics.dy * (1 - p));
  const scale = useTransform(
    progress,
    (p) => INTRO_SCALE - (INTRO_SCALE - 1) * p,
  );
  const panelOpacity = useTransform(progress, [0.7, 1], [1, 0], {
    clamp: true,
  });
  const bg = useTransform(progress, [0.6, 1], [BG_TOP, BG_SCROLLED]);
  const uiOpacity = useTransform(progress, [0.8, 1], [0, 1], { clamp: true });

  useMotionValueEvent(progress, "change", (v) => {
    setScrolled(v > 0.6);
    if (v >= 1) onComplete(); // اكتمل الطيران → تُقفل الافتتاحية
  });

  return (
    <>
      {/* منطقة تمرير مخصّصة: تمنح الطيران مسافته دون تحريك الهيرو */}
      <div aria-hidden style={{ height: SCROLL_RANGE }} />

      <motion.header
        style={{ backgroundColor: bg }}
        className={`sticky top-0 z-50 border-b transition-[border-color] duration-300 ${
          scrolled ? "border-espresso/5 backdrop-blur-md" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          {/* حاجز يحجز مكان الشعار في الزاوية (الشعار الحقيقي عنصر ثابت أدناه) */}
          <span ref={anchorRef} aria-hidden className="block h-11 w-[78px]" />

          <motion.nav
            style={{
              opacity: uiOpacity,
              pointerEvents: scrolled ? "auto" : "none",
            }}
            aria-hidden={!scrolled}
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-espresso/70 transition-colors hover:text-espresso"
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>

          <motion.div
            style={{
              opacity: uiOpacity,
              pointerEvents: scrolled ? "auto" : "none",
            }}
            aria-hidden={!scrolled}
            className="hidden sm:block"
          >
            <Link
              href="/#contact"
              className="rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
            >
              لنعمل معًا
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* الخلفية المستقلّة للافتتاحية */}
      <motion.div
        aria-hidden
        style={{ opacity: panelOpacity, pointerEvents: "none" }}
        className="fixed inset-0 z-[55] bg-espresso"
      >
        <div
          className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* الشعار: يُرسَم أنميشن وسط الشاشة، ثم يطير إلى زاوية الهيدر مع التمرير */}
      <motion.div
        style={{
          x,
          y,
          scale,
          opacity: ready ? 1 : 0,
          left: metrics.cornerX - LOGO_W / 2,
          top: LOGO_TOP,
        }}
        className="fixed z-[60] h-11 w-[78px] origin-center will-change-transform"
      >
        <Link href="/" aria-label="الصفحة الرئيسية" className="block h-full">
          <SplashLogo onFinish={() => setDrawn(true)} className="block w-full" />
        </Link>
      </motion.div>
    </>
  );
}

/** الهيدر الطبيعي بعد الافتتاحية (أو لمن يفضّل تقليل الحركة):
 *  شفّاف في أعلى الهيرو فيبدو جزءًا منه، يكتسب خلفيةً عند التمرير */
function PlainHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        solid
          ? "border-espresso/5 bg-cream/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="الصفحة الرئيسية" className="flex items-center">
          <Logo className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-espresso/70 transition-colors hover:text-espresso"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#contact"
          className="hidden rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03] sm:inline-flex"
        >
          لنعمل معًا
        </Link>
      </div>
    </header>
  );
}
