import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Experience,
  Project,
  ProjectMedia,
  SiteSettings,
  Skill,
  Testimonial,
} from "@/lib/database.types";
import {
  FALLBACK_JOURNEYS,
  journeyFromProject,
  type Journey,
} from "@/lib/journeys";

/** التخصصات الخمسة من قاعدة البيانات (قراءة عامة عبر RLS). */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) {
    console.error("getCategories:", error.message);
    return [];
  }
  return data ?? [];
}

/** المشاريع المنشورة للعرض العام (المميّزة أولًا). */
export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getPublishedProjects:", error.message);
    return [];
  }
  return data ?? [];
}

/** إعدادات الموقع (الصف الوحيد). */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error("getSiteSettings:", error.message);
    return null;
  }
  return data;
}

/** مشروع منشور واحد عبر الـ slug (لصفحة Case Study).
 *  يطابق بصرف النظر عن تطبيع Unicode (NFC/NFD) لأنّ المتصفّح قد يمرّر الـ slug
 *  العربي بصيغة مختلفة عن المخزَّنة. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  // هذه النسخة من Next لا تفكّ ترميز معامل المسار تلقائيًّا، فنفكّه يدويًّا.
  let s = slug;
  try {
    s = decodeURIComponent(slug);
  } catch {
    /* slug غير مُرمَّز */
  }
  const supabase = await createClient();
  const candidates = [...new Set([s, s.normalize("NFC"), s.normalize("NFD")])];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .in("slug", candidates)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    console.error("getProjectBySlug:", error.message);
    return null;
  }
  return data;
}

/** وسائط مشروع مرتّبة. */
export async function getProjectMedia(
  projectId: string,
): Promise<ProjectMedia[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_media")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getProjectMedia:", error.message);
    return [];
  }
  return data ?? [];
}

/** آراء العملاء المنشورة. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getTestimonials:", error.message);
    return [];
  }
  return data ?? [];
}

/** المهارات (جدول 0003). يعيد [] إن لم يُطبَّق الترحيل بعد. */
export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data ?? [];
}

/** المسيرة (جدول 0003). يعيد [] إن لم يُطبَّق الترحيل بعد. */
export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data ?? [];
}

/** الرحلات المعروضة: من قاعدة البيانات، أو الافتراضية حين تكون فارغة. */
export async function getJourneys(): Promise<Journey[]> {
  const projects = await getPublishedProjects();
  if (projects.length === 0) return FALLBACK_JOURNEYS;
  return projects.map(journeyFromProject);
}

/** رحلة واحدة (صفحة العمل): من قاعدة البيانات، أو الافتراضية بالـ slug نفسه. */
export async function getJourneyBySlug(
  slug: string,
): Promise<{ journey: Journey; project: Project | null } | null> {
  const project = await getProjectBySlug(slug);
  if (project) return { journey: journeyFromProject(project), project };
  let s = slug;
  try {
    s = decodeURIComponent(slug);
  } catch {
    /* غير مُرمَّز */
  }
  const fb = FALLBACK_JOURNEYS.find(
    (j) => j.slug.normalize("NFC") === s.normalize("NFC"),
  );
  return fb ? { journey: fb, project: null } : null;
}
