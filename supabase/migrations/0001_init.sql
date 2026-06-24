-- ============================================================================
-- Migration 0001 — البنية الأساسية لبورتفوليو محمد بن إسماعيل
-- آمنة لإعادة التشغيل (idempotent).
-- ============================================================================

create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- الأنواع (Enums)
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.discipline as enum ('graphic','editing','motion','code','voice');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.media_kind as enum ('image','video','audio','external_link');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- الدوال المساعدة
-- ----------------------------------------------------------------------------

-- تحديث الطابع الزمني updated_at تلقائيًّا
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- فحص ما إذا كان الطلب صادرًا من أدمن (الدور في app_metadata من الـ JWT)
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce((auth.jwt() #>> '{app_metadata,role}') = 'admin', false);
$$;

-- ============================================================================
-- الجداول
-- ============================================================================

-- إعدادات الموقع (صف واحد فقط)
create table if not exists public.site_settings (
  id            smallint primary key default 1,
  name_ar       text not null default 'محمد بن إسماعيل',
  title_ar      text default 'مُبدِعٌ واحد، خمسُ حِرَف',
  bio_ar        text,
  avatar_path   text,
  email         text,
  whatsapp      text,
  socials       jsonb not null default '{}'::jsonb,
  showreel_url  text,
  voicereel_url text,
  cv_url        text,
  updated_at    timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- التصنيفات (التخصصات الخمسة)
create table if not exists public.categories (
  id             uuid primary key default gen_random_uuid(),
  slug           public.discipline not null unique,
  title_ar       text not null,
  description_ar text,
  icon           text,
  color          text,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

-- المشاريع (الكيان الرئيسي)
create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  category       public.discipline not null,
  title_ar       text not null,
  slug           text not null unique,
  summary_ar     text,
  description_ar text,
  cover_path     text,
  client_name    text,
  project_url    text,
  is_published   boolean not null default false,
  is_featured    boolean not null default false,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists projects_category_idx  on public.projects (category);
create index if not exists projects_published_idx on public.projects (is_published);
create index if not exists projects_sort_idx       on public.projects (sort_order);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- وسائط المشاريع (1 إلى كثير)
create table if not exists public.project_media (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references public.projects(id) on delete cascade,
  kind             public.media_kind not null,
  storage_path     text,
  external_url     text,
  alt_ar           text,
  duration_seconds int,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  constraint project_media_source_chk
    check (storage_path is not null or external_url is not null)
);
create index if not exists project_media_project_idx on public.project_media (project_id);

-- الخدمات (وصف ما يقدّمه لكل تخصص)
create table if not exists public.services (
  id             uuid primary key default gen_random_uuid(),
  category       public.discipline not null,
  title_ar       text not null,
  description_ar text,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

-- آراء العملاء
create table if not exists public.testimonials (
  id               uuid primary key default gen_random_uuid(),
  client_name      text not null,
  client_role      text,
  client_logo_path text,
  quote_ar         text not null,
  is_published     boolean not null default true,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now()
);

-- رسائل التواصل
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- المبدأ: قراءة عامة للمحتوى المنشور، وكتابة/قراءة كاملة للأدمن فقط.
-- ============================================================================
alter table public.site_settings    enable row level security;
alter table public.categories       enable row level security;
alter table public.projects         enable row level security;
alter table public.project_media    enable row level security;
alter table public.services         enable row level security;
alter table public.testimonials     enable row level security;
alter table public.contact_messages enable row level security;

-- site_settings
drop policy if exists site_settings_read  on public.site_settings;
create policy site_settings_read  on public.site_settings for select using (true);
drop policy if exists site_settings_admin on public.site_settings;
create policy site_settings_admin on public.site_settings for all
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- categories
drop policy if exists categories_read  on public.categories;
create policy categories_read  on public.categories for select using (true);
drop policy if exists categories_admin on public.categories;
create policy categories_admin on public.categories for all
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- projects: المنشور للجميع + كل شيء للأدمن
drop policy if exists projects_read_published on public.projects;
create policy projects_read_published on public.projects for select
  using (is_published or (select public.is_admin()));
drop policy if exists projects_admin on public.projects;
create policy projects_admin on public.projects for all
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- project_media: مرئية إن كان المشروع منشورًا (أو أدمن)
drop policy if exists project_media_read on public.project_media;
create policy project_media_read on public.project_media for select
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.projects p
      where p.id = project_media.project_id and p.is_published
    )
  );
drop policy if exists project_media_admin on public.project_media;
create policy project_media_admin on public.project_media for all
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- services
drop policy if exists services_read  on public.services;
create policy services_read  on public.services for select using (true);
drop policy if exists services_admin on public.services;
create policy services_admin on public.services for all
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- testimonials
drop policy if exists testimonials_read  on public.testimonials;
create policy testimonials_read  on public.testimonials for select
  using (is_published or (select public.is_admin()));
drop policy if exists testimonials_admin on public.testimonials;
create policy testimonials_admin on public.testimonials for all
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- contact_messages: أي زائر يُدرج، والأدمن وحده يقرأ/يعدّل/يحذف
drop policy if exists contact_insert on public.contact_messages;
create policy contact_insert on public.contact_messages for insert with check (true);
drop policy if exists contact_admin  on public.contact_messages;
create policy contact_admin  on public.contact_messages for all
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ============================================================================
-- التخزين (Storage)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('images','images', true), ('audio','audio', true)
on conflict (id) do nothing;

-- قراءة عامة لملفات الصور والصوت
drop policy if exists storage_public_read on storage.objects;
create policy storage_public_read on storage.objects for select
  using (bucket_id in ('images','audio'));

-- الرفع/التعديل/الحذف للأدمن فقط
drop policy if exists storage_admin_insert on storage.objects;
create policy storage_admin_insert on storage.objects for insert
  with check (bucket_id in ('images','audio') and (select public.is_admin()));

drop policy if exists storage_admin_update on storage.objects;
create policy storage_admin_update on storage.objects for update
  using (bucket_id in ('images','audio') and (select public.is_admin()))
  with check (bucket_id in ('images','audio') and (select public.is_admin()));

drop policy if exists storage_admin_delete on storage.objects;
create policy storage_admin_delete on storage.objects for delete
  using (bucket_id in ('images','audio') and (select public.is_admin()));
