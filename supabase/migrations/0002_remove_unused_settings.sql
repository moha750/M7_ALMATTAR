-- ============================================================================
-- 0002 — إزالة أعمدة الأقسام المحذوفة من إعدادات الموقع
-- الأقسام: بانوراما (الشوريل)، استمع (ريل التعليق الصوتي)، من أنا (النبذة/الصورة).
-- آمن للتشغيل المتكرّر، ويُطبَّق على قواعد البيانات التي نُفِّذ عليها 0001 سابقًا.
-- تحذير: drop column يحذف أي قيم مخزّنة في هذه الأعمدة نهائيًّا.
-- ============================================================================
alter table public.site_settings drop column if exists bio_ar;
alter table public.site_settings drop column if exists avatar_path;
alter table public.site_settings drop column if exists showreel_url;
alter table public.site_settings drop column if exists voicereel_url;
