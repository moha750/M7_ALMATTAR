-- ============================================================================
-- بيانات أولية (Seed) — آمنة لإعادة التشغيل
-- ============================================================================

-- التصنيفات الخمسة (الأيقونات بأسماء lucide، الألوان من نظام التصميم)
insert into public.categories (slug, title_ar, description_ar, icon, color, sort_order) values
  ('graphic','تصميم جرافيك','هويات بصرية تُروى بلا كلمات','Palette',  '#D2A45C', 1),
  ('editing','مونتاج',       'إيقاعٌ يمسك الأنفاس',        'Film',     '#C0703C', 2),
  ('motion', 'موشن جرافيك',  'أفكارٌ تنبض وتتحرّك',        'Sparkles', '#D98E44', 3),
  ('code',   'برمجة',        'تجارب رقمية تعمل بإتقان',     'Code',     '#7C8A6A', 4),
  ('voice',  'تعليق صوتي',   'صوتٌ يصنع الثقة',            'Mic',      '#A8744F', 5)
on conflict (slug) do update set
  title_ar       = excluded.title_ar,
  description_ar = excluded.description_ar,
  icon           = excluded.icon,
  color          = excluded.color,
  sort_order     = excluded.sort_order;

-- إعدادات الموقع (الصف الوحيد)
insert into public.site_settings (id, name_ar, title_ar, email, socials)
values (
  1,
  'محمد المطر',
  'أعيش الفكرة',
  'mohammad.bin.ismael@gmail.com',
  '{}'::jsonb
)
on conflict (id) do nothing;

-- خدمات افتتاحية (يمكن تعديلها لاحقًا من لوحة التحكم)
insert into public.services (category, title_ar, description_ar, sort_order)
select * from (values
  ('graphic'::public.discipline, 'هوية بصرية وشعارات', 'بناء هوية متكاملة: شعار، ألوان، خطوط، ودليل استخدام.', 1),
  ('editing'::public.discipline, 'مونتاج فيديو',        'قصّ وإيقاع وتصحيح ألوان لمحتوى يأسر المشاهد.',          2),
  ('motion'::public.discipline,  'موشن جرافيك',         'رسوم متحركة وتحريك شعارات وإنفوجرافيك متحرّك.',         3),
  ('code'::public.discipline,    'مواقع وتطبيقات',      'واجهات حديثة سريعة بتجربة مستخدم متقنة.',               4),
  ('voice'::public.discipline,   'تعليق صوتي',          'تعليق احترافي بنبرات متعددة للإعلانات والمحتوى.',       5)
) as v(category, title_ar, description_ar, sort_order)
where not exists (select 1 from public.services);
