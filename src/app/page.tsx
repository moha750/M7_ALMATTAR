import { PageShell } from "@/components/site/page-shell";
import { Hero } from "@/components/site/hero";
import { Journeys } from "@/components/site/journeys";
import { Contact } from "@/components/site/contact";
import { countBySkill } from "@/components/site/work-archive";
import { getJourneys, getSiteSettings, getSkills, pickFeatured } from "@/lib/queries";
import { publicUrl } from "@/lib/storage";

// ثلاثة أقسام فقط: أنا ومهاراتي ← أبرز أعمالي ← تواصل معي
export default async function Home() {
  const [settings, journeys, skills] = await Promise.all([
    getSiteSettings(),
    getJourneys(),
    getSkills(),
  ]);

  const learning =
    settings?.learning_now_ar ?? skills.find((s) => s.is_learning)?.title_ar ?? null;

  return (
    <PageShell>
      <Hero
        counts={countBySkill(journeys)}
        learning={learning}
        voiceSrc={publicUrl(settings?.voice_path ?? null, "audio")}
      />
      <Journeys journeys={pickFeatured(journeys, 3)} total={journeys.length} />
      <Contact
        email={settings?.email ?? null}
        socials={(settings?.socials ?? {}) as Record<string, string>}
      />
    </PageShell>
  );
}
