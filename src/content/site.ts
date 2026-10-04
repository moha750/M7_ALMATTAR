// نصوص الواجهة — قصيرة عن قصد: الزائر يأخذ نظرة، لا يقرأ جريدة.
import type { Discipline } from "@/lib/database.types";

export const HERO = {
  name: "محمد المطر",
  headline: "أعيش الفكرة",
  /** بكلمات محمد */
  line: "أغلب الأفكار تبدأ مني، والباقي أحلّق به حتى ينضج.",
  place: "الأحساء، السعودية",
};

export const CONTACT = {
  title: "عندك فكرة؟",
  line: "أرسلها، ولنعشها معًا.",
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
  graphic: "شخصيات وهويات وكتيّبات، كلها تبدأ بسؤال واحد: كيف تُرى الفكرة؟",
  editing: "إيقاع يمسك المشاهد من أول لقطة حتى آخرها.",
  motion: "حين تحتاج الفكرة أن تتحرك حتى تُفهم.",
  code: "منصات وتطبيقات ولعبة، أبنيها من الفكرة حتى آخر سطر.",
  voice: "صوت يروي الحكاية، فيتخيلها المستمع قبل أن يراها.",
};

export const CONTACT_INTENTS = ["مشروع", "وظيفة", "تعاون", "شيء آخر"] as const;
