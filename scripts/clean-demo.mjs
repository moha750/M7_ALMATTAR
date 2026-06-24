// إزالة كل البيانات التجريبية وإرجاع الإعدادات لحالتها النظيفة.
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

await sb.from("projects").delete().like("title_ar", "تجريبي:%");
await sb.from("testimonials").delete().like("client_name", "تجريبي:%");
await sb
  .from("site_settings")
  .update({
    showreel_url: null,
    voicereel_url: null,
    whatsapp: null,
    socials: {},
  })
  .eq("id", 1);

// إزالة ملفات التجربة من التخزين
const imgs = await sb.storage.from("images").list("demo");
if (imgs.data?.length)
  await sb.storage
    .from("images")
    .remove(imgs.data.map((f) => `demo/${f.name}`));
const auds = await sb.storage.from("audio").list("demo");
if (auds.data?.length)
  await sb.storage.from("audio").remove(auds.data.map((f) => `demo/${f.name}`));

console.log("🧹 أُزيلت البيانات التجريبية وأُعيدت الإعدادات للنظافة.");
