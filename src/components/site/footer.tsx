import Link from "next/link";
import { Mark } from "@/components/site/mark";
import { DISCIPLINES, skillHref } from "@/lib/disciplines";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="wrap border-t border-paper/15 py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Mark className="h-10 w-auto text-paper" />
          <nav aria-label="المهارات" className="flex flex-wrap gap-x-7 gap-y-2 text-[15px] text-paper/70">
            {DISCIPLINES.map((d) => (
              <Link key={d.slug} href={skillHref(d.slug)} className="transition-colors hover:text-paper">
                {d.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex items-center justify-between text-[14px] text-paper/50">
          <span>
            © {new Intl.NumberFormat("ar-SA", { useGrouping: false }).format(new Date().getFullYear())} محمد المطر
          </span>
          <Link href="#top" className="transition-colors hover:text-paper">
            للأعلى ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}
