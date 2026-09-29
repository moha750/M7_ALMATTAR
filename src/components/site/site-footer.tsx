import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-dashed border-gilt/25">
      <div className="shell flex flex-col items-center gap-5 py-10 text-[15px] text-ivory/65 sm:flex-row sm:justify-between">
        <Logo className="h-8 w-auto" />
        <span>
          © {new Intl.NumberFormat("ar-SA", { useGrouping: false }).format(new Date().getFullYear())} محمد المطر · الأحساء
        </span>
        <Link href="/#top" className="py-2 text-ivory/80 hover:text-gilt-light">
          عودة للشرارة ↑
        </Link>
      </div>
    </footer>
  );
}
