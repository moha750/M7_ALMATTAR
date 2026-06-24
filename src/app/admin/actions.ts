"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Discipline } from "@/lib/database.types";

function slugify(s: string): string {
  const base = s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || crypto.randomUUID().slice(0, 8);
}

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}

// ---------------------------------------------------------------------------
// المصادقة
// ---------------------------------------------------------------------------
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// المشاريع
// ---------------------------------------------------------------------------
export async function saveProject(formData: FormData) {
  const id = str(formData, "id");
  const title_ar = str(formData, "title_ar");
  if (!title_ar) throw new Error("العنوان مطلوب");

  const fields = {
    title_ar,
    slug: str(formData, "slug") ?? slugify(title_ar),
    category: (str(formData, "category") ?? "graphic") as Discipline,
    summary_ar: str(formData, "summary_ar"),
    description_ar: str(formData, "description_ar"),
    client_name: str(formData, "client_name"),
    project_url: str(formData, "project_url"),
    is_published: bool(formData, "is_published"),
    is_featured: bool(formData, "is_featured"),
    sort_order: Number(str(formData, "sort_order") ?? "0") || 0,
  };

  const supabase = await createClient();

  let projectId = id;
  if (id) {
    const { error } = await supabase.from("projects").update(fields).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert(fields)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    projectId = data.id;
  }

  // رفع صورة الغلاف إن وُجدت
  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0 && projectId) {
    const ext = (cover.name.split(".").pop() || "jpg").toLowerCase();
    const path = `projects/${projectId}/cover-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("images")
      .upload(path, cover, { contentType: cover.type, upsert: true });
    if (upErr) throw new Error("فشل رفع الصورة: " + upErr.message);
    const { error: setErr } = await supabase
      .from("projects")
      .update({ cover_path: path })
      .eq("id", projectId);
    if (setErr) throw new Error(setErr.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const id = str(formData, "id");
  if (!id) return;
  const supabase = await createClient();

  // حذف ملفات التخزين المرتبطة (أفضل جهد — الـ cascade لا يحذف الملفات)
  const { data: files } = await supabase.storage
    .from("images")
    .list(`projects/${id}`);
  if (files && files.length > 0) {
    await supabase.storage
      .from("images")
      .remove(files.map((f) => `projects/${id}/${f.name}`));
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function toggleProjectPublished(formData: FormData) {
  const id = str(formData, "id");
  const next = bool(formData, "next");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_published: next })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// إعدادات الموقع
// ---------------------------------------------------------------------------
export async function updateSettings(formData: FormData) {
  const socials: Record<string, string> = {};
  for (const k of ["instagram", "x", "behance", "youtube", "tiktok", "linkedin"]) {
    const v = str(formData, `social_${k}`);
    if (v) socials[k] = v;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      name_ar: str(formData, "name_ar") ?? "محمد بن إسماعيل",
      title_ar: str(formData, "title_ar"),
      bio_ar: str(formData, "bio_ar"),
      email: str(formData, "email"),
      whatsapp: str(formData, "whatsapp"),
      showreel_url: str(formData, "showreel_url"),
      voicereel_url: str(formData, "voicereel_url"),
      socials,
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// رسائل التواصل
// ---------------------------------------------------------------------------
export async function setMessageRead(formData: FormData) {
  const id = str(formData, "id");
  const next = bool(formData, "next");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: next })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  const id = str(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}
