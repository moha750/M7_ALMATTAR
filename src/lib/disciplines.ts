import {
  PenTool,
  Clapperboard,
  Film,
  CodeXml,
  Mic,
  type LucideIcon,
} from "lucide-react";

export type DisciplineSlug =
  | "graphic"
  | "editing"
  | "motion"
  | "code"
  | "voice";

export type Discipline = {
  slug: DisciplineSlug;
  title: string;
  tagline: string;
  icon: LucideIcon;
  /** لون المهارة (متغيّر CSS من globals.css) */
  color: string;
};

/**
 * التخصصات الخمسة. هذه نسخة ثابتة مبدئية لمرحلة التهيئة؛
 * في المرحلة الثانية ستُقرأ من جدول `categories` في Supabase.
 */
export const DISCIPLINES: Discipline[] = [
  {
    slug: "graphic",
    title: "تصميم جرافيك",
    tagline: "هويات بصرية تُروى بلا كلمات",
    icon: PenTool,
    color: "var(--color-s-graphic)",
  },
  {
    slug: "editing",
    title: "مونتاج",
    tagline: "إيقاعٌ يمسك الأنفاس",
    icon: Clapperboard,
    color: "var(--color-s-editing)",
  },
  {
    slug: "motion",
    title: "موشن جرافيك",
    tagline: "أفكارٌ تنبض وتتحرّك",
    icon: Film,
    color: "var(--color-s-motion)",
  },
  {
    slug: "code",
    title: "برمجة",
    tagline: "تجارب رقمية تعمل بإتقان",
    icon: CodeXml,
    color: "var(--color-s-code)",
  },
  {
    slug: "voice",
    title: "تعليق صوتي",
    tagline: "صوتٌ يصنع الثقة",
    icon: Mic,
    color: "var(--color-s-voice)",
  },
];

const BY_SLUG = new Map(DISCIPLINES.map((d) => [d.slug, d]));

export function isSkill(x: string): x is DisciplineSlug {
  return BY_SLUG.has(x as DisciplineSlug);
}

export function skillTitle(slug: string): string {
  return BY_SLUG.get(slug as DisciplineSlug)?.title ?? "";
}

export function skillHref(slug: DisciplineSlug): string {
  return `/skills/${slug}`;
}
