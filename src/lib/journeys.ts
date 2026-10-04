import type { Discipline, Project } from "@/lib/database.types";
import { publicUrl } from "@/lib/storage";

// «عمل» كما يُعرض في الواجهة — من قاعدة البيانات أو من البدائل أدناه.

export type Journey = {
  slug: string;
  href: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  challenge: string | null;
  idea: string | null;
  execution: string | null;
  roles: string[];
  cover: string | null;
  /** صورة المسودة الحقيقية — تظهر مع النتيجة في صفحة العمل */
  sketch: string | null;
  videoUrl: string | null;
  projectUrl: string | null;
  /** محتوى ناقص ينتظر معلومات */
  placeholder: boolean;
  /** المهارة الأساسية */
  category: Discipline;
  /** كل المهارات التي يظهر فيها العمل، والأساسية أولها */
  skills: Discipline[];
  featured: boolean;
};

/** نص ينتظر معلومة من محمد ([بين أقواس]) — لا يظهر للزوار. */
export function isPending(v?: string | null): boolean {
  return !v || v.trim().startsWith("[");
}

/** الأساسية أولًا ثم البقية بلا تكرار. */
function withPrimary(primary: Discipline, skills?: Discipline[] | null): Discipline[] {
  return [primary, ...(skills ?? []).filter((s) => s !== primary)];
}

/** يحوّل صف مشروع من قاعدة البيانات إلى رحلة. */
export function journeyFromProject(p: Project): Journey {
  const fb = FALLBACK_JOURNEYS.find((f) => f.slug === p.slug);
  return {
    slug: p.slug,
    href: `/work/${encodeURIComponent(p.slug)}`,
    title: p.title_ar,
    subtitle: p.subtitle_ar ?? p.client_name ?? fb?.subtitle ?? null,
    summary: p.summary_ar ?? fb?.summary ?? null,
    challenge: p.challenge_ar ?? fb?.challenge ?? null,
    idea: p.idea_ar ?? fb?.idea ?? null,
    execution: p.execution_ar ?? fb?.execution ?? null,
    roles: p.roles_ar?.length ? p.roles_ar : (fb?.roles ?? []),
    cover: publicUrl(p.cover_path),
    sketch: publicUrl(p.sketch_path ?? null),
    videoUrl: p.video_url ?? null,
    projectUrl: p.project_url,
    placeholder: false,
    category: p.category,
    skills: withPrimary(p.category, p.skills),
    featured: p.is_featured,
  };
}

// ---------------------------------------------------------------------------
// أعمال افتراضية — تظهر حتى تُضاف الأعمال إلى قاعدة البيانات
// ---------------------------------------------------------------------------
const RAW: Array<Omit<Journey, "href">> = [
  {
    slug: "خلف-الأبواب",
    title: "خلف الأبواب",
    subtitle: "حملة «ما فاتك شي» لنادي أدِيب",
    summary: "لقاء تلفزيوني ساخر ضيفه باب، لحملة التسجيل المفتوح طوال السنة.",
    challenge:
      "فتح النادي التسجيل طوال السنة. كيف نقول للطلاب إن الباب لم يُغلق، بطريقة لا ينسونها؟",
    idea: "لقاء تلفزيوني ساخر، ضيفه الباب نفسه. ومن أدرى منه بأنه ما زال مفتوحًا؟",
    execution:
      "ممثل حقيقي يؤدي الدور بصوته وحركته، ثم باب له أطراف مكانه عبر عشرين لقطة مولّدة بالذكاء الاصطناعي، وتنظيف دقيق في After Effects.",
    roles: ["الفكرة", "الإخراج", "المونتاج", "المؤثرات البصرية", "الذكاء الاصطناعي"],
    cover: null,
    sketch: null,
    videoUrl: null,
    projectUrl: null,
    placeholder: false,
    category: "editing",
    skills: ["editing", "motion"],
    featured: true,
  },
  {
    slug: "منصة-أديب",
    title: "منصة أدِيب",
    subtitle: "المنصة الرقمية لنادي أدِيب",
    summary: "من موقع تعريفي إلى منصة شبه متكاملة.",
    challenge: "[ما المشكلة التي بدأت منها المنصة؟]",
    idea: "أن تُروى حكاية النادي بالتمرير في أربعة فصول، وأن يصير للنادي بيت رقمي: إذاعة، وأرشيف، وهوية تتحرك.",
    execution:
      "إذاعة وبودكاست بخلاصة RSS، وحكاية النادي في أربعة فصول سينمائية، وهوية حركية من الشعار المتحرك حتى شاشة التحميل.",
    roles: ["التصميم", "البرمجة", "الهوية الحركية", "Next.js", "Supabase"],
    cover: null,
    sketch: null,
    videoUrl: null,
    projectUrl: null,
    placeholder: false,
    category: "code",
    skills: ["code", "graphic", "motion"],
    featured: true,
  },
  {
    slug: "دربك-خضر",
    title: "دربك خضر",
    subtitle: "[وصف قصير]",
    summary: "[سطر يلخص الفكرة]",
    challenge: "[التحدي]",
    idea: "[الفكرة]",
    execution: "[التنفيذ]",
    roles: ["[دورك]"],
    cover: null,
    sketch: null,
    videoUrl: null,
    projectUrl: null,
    placeholder: true,
    category: "graphic",
    skills: ["graphic"],
    featured: false,
  },
];

export const FALLBACK_JOURNEYS: Journey[] = RAW.map((r) => ({
  ...r,
  href: `/work/${encodeURIComponent(r.slug)}`,
}));
