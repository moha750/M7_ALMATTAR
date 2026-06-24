import { createClient } from "@/lib/supabase/server";
import type { Category, SiteSettings } from "@/lib/database.types";

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
