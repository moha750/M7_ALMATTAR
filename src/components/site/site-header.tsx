"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import AnimatedLogo from "@/components/animated-logo";

const NAV = [
  { href: "/#skills", label: "مهاراتي" },
  { href: "/#work", label: "أعمالي" },
  { href: "/work", label: "كل الأعمال" },
];

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        solid || open
          ? "border-dashed border-gilt/25 bg-night/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-20 items-center justify-between lg:h-24">
        <Link href="/" aria-label="الصفحة الرئيسية" className="flex items-center" onClick={() => setOpen(false)}>
          <AnimatedLogo width={78} play="immediate" />
        </Link>

        <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-9 md:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-3 text-[16px] text-ivory/80 transition-colors hover:text-gilt-light"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="hidden rounded-[10px] bg-gilt px-6 py-3 text-[15px] font-semibold text-night transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            تواصل معي
          </Link>
          <button
            type="button"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-dashed border-ivory/35 text-ivory md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="قائمة الجوال"
          className="shell flex h-[calc(100dvh-80px)] flex-col gap-2 pb-10 pt-6 md:hidden"
        >
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-dashed border-gilt/20 py-5 font-display text-4xl text-ivory"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="mt-auto rounded-[10px] bg-gilt py-4 text-center text-lg font-semibold text-night"
          >
            تواصل معي
          </Link>
        </nav>
      )}
    </header>
  );
}
