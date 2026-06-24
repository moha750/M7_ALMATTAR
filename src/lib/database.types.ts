// أنواع قاعدة البيانات — مطابقة لـ supabase/migrations/0001_init.sql
// (مكتوبة يدويًّا بشكل متوافق مع متطلّبات postgrest-js: كل جدول يحوي Relationships.)

export type Discipline = "graphic" | "editing" | "motion" | "code" | "voice";
export type MediaKind = "image" | "video" | "audio" | "external_link";

type SiteSettingsRow = {
  id: number;
  name_ar: string;
  title_ar: string | null;
  bio_ar: string | null;
  avatar_path: string | null;
  email: string | null;
  whatsapp: string | null;
  socials: Record<string, string>;
  showreel_url: string | null;
  voicereel_url: string | null;
  cv_url: string | null;
  updated_at: string;
};

type CategoryRow = {
  id: string;
  slug: Discipline;
  title_ar: string;
  description_ar: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
};

type ProjectRow = {
  id: string;
  category: Discipline;
  title_ar: string;
  slug: string;
  summary_ar: string | null;
  description_ar: string | null;
  cover_path: string | null;
  client_name: string | null;
  project_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ProjectMediaRow = {
  id: string;
  project_id: string;
  kind: MediaKind;
  storage_path: string | null;
  external_url: string | null;
  alt_ar: string | null;
  duration_seconds: number | null;
  sort_order: number;
  created_at: string;
};

type ServiceRow = {
  id: string;
  category: Discipline;
  title_ar: string;
  description_ar: string | null;
  sort_order: number;
  created_at: string;
};

type TestimonialRow = {
  id: string;
  client_name: string;
  client_role: string | null;
  client_logo_path: string | null;
  quote_ar: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: SiteSettingsRow;
        Insert: Partial<SiteSettingsRow>;
        Update: Partial<SiteSettingsRow>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: Partial<CategoryRow> & { slug: Discipline; title_ar: string };
        Update: Partial<CategoryRow>;
        Relationships: [];
      };
      projects: {
        Row: ProjectRow;
        Insert: Partial<ProjectRow> & {
          title_ar: string;
          slug: string;
          category: Discipline;
        };
        Update: Partial<ProjectRow>;
        Relationships: [];
      };
      project_media: {
        Row: ProjectMediaRow;
        Insert: Partial<ProjectMediaRow> & {
          project_id: string;
          kind: MediaKind;
        };
        Update: Partial<ProjectMediaRow>;
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
        ];
      };
      services: {
        Row: ServiceRow;
        Insert: Partial<ServiceRow> & { category: Discipline; title_ar: string };
        Update: Partial<ServiceRow>;
        Relationships: [];
      };
      testimonials: {
        Row: TestimonialRow;
        Insert: Partial<TestimonialRow> & {
          client_name: string;
          quote_ar: string;
        };
        Update: Partial<TestimonialRow>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: {
          name: string;
          email: string;
          message: string;
          is_read?: boolean;
        };
        Update: Partial<ContactMessageRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
    Enums: {
      discipline: Discipline;
      media_kind: MediaKind;
    };
  };
}

// اختصارات مريحة
export type SiteSettings = SiteSettingsRow;
export type Category = CategoryRow;
export type Project = ProjectRow;
export type ProjectMedia = ProjectMediaRow;
export type Service = ServiceRow;
export type Testimonial = TestimonialRow;
export type ContactMessage = ContactMessageRow;
