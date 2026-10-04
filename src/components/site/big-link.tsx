import Link from "next/link";

/** زر عريض بإطار ذهبي يمتلئ عند المرور — لـ«التالي» و«كل الأعمال». */
export function BigLink({ href, label, meta }: { href: string; label: string; meta?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-5 rounded-[28px] border-[1.5px] border-sun px-7 py-6 text-sun transition-all duration-300 hover:-translate-y-1 hover:bg-sun hover:text-[#120c02] sm:px-9 sm:py-8"
    >
      <b className="font-display text-[clamp(32px,3.6vw,56px)] font-normal leading-[1.2]">{label}</b>
      <span className="text-[15px] font-semibold sm:text-[16px]">{meta ? `${meta} ←` : "←"}</span>
    </Link>
  );
}
