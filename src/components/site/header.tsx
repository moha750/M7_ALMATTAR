"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "@/components/site/mark";

const NAV = [
  { href: "/#work", label: "الأعمال" },
  { href: "/work", label: "الأرشيف" },
  { href: "/#contact", label: "تواصل" },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-ink/10 bg-paper/90 backdrop-blur-md" : "border-b border-transparent bg-paper"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between lg:h-20">
        <Link href="/" aria-label="الصفحة الرئيسية" className="text-ink transition-opacity hover:opacity-70">
          <Mark className="h-9 w-auto lg:h-10" />
        </Link>
        <nav aria-label="القائمة الرئيسية" className="flex items-center gap-6 text-[15px] font-medium sm:gap-9">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="group relative py-2 text-ink">
              {l.label}
              <span className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
