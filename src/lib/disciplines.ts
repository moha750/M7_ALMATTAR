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
  /** متغيّر لون النبضة الفرعية المعرّف في globals.css */
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
    color: "var(--color-craft-graphic)",
  },
  {
    slug: "editing",
    title: "مونتاج",
    tagline: "إيقاعٌ يمسك الأنفاس",
    icon: Clapperboard,
    color: "var(--color-craft-editing)",
  },
  {
    slug: "motion",
    title: "موشن جرافيك",
    tagline: "أفكارٌ تنبض وتتحرّك",
    icon: Film,
    color: "var(--color-craft-motion)",
  },
  {
    slug: "code",
    title: "برمجة",
    tagline: "تجارب رقمية تعمل بإتقان",
    icon: CodeXml,
    color: "var(--color-craft-code)",
  },
  {
    slug: "voice",
    title: "تعليق صوتي",
    tagline: "صوتٌ يصنع الثقة",
    icon: Mic,
    color: "var(--color-craft-voice)",
  },
];
