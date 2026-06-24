// تحقّق من سلامة القاعدة وسلوك RLS. لا يطبع أي أسرار.
import pg from "pg";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

const tables = await client.query(
  `select table_name from information_schema.tables
   where table_schema='public' order by table_name`,
);
console.log("الجداول:", tables.rows.map((r) => r.table_name).join("، "));

const counts = {};
for (const t of [
  "site_settings",
  "categories",
  "projects",
  "project_media",
  "services",
  "testimonials",
  "contact_messages",
]) {
  const r = await client.query(`select count(*)::int as c from public.${t}`);
  counts[t] = r.rows[0].c;
}
console.log("عدد الصفوف:", JSON.stringify(counts));

const rls = await client.query(
  `select relname, relrowsecurity from pg_class
   where relnamespace='public'::regnamespace and relkind='r'
   order by relname`,
);
console.log(
  "RLS مفعّل:",
  rls.rows.every((r) => r.relrowsecurity) ? "نعم على كل الجداول ✓" : "ناقص ✗",
);

const buckets = await client.query(
  `select id, public from storage.buckets order by id`,
);
console.log(
  "أقسام التخزين:",
  buckets.rows.map((r) => `${r.id}(public=${r.public})`).join("، "),
);

// --- سلوك RLS من منظور الزائر (anon) ---
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const cats = await sb.from("categories").select("slug").order("sort_order");
console.log(
  "[زائر] قراءة التخصصات:",
  cats.error ? `خطأ: ${cats.error.message}` : `${cats.data.length} تخصصات ✓`,
);

const msgs = await sb.from("contact_messages").select("*");
console.log(
  "[زائر] قراءة الرسائل (يجب أن تُمنع):",
  msgs.error ? `محجوب: ${msgs.error.message}` : `${msgs.data.length} صفوف مرئية`,
);

// مهم: نموذج التواصل يُدرج دون قراءة الصف (لا .select())، لأن الزائر لا يقرأ الرسائل.
const ins = await sb
  .from("contact_messages")
  .insert({ name: "اختبار", email: "test@example.com", message: "رسالة اختبار" });
console.log(
  "[زائر] إرسال رسالة تواصل (يجب أن ينجح):",
  ins.error ? `خطأ: ${ins.error.message}` : "نجح ✓",
);

// تنظيف رسائل الاختبار
await client.query(
  `delete from public.contact_messages where email in ('test@example.com','diag1@example.com','diag2@example.com')`,
);
console.log("نُظّفت رسائل الاختبار ✓");

await client.end();
console.log("\n✅ التحقق اكتمل.");
