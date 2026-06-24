// بيانات تجريبية مؤقتة للتحقّق البصري من المرحلة ٣. تُزال عبر clean-demo.mjs.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const pub = (b, p) => `${base}/storage/v1/object/public/${b}/${p}`;

// 1) رفع صورة غلاف للتجربة
const img = readFileSync("public/brand/profile.jpg");
await sb.storage
  .from("images")
  .upload("demo/cover.jpg", img, { contentType: "image/jpeg", upsert: true });

// 2) توليد ملف صوت قصير (موجة جيبية) ورفعه لاختبار مشغّل الموجة
function makeWav(seconds = 3, freq = 440, rate = 8000) {
  const n = seconds * rate;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const env = Math.sin((Math.PI * i) / n); // غلاف ليبدو كموجة كلام
    const s = Math.sin((2 * Math.PI * freq * i) / rate) * env * 0.4 * 32767;
    buf.writeInt16LE(s | 0, 44 + i * 2);
  }
  return buf;
}
await sb.storage
  .from("audio")
  .upload("demo/voice.wav", makeWav(), {
    contentType: "audio/wav",
    upsert: true,
  });

// 3) تحديث الإعدادات (شوريل + تعليق صوتي + واتساب + تواصل)
await sb
  .from("site_settings")
  .update({
    showreel_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    voicereel_url: pub("audio", "demo/voice.wav"),
    whatsapp: "966500000000",
    socials: {
      instagram: "https://instagram.com/example",
      behance: "https://behance.net/example",
    },
  })
  .eq("id", 1);

// 4) مشاريع تجريبية منشورة
const projects = [
  {
    category: "graphic",
    title_ar: "تجريبي: هوية مقهى رِواق",
    slug: "demo-graphic",
    summary_ar: "هوية بصرية دافئة لمقهى مختصّ.",
    description_ar: "المشكلة: علامة باهتة.\nالعملية: بحث ومود بورد وشعار.\nالنتيجة: حضور بصري مميّز.",
    cover_path: "demo/cover.jpg",
    client_name: "مقهى رِواق",
    is_published: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    category: "editing",
    title_ar: "تجريبي: إعلان منتج",
    slug: "demo-editing",
    summary_ar: "مونتاج إعلان قصير بإيقاع سريع.",
    cover_path: "demo/cover.jpg",
    project_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    is_published: true,
    is_featured: false,
    sort_order: 2,
  },
  {
    category: "code",
    title_ar: "تجريبي: متجر إلكتروني",
    slug: "demo-code",
    summary_ar: "واجهة متجر سريعة بتجربة سلسة.",
    cover_path: "demo/cover.jpg",
    project_url: "https://example.com",
    is_published: true,
    is_featured: false,
    sort_order: 3,
  },
];
const { data: inserted, error: projErr } = await sb
  .from("projects")
  .insert(projects)
  .select("id,slug");
if (projErr) console.error("✗ projects insert:", projErr.message);

// وسائط لصفحة Case Study للمشروع الأول
const first = inserted?.find((p) => p.slug === "demo-graphic");
if (first) {
  await sb.from("project_media").insert([
    {
      project_id: first.id,
      kind: "image",
      storage_path: "demo/cover.jpg",
      alt_ar: "لقطة من المشروع",
      sort_order: 1,
    },
  ]);
}

// 5) رأي عميل
await sb.from("testimonials").insert({
  client_name: "تجريبي: سارة",
  client_role: "مديرة تسويق",
  quote_ar: "تعامل احترافي ونتيجة فاقت التوقّعات.",
  is_published: true,
  sort_order: 1,
});

console.log("✅ زُرعت البيانات التجريبية.");
