import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Project,
  ProjectMedia,
  SiteSettings,
  Testimonial,
} from "@/lib/database.types";

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

/** مشروع منشور واحد عبر الـ slug (لصفحة Case Study). */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
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
