import type { Project } from "@/lib/database.types";
import { publicUrl } from "@/lib/storage";

// «رحلة» = عمل يُعرض من المسودة إلى النتيجة.

export type StoryFrame = { label: string; kind: "person" | "door" };

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
  sketch: string | null;
  videoUrl: string | null;
  projectUrl: string | null;
  /** رسم بديل حين لا توجد صورة للنتيجة */
  art: "door" | "chapters" | null;
  /** لوحة قصة بديلة حين لا توجد صورة للمسودة */
  storyboard: StoryFrame[] | null;
  sketchNote: string | null;
  /** عبارة الجسر بين المسودة والنتيجة */
  bridge: string | null;
  /** محتوى ناقص ينتظر معلومات */
  placeholder: boolean;
  category: string;
  featured: boolean;
};

type Extras = Pick<Journey, "art" | "storyboard" | "sketchNote" | "bridge">;

// لمسات تصميمية لكل رحلة (مستقلة عن قاعدة البيانات)
const EXTRAS: Record<string, Partial<Extras>> = {
  "خلف-الأبواب": {
    art: "door",
    storyboard: [
      { label: "المذيع", kind: "person" },
      { label: "المراسل", kind: "person" },
      { label: "الضيف: باب!", kind: "door" },
    ],
    sketchNote: "ماذا لو كان الضيف بابًا؟",
    bridge: "٢٠ لقطة لاحقًا",
  },
  "منصة-أديب": {
    art: "chapters",
    sketchNote: "أربعة فصول للحكاية",
    bridge: "من فكرة إلى منصة",
  },
};

export const ADEEB_CHAPTERS = [
  "بدء الحكاية",
  "حكاية تتناقلها الألسن",
  "ذروة الحكاية",
  "حكاية تجاوزت الأسوار",
];

function withExtras(j: Omit<Journey, keyof Extras> & Partial<Extras>): Journey {
  const ex = EXTRAS[j.slug] ?? {};
  return {
    art: j.art ?? ex.art ?? null,
    storyboard: j.storyboard ?? ex.storyboard ?? null,
    sketchNote: j.sketchNote ?? ex.sketchNote ?? null,
    bridge: j.bridge ?? ex.bridge ?? null,
    ...j,
  } as Journey;
}

/** يحوّل صف مشروع من قاعدة البيانات إلى رحلة. */
export function journeyFromProject(p: Project): Journey {
  const fb = FALLBACK_JOURNEYS.find((f) => f.slug === p.slug);
  return withExtras({
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
    featured: p.is_featured,
  });
}

// ---------------------------------------------------------------------------
// رحلات افتراضية — تظهر حتى تُضاف الأعمال إلى قاعدة البيانات
// ---------------------------------------------------------------------------
const RAW: Array<Omit<Journey, keyof Extras | "href">> = [
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
    featured: false,
  },
];

export const FALLBACK_JOURNEYS: Journey[] = RAW.map((r) =>
  withExtras({ ...r, href: `/work/${encodeURIComponent(r.slug)}` }),
);
