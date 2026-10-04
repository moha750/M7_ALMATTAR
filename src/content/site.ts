// نصوص الواجهة — قصيرة وواضحة.
import type { Discipline } from "@/lib/database.types";

export const HERO = {
  name: "محمد المطر",
  status: "متاح لفرص جديدة · الأحساء",
  /** العنوان سطرًا سطرًا؛ الأخير بالذهبي */
  lines: ["أصمّم.", "وأُكمل", "الباقي."],
  lead: "مصمم جرافيك. أحوّل الفكرة إلى هوية، وفيديو، وحركة، وموقع، وصوت. بيدٍ واحدة.",
  badge: "مصمم · مخرج · محرّك · مطوّر · صوت · ",
};

/** جهات عملت لها — شريط متحرك تحت البطل */
export const TRUST = ["نادي أدِيب", "مبادرة مساحة أثر", "أكاديمية أكسجين", "مقهى ألمى", "جامعة الملك فيصل"];

export const WORKS = {
  eyebrow: "أعمال مختارة",
  title: "شغلٌ يتكلم عني.",
};

export const CONTACT = {
  eyebrow: "تواصل معي",
  title: ["عندك مشروع؟", "لنبدأه."],
  line: "وظيفة، أو تعاون، أو فكرة ما زالت على الورق. أرسلها وأرد عليك.",
};

export const SOCIAL_LABELS: Record<string, string> = {
  x: "إكس",
  instagram: "إنستغرام",
  linkedin: "لينكدإن",
  youtube: "يوتيوب",
  behance: "بيهانس",
  tiktok: "تيك توك",
};

/** سطر تعريفي لكل مهارة في صفحتها (/skills/…). */
export const SKILL_INTROS: Record<Discipline, string> = {
  graphic: "هويات، وشخصيات، ومطبوعات.",
  editing: "قصص تُروى باللقطة والإيقاع.",
  motion: "تصميم يتحرّك.",
  code: "مواقع، وتطبيقات، وألعاب.",
  voice: "صوتٌ يحمل الحكاية.",
};

export const CONTACT_INTENTS = ["مشروع", "وظيفة", "تعاون", "شيء آخر"] as const;
