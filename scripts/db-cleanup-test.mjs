// يحذف أي مشاريع اختبارية (عنوانها يبدأ بـ "مشروع تجريبي") مع ملفاتها في التخزين.
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const { data: rows } = await sb
  .from("projects")
  .select("id,title_ar")
  .like("title_ar", "مشروع تجريبي%");

for (const r of rows ?? []) {
  const { data: files } = await sb.storage
    .from("images")
    .list(`projects/${r.id}`);
  if (files?.length) {
    await sb.storage
      .from("images")
      .remove(files.map((f) => `projects/${r.id}/${f.name}`));
  }
}

const { error } = await sb
  .from("projects")
  .delete()
  .like("title_ar", "مشروع تجريبي%");

console.log(
  error ? `خطأ: ${error.message}` : `حُذف ${rows?.length ?? 0} مشروع اختباري ✓`,
);
