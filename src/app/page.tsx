import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { DISCIPLINES } from "@/lib/disciplines";

/** قسم نائب مؤقت — يُستبدل بالمحتوى الكامل في المرحلة الثالثة */
function PlaceholderSection({
  id,
  eyebrow,
  title,
  children,
  dark = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`${dark ? "section-dark" : ""} scroll-mt-24 border-t border-espresso/5`}
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p
          className={`font-[family-name:var(--font-tech)] text-sm font-medium tracking-widest ${dark ? "text-gold" : "text-gold-deep"}`}
        >
          {eyebrow}
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />

        <PlaceholderSection id="services" eyebrow="ما أقدّمه" title="خمسُ حِرَف">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {DISCIPLINES.map((d) => {
              const Icon = d.icon;
              return (
                <li
                  key={d.slug}
                  className="rounded-2xl border border-espresso/10 bg-parchment p-6"
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "color-mix(in srgb, var(--pulse) 16%, transparent)", ["--pulse" as string]: d.color }}
                  >
                    <Icon className="h-5 w-5" style={{ color: d.color }} />
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-heading)] text-lg font-bold">
                    {d.title}
                  </h3>
                  <p className="mt-1 text-sm text-espresso/70">{d.tagline}</p>
                </li>
              );
            })}
          </ul>
        </PlaceholderSection>

        <PlaceholderSection id="work" eyebrow="مختارات" title="معرض الأعمال">
          <p className="text-espresso/70">
            قريبًا — شبكة أعمال قابلة للتصفية حسب التخصص، تُدار بالكامل من لوحة
            التحكم. (المرحلة ٣)
          </p>
        </PlaceholderSection>

        <PlaceholderSection
          id="showreel"
          eyebrow="بانوراما"
          title="الشوريل"
          dark
        >
          <p className="text-cream/70">
            قريبًا — فيديو ملخّص يبدأ وينتهي بالشعار الذهبي. (المرحلة ٣)
          </p>
        </PlaceholderSection>

        <PlaceholderSection
          id="voice"
          eyebrow="استمع"
          title="ريل التعليق الصوتي"
          dark
        >
          <p className="text-cream/70">
            قريبًا — مشغّل بموجة صوتية ذهبية وقائمة مقاطع بنبرات متنوعة. (المرحلة
            ٣)
          </p>
        </PlaceholderSection>

        <PlaceholderSection id="about" eyebrow="من أنا" title="نبذة عنّي">
          <p className="max-w-2xl text-espresso/70">
            قريبًا — قصة شخصية دافئة مع الصورة الكاملة بأسلوب يكشف النص تدريجيًا
            عند التمرير. (المرحلة ٣)
          </p>
        </PlaceholderSection>

        <PlaceholderSection
          id="contact"
          eyebrow="لنبدأ"
          title="تواصل / اطلب خدمة"
        >
          <p className="max-w-2xl text-espresso/70">
            قريبًا — نموذج تواصل يُرسل الرسائل إلى لوحة التحكم، مع زر واتساب مباشر
            وروابط التواصل. (المرحلة ٤)
          </p>
        </PlaceholderSection>
      </main>
      <SiteFooter />
    </>
  );
}
