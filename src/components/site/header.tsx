"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "@/components/site/mark";

const NAV = [
  { href: "/#skills", label: "المهارات" },
  { href: "/#work", label: "الأعمال" },
  { href: "/#contact", label: "تواصل" },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "border-bone/10 bg-void/70 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <div className="wrap flex h-[76px] items-center justify-between">
        <Link href="/" aria-label="الصفحة الرئيسية" className="text-sun transition-opacity hover:opacity-80">
          <Mark className="h-10 w-auto" />
        </Link>
        <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-9 text-[15px] font-medium md:flex">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="text-bone/60 transition-colors hover:text-bone">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#contact"
          className="inline-flex h-12 items-center rounded-full border border-bone/30 px-6 text-[15px] font-semibold transition-all hover:-translate-y-0.5 hover:border-bone"
        >
          لنعمل معًا
        </Link>
      </div>
    </header>
  );
}
