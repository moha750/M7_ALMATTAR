import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { DISCIPLINES } from "@/lib/disciplines";
import { HeroThread } from "@/components/hero-thread";

export function Hero({ bio }: { bio?: string | null }) {
  return (
    <section className="grain relative overflow-hidden bg-cream">
      {/* توهّج ذهبي ناعم في الخلفية */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 start-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        {/* العمود النصّي */}
        <div className="text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-parchment/60 px-4 py-1.5 text-sm font-medium text-gold-deep">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            بورتفوليو · مبدع متعدّد التخصصات
          </span>

          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-[1.25] text-espresso sm:text-6xl lg:text-7xl">
            مُبدِعٌ واحد،
            <br />
            <span className="text-gold-gradient">خمسُ حِرَف.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-espresso/75 lg:mx-0">
            {bio ??
              "أصمّم، وأُحرّك، وأروي بصوتي. حِسٌّ إبداعي واحد يجمع التصميم الجرافيكي والمونتاج والموشن جرافيك والبرمجة والتعليق الصوتي — لأحوّل فكرتك إلى أثرٍ يُرى ويُسمع."}
          </p>

          {/* سويتشر التخصصات */}
          <ul className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start">
            {DISCIPLINES.map((d) => {
              const Icon = d.icon;
              return (
                <li key={d.slug}>
                  <span
                    className="group inline-flex items-center gap-2 rounded-full border border-espresso/10 bg-parchment px-4 py-2 text-sm font-medium text-espresso/80 transition-all hover:-translate-y-0.5 hover:border-transparent hover:text-espresso hover:shadow-md"
                    style={{ ["--pulse" as string]: d.color }}
                  >
                    <Icon
                      className="h-4 w-4 transition-colors"
                      style={{ color: "var(--pulse)" }}
                      strokeWidth={2}
                    />
                    {d.title}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* الأزرار */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-3.5 text-base font-semibold text-cream transition-transform hover:scale-[1.03]"
            >
              شاهد الأعمال
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="#showreel"
              className="inline-flex items-center gap-2 rounded-full border border-espresso/15 px-7 py-3.5 text-base font-semibold text-espresso transition-colors hover:bg-espresso/5"
            >
              <Download className="h-4 w-4" />
              حمّل الريل
            </Link>
          </div>
        </div>

        {/* عمود الصورة */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          {/* الخيط الذهبي (يرسم نفسه) */}
          <HeroThread />

          {/* الإطار + الصورة */}
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/30 bg-parchment shadow-[0_30px_80px_-30px_rgba(28,26,23,0.45)]">
            <Image
              src="/brand/profile.jpg"
              alt="محمد بن إسماعيل"
              width={680}
              height={900}
              priority
              className="h-auto w-full object-cover"
            />
            {/* تدرّج سفلي خفيف */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso/15 to-transparent"
            />
          </div>

          {/* بطاقة عائمة صغيرة */}
          <div className="absolute -bottom-5 -start-5 hidden rounded-2xl border border-espresso/10 bg-cream/95 px-5 py-3 shadow-lg backdrop-blur sm:block">
            <p className="font-[family-name:var(--font-tech)] text-2xl font-bold text-gold-deep">
              ٥
            </p>
            <p className="text-xs text-espresso/70">تخصّصات · حِسٌّ واحد</p>
          </div>
        </div>
      </div>
    </section>
  );
}
