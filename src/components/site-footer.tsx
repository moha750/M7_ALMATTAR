import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="section-dark mt-auto">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 text-center">
        <Image
          src="/brand/logo.png"
          alt="شعار محمد بن إسماعيل"
          width={120}
          height={68}
          className="h-12 w-auto opacity-90"
        />
        <p className="font-[family-name:var(--font-display)] text-2xl text-gold">
          مُبدِعٌ واحد، خمسُ حِرَف.
        </p>
        <p className="text-sm text-cream/50">
          © {new Date().getFullYear()} محمد بن إسماعيل — جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
