import { PageShell } from "@/components/site/page-shell";
import { Hero } from "@/components/site/hero";
import { Journeys } from "@/components/site/journeys";
import { About } from "@/components/site/about";
import { Career } from "@/components/site/career";
import { Contact } from "@/components/site/contact";
import {
  getExperiences,
  getJourneys,
  getSiteSettings,
  getSkills,
  pickFeatured,
} from "@/lib/queries";
import { publicUrl } from "@/lib/storage";
import {
  ABOUT_FALLBACK,
  EXPERIENCES_FALLBACK,
  LEARNING_FALLBACK,
  SKILLS_FALLBACK,
} from "@/content/site";

export default async function Home() {
  const [settings, journeys, skills, experiences] = await Promise.all([
    getSiteSettings(),
    getJourneys(),
    getSkills(),
    getExperiences(),
  ]);

  const regularSkills = skills.filter((s) => !s.is_learning).map((s) => s.title_ar);
  const learning =
    settings?.learning_now_ar ??
    skills.find((s) => s.is_learning)?.title_ar ??
    LEARNING_FALLBACK;

  const career =
    experiences.length > 0
      ? experiences.map((e) => ({
          period: e.period ?? "",
          org: e.org_ar,
          role: e.role_ar,
          description: e.description_ar ?? "",
        }))
      : EXPERIENCES_FALLBACK;

  return (
    <PageShell>
      <Hero />
      <Journeys journeys={pickFeatured(journeys)} total={journeys.length} />
      <About
        bio={settings?.about_ar ?? ABOUT_FALLBACK}
        skills={regularSkills.length > 0 ? regularSkills : SKILLS_FALLBACK}
        learning={learning}
        voiceSrc={publicUrl(settings?.voice_path ?? null, "audio")}
      />
      <Career items={career} cvUrl={settings?.cv_url ?? null} />
      <Contact
        email={settings?.email ?? null}
        socials={(settings?.socials ?? {}) as Record<string, string>}
      />
    </PageShell>
  );
}
