import Link from "next/link";
import { Logo } from "@/components/logo";
import { DISCIPLINES, skillHref } from "@/lib/disciplines";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-dashed border-gilt/25">
      <div className="shell py-10">
        <nav
          aria-label="المهارات"
          className="flex flex-wrap justify-center gap-x-7 gap-y-1 border-b border-dashed border-gilt/15 pb-6 text-[15px] sm:justify-start"
        >
          {DISCIPLINES.map((d) => (
            <Link key={d.slug} href={skillHref(d.slug)} className="py-2 text-ivory/75 transition-colors hover:text-gilt-light">
              {d.title}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-5 pt-7 text-[15px] text-ivory/65 sm:flex-row sm:justify-between">
          <Logo className="h-8 w-auto" />
          <span>
            © {new Intl.NumberFormat("ar-SA", { useGrouping: false }).format(new Date().getFullYear())} محمد المطر · الأحساء
          </span>
          <Link href="/#top" className="py-2 text-ivory/80 hover:text-gilt-light">
            للأعلى ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}
