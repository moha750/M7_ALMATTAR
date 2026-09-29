-- ============================================================================
-- 0003 — إعادة التصميم «أعيش الفكرة / تحليق»
-- رحلة الفكرة لكل مشروع، المهارات، المسيرة، النبذة والصوت، ونيّة الرسالة.
-- آمنة لإعادة التشغيل.
-- ============================================================================

-- رحلة الفكرة
alter table public.projects add column if not exists subtitle_ar  text;
alter table public.projects add column if not exists challenge_ar text;
alter table public.projects add column if not exists idea_ar      text;
alter table public.projects add column if not exists execution_ar text;
alter table public.projects add column if not exists roles_ar     text[] not null default '{}';
alter table public.projects add column if not exists sketch_path  text;
alter table public.projects add column if not exists video_url    text;

-- عنّي
alter table public.site_settings add column if not exists about_ar        text;
alter table public.site_settings add column if not exists voice_path      text;
alter table public.site_settings add column if not exists learning_now_ar text;

-- نيّة الرسالة (مشروع / وظيفة / تعاون / شيء آخر)
alter table public.contact_messages add column if not exists intent text;

-- المهارات
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  title_ar    text not null,
  title_en    text,
  is_learning boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- المسيرة
create table if not exists public.experiences (
  id             uuid primary key default gen_random_uuid(),
  org_ar         text not null,
  org_en         text,
  role_ar        text,
  role_en        text,
  description_ar text,
  description_en text,
  period         text,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

alter table public.skills      enable row level security;
alter table public.experiences enable row level security;

drop policy if exists skills_read  on public.skills;
create policy skills_read  on public.skills for select using (true);
drop policy if exists skills_admin on public.skills;
create policy skills_admin on public.skills for all
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists experiences_read  on public.experiences;
create policy experiences_read  on public.experiences for select using (true);
drop policy if exists experiences_admin on public.experiences;
create policy experiences_admin on public.experiences for all
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ----------------------------------------------------------------------------
-- محتوى أولي: الأعمال المعروفة (دربك خضر مسودة غير منشورة حتى تكتمل)
-- ----------------------------------------------------------------------------
insert into public.projects
  (slug, title_ar, category, subtitle_ar, summary_ar, challenge_ar, idea_ar, execution_ar, roles_ar, is_published, is_featured, sort_order)
values
  ('خلف-الأبواب', 'خلف الأبواب', 'editing',
   'حملة «ما فاتك شي» لنادي أدِيب',
   'لقاء تلفزيوني ساخر ضيفه باب، لحملة التسجيل المفتوح طوال السنة.',
   'فتح النادي التسجيل طوال السنة. كيف نقول للطلاب إن الباب لم يُغلق، بطريقة لا ينسونها؟',
   'لقاء تلفزيوني ساخر، ضيفه الباب نفسه. ومن أدرى منه بأنه ما زال مفتوحًا؟',
   'ممثل حقيقي يؤدي الدور بصوته وحركته، ثم باب له أطراف مكانه عبر عشرين لقطة مولّدة بالذكاء الاصطناعي، وتنظيف دقيق في After Effects.',
   array['الفكرة','الإخراج','المونتاج','المؤثرات البصرية','الذكاء الاصطناعي'],
   true, true, 1),
  ('منصة-أديب', 'منصة أدِيب', 'code',
   'المنصة الرقمية لنادي أدِيب',
   'من موقع تعريفي إلى منصة شبه متكاملة.',
   null,
   'أن تُروى حكاية النادي بالتمرير في أربعة فصول، وأن يصير للنادي بيت رقمي: إذاعة، وأرشيف، وهوية تتحرك.',
   'إذاعة وبودكاست بخلاصة RSS، وحكاية النادي في أربعة فصول سينمائية، وهوية حركية من الشعار المتحرك حتى شاشة التحميل.',
   array['التصميم','البرمجة','الهوية الحركية','Next.js','Supabase'],
   true, false, 2),
  ('دربك-خضر', 'دربك خضر', 'graphic',
   null, null, null, null, null, '{}', false, false, 3)
on conflict (slug) do nothing;

update public.site_settings
set about_ar = coalesce(about_ar,
  'أنا محمد المطر، من الأحساء. أدرس الإعلام في جامعة الملك فيصل، وأعمل على أفكار تتجاوز القاعة: في نادي أدِيب، وفي وزارة الموارد البشرية والتنمية الاجتماعية، وفي مشاريعي المستقلة. لا أحصي مهاراتي، فكل فكرة جديدة تضيف إليها واحدة.'),
    title_ar = 'أعيش الفكرة'
where id = 1;
