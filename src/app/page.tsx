import { PageShell } from "@/components/site/page-shell";
import { Hero } from "@/components/site/hero";
import { Journeys } from "@/components/site/journeys";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { countBySkill } from "@/components/site/work-archive";
import {
  getJourneys,
  getSiteSettings,
  getSkills,
  pickFeatured,
} from "@/lib/queries";
import { publicUrl } from "@/lib/storage";
import {
  ABOUT_FALLBACK,
  LEARNING_FALLBACK,
  SKILLS_FALLBACK,
} from "@/content/site";

export default async function Home() {
  const [settings, journeys, skills] = await Promise.all([
    getSiteSettings(),
    getJourneys(),
    getSkills(),
  ]);

  const regularSkills = skills.filter((s) => !s.is_learning).map((s) => s.title_ar);
  const learning =
    settings?.learning_now_ar ??
    skills.find((s) => s.is_learning)?.title_ar ??
    LEARNING_FALLBACK;

  return (
    <PageShell>
      <Hero />
      <Journeys journeys={pickFeatured(journeys)} total={journeys.length} counts={countBySkill(journeys)} />
      <About
        bio={settings?.about_ar ?? ABOUT_FALLBACK}
        skills={regularSkills.length > 0 ? regularSkills : SKILLS_FALLBACK}
        learning={learning}
        voiceSrc={publicUrl(settings?.voice_path ?? null, "audio")}
      />
      <Contact
        email={settings?.email ?? null}
        socials={(settings?.socials ?? {}) as Record<string, string>}
      />
    </PageShell>
  );
}
