// رابط عام لملف في التخزين (الأقسام عامة، فالرابط ثابت ولا يحتاج عميلًا).
export function publicUrl(
  path?: string | null,
  bucket: "images" | "audio" = "images",
): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
