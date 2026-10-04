import Link from "next/link";
import { Mark } from "@/components/site/mark";
import { DISCIPLINES, skillHref } from "@/lib/disciplines";

export function Footer() {
  return (
    <footer className="bg-deep text-bone/60">
      <div className="wrap flex flex-col gap-6 border-t border-bone/10 py-8 text-[14px] lg:flex-row lg:items-center lg:justify-between">
        <Link href="#top" aria-label="للأعلى" className="text-sun">
          <Mark className="h-9 w-auto" />
        </Link>
        <nav aria-label="المهارات" className="flex flex-wrap gap-x-6 gap-y-2">
          {DISCIPLINES.map((d) => (
            <Link key={d.slug} href={skillHref(d.slug)} className="transition-colors hover:text-bone">
              {d.title}
            </Link>
          ))}
        </nav>
        <span>
          © {new Intl.NumberFormat("ar-SA", { useGrouping: false }).format(new Date().getFullYear())} محمد المطر · الأحساء، السعودية
        </span>
      </div>
    </footer>
  );
}
