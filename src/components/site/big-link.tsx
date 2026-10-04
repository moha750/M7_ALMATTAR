import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** سطر رابط عريض يمتلئ بالحبر عند المرور — لـ«كل الأعمال» و«التالي». */
export function BigLink({ href, label, meta }: { href: string; label: string; meta?: string }) {
  return (
    <Link
      href={href}
      className="group relative flex items-center justify-between gap-6 overflow-hidden border-y border-ink px-1 py-8 lg:py-10"
    >
      <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-out group-hover:scale-y-100" />
      <span className="t-lg relative transition-colors duration-300 group-hover:px-4 group-hover:text-paper">{label}</span>
      <span className="relative flex items-center gap-4 transition-colors duration-300 group-hover:text-paper">
        {meta && <span className="t-meta">{meta}</span>}
        <ArrowLeft className="h-8 w-8 transition-transform duration-300 group-hover:-translate-x-2 lg:h-11 lg:w-11" strokeWidth={1.5} />
      </span>
    </Link>
  );
}
