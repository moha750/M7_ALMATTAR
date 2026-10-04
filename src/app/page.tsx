import { Shell } from "@/components/site/shell";
import { Hero } from "@/components/site/hero";
import { Featured } from "@/components/site/featured";
import { Contact } from "@/components/site/contact";
import { countBySkill } from "@/components/site/work-grid";
import { getJourneys, getSiteSettings, pickFeatured } from "@/lib/queries";
import { publicUrl } from "@/lib/storage";

// ثلاثة أقسام: أنا ومهاراتي ← أعمال مختارة ← تواصل معي
export default async function Home() {
  const [settings, works] = await Promise.all([getSiteSettings(), getJourneys()]);

  return (
    <Shell>
      <Hero counts={countBySkill(works)} total={works.length} voiceSrc={publicUrl(settings?.voice_path ?? null, "audio")} />
      <Featured works={pickFeatured(works, 3)} total={works.length} />
      <Contact email={settings?.email ?? null} socials={(settings?.socials ?? {}) as Record<string, string>} />
    </Shell>
  );
}
