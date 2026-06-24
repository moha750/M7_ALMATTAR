import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { WorkGallery } from "@/components/sections/work-gallery";
import { Showreel } from "@/components/sections/showreel";
import { VoiceReel } from "@/components/sections/voice-reel";
import { ContactForm } from "@/components/sections/contact-form";
import { DISCIPLINES } from "@/lib/disciplines";
import {
  getCategories,
  getSiteSettings,
  getPublishedProjects,
  getTestimonials,
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

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "إنستغرام",
  x: "إكس",
  behance: "بيهانس",
  youtube: "يوتيوب",
  tiktok: "تيك توك",
  linkedin: "لينكدإن",
};

export default async function Home() {
  const [categories, settings, projects, testimonials] = await Promise.all([
    getCategories(),
    getSiteSettings(),
    getPublishedProjects(),
    getTestimonials(),
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

  const avatar = publicUrl(settings?.avatar_path) ?? "/brand/profile.jpg";
  const bio = settings?.bio_ar;
  const socials = (settings?.socials ?? {}) as Record<string, string>;
  const socialEntries = Object.entries(socials).filter(([, v]) => v);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero bio={bio} />

        {/* التخصصات الخمسة */}
        <Section id="services" eyebrow="ما أقدّمه" title="خمسُ حِرَف">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {crafts.map((d, i) => {
              const Icon = d.Icon;
              return (
                <li key={d.slug}>
                  <Reveal delay={i * 0.06}>
                    <div className="h-full rounded-2xl border border-espresso/10 bg-parchment p-6">
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
                      <p className="mt-1 text-sm text-espresso/70">
                        {d.tagline}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* معرض الأعمال */}
        <Section id="work" eyebrow="مختارات" title="معرض الأعمال">
          {projects.length > 0 ? (
            <WorkGallery
              projects={projects}
              crafts={crafts.map((c) => ({ slug: c.slug, title: c.title }))}
            />
          ) : (
            <p className="text-espresso/70">
              قريبًا — تُضاف الأعمال من لوحة التحكم لتظهر هنا تلقائيًّا.
            </p>
          )}
        </Section>

        {/* الشوريل */}
        <Section id="showreel" eyebrow="بانوراما" title="الشوريل" dark>
          <Showreel url={settings?.showreel_url} />
        </Section>

        {/* ريل التعليق الصوتي */}
        <Section id="voice" eyebrow="استمع" title="ريل التعليق الصوتي" dark>
          <VoiceReel url={settings?.voicereel_url} />
        </Section>

        {/* نبذة عنّي */}
        <Section id="about" eyebrow="من أنا" title="نبذة عنّي">
          <Reveal>
            <div className="grid items-center gap-8 sm:grid-cols-[260px_1fr]">
              <div className="relative mx-auto aspect-[3/4] w-52 overflow-hidden rounded-2xl border border-gold/30 bg-parchment sm:mx-0 sm:w-full">
                <Image
                  src={avatar}
                  alt={settings?.name_ar ?? "الصورة الشخصية"}
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
              <p className="text-lg leading-loose text-espresso/80">
                {bio ??
                  "مبدع خليجي متعدّد التخصصات: أصمّم، وأُحرّك، وأروي بصوتي. حِسٌّ إبداعي واحد يجمع التصميم الجرافيكي والمونتاج والموشن جرافيك والبرمجة والتعليق الصوتي."}
              </p>
            </div>
          </Reveal>
        </Section>

        {/* آراء العملاء */}
        {testimonials.length > 0 && (
          <Section id="testimonials" eyebrow="ثقة" title="آراء العملاء">
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <li key={t.id}>
                  <Reveal delay={i * 0.06}>
                    <figure className="h-full rounded-2xl border border-espresso/10 bg-parchment p-6">
                      <blockquote className="text-espresso/80">
                        “{t.quote_ar}”
                      </blockquote>
                      <figcaption className="mt-4 text-sm">
                        <span className="font-semibold">{t.client_name}</span>
                        {t.client_role && (
                          <span className="text-espresso/55">
                            {" "}
                            — {t.client_role}
                          </span>
                        )}
                      </figcaption>
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* تواصل */}
        <Section id="contact" eyebrow="لنبدأ" title="تواصل / اطلب خدمة">
          <div className="grid gap-10 lg:grid-cols-2">
            <ContactForm />
            <div className="space-y-6">
              <p className="text-espresso/70">
                عندك فكرة أو مشروع؟ راسلني عبر النموذج أو مباشرةً:
              </p>
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-espresso hover:text-gold-deep"
                >
                  <Mail className="h-5 w-5 text-gold-deep" />
                  <span dir="ltr">{settings.email}</span>
                </a>
              )}
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-espresso transition-transform hover:scale-[1.03]"
                >
                  <MessageCircle className="h-5 w-5" />
                  تواصل عبر واتساب
                </a>
              )}
              {socialEntries.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {socialEntries.map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-espresso/15 px-4 py-2 text-sm font-medium text-espresso/75 transition-colors hover:bg-espresso/5"
                    >
                      {SOCIAL_LABELS[key] ?? key}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
