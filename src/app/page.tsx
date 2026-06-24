import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { DISCIPLINES } from "@/lib/disciplines";
import {
  getCategories,
  getSiteSettings,
  getPublishedProjects,
} from "@/lib/queries";
import { resolveIcon } from "@/lib/icons";
import { publicUrl } from "@/lib/storage";
import type { LucideIcon } from "lucide-react";

type Craft = {
  slug: string;
  title: string;
  tagline: string;
  Icon: LucideIcon;
  color: string;
};

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

export default async function Home() {
  // قراءة من Supabase (مع تراجع آمن إلى البيانات الثابتة إن لم تتوفّر)
  const [categories, settings, projects] = await Promise.all([
    getCategories(),
    getSiteSettings(),
    getPublishedProjects(),
  ]);

  const crafts: Craft[] =
    categories.length > 0
      ? categories.map((c) => ({
          slug: c.slug,
          title: c.title_ar,
          tagline: c.description_ar ?? "",
          Icon: resolveIcon(c.icon),
          color: c.color ?? "var(--color-gold)",
        }))
      : DISCIPLINES.map((d) => ({
          slug: d.slug,
          title: d.title,
          tagline: d.tagline,
          Icon: d.icon,
          color: d.color,
        }));

  const craftLabel = (slug: string) =>
    crafts.find((c) => c.slug === slug)?.title ?? slug;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero bio={settings?.bio_ar} />

        <PlaceholderSection id="services" eyebrow="ما أقدّمه" title="خمسُ حِرَف">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {crafts.map((d) => {
              const Icon = d.Icon;
              return (
                <li
                  key={d.slug}
                  className="rounded-2xl border border-espresso/10 bg-parchment p-6"
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--pulse) 16%, transparent)",
                      ["--pulse" as string]: d.color,
                    }}
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
          {projects.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => {
                const cover = publicUrl(p.cover_path);
                const Wrapper = p.project_url ? "a" : "div";
                return (
                  <li key={p.id}>
                    <Wrapper
                      {...(p.project_url
                        ? {
                            href: p.project_url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                      className="group block overflow-hidden rounded-2xl border border-espresso/10 bg-parchment transition-shadow hover:shadow-lg"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                        {cover ? (
                          <Image
                            src={cover}
                            alt={p.title_ar}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-espresso/30">
                            بلا غلاف
                          </div>
                        )}
                        {p.is_featured && (
                          <span className="absolute end-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-espresso">
                            مميّز
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="font-[family-name:var(--font-tech)] text-xs font-medium tracking-wide text-gold-deep">
                          {craftLabel(p.category)}
                        </span>
                        <h3 className="mt-1.5 font-[family-name:var(--font-heading)] text-lg font-bold">
                          {p.title_ar}
                        </h3>
                        {p.summary_ar && (
                          <p className="mt-1 line-clamp-2 text-sm text-espresso/65">
                            {p.summary_ar}
                          </p>
                        )}
                      </div>
                    </Wrapper>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-espresso/70">
              قريبًا — تُضاف الأعمال من لوحة التحكم لتظهر هنا تلقائيًّا.
            </p>
          )}
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
            {settings?.bio_ar ??
              "قريبًا — قصة شخصية دافئة مع الصورة الكاملة بأسلوب يكشف النص تدريجيًا عند التمرير. (المرحلة ٣)"}
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
