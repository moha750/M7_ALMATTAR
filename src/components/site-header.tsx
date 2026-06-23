import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#work", label: "الأعمال" },
  { href: "#services", label: "الخدمات" },
  { href: "#about", label: "عنّي" },
  { href: "#voice", label: "التعليق الصوتي" },
  { href: "#contact", label: "تواصل" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-espresso/5 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        {/* الشعار (يبدأ من اليمين في RTL) */}
        <Link href="/" className="flex items-center gap-3" aria-label="الصفحة الرئيسية">
          <Image
            src="/brand/logo.png"
            alt="شعار محمد بن إسماعيل"
            width={120}
            height={68}
            priority
            className="h-11 w-auto"
          />
        </Link>

        {/* القائمة */}
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

        {/* زر التواصل */}
        <Link
          href="#contact"
          className="hidden rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03] sm:inline-flex"
        >
          لنعمل معًا
        </Link>
      </div>
    </header>
  );
}
