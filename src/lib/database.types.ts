// أنواع قاعدة البيانات — مطابقة لـ supabase/migrations/0001_init.sql
// (مكتوبة يدويًّا؛ يمكن لاحقًا توليدها عبر `supabase gen types`.)

export type Discipline = "graphic" | "editing" | "motion" | "code" | "voice";
export type MediaKind = "image" | "video" | "audio" | "external_link";

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
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
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
      };
      categories: {
        Row: {
          id: string;
          slug: Discipline;
          title_ar: string;
          description_ar: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["categories"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
      };
      projects: {
        Row: {
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
        Insert: Omit<
          Database["public"]["Tables"]["projects"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
      };
      project_media: {
        Row: {
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
        Insert: Omit<
          Database["public"]["Tables"]["project_media"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["project_media"]["Row"]>;
      };
      services: {
        Row: {
          id: string;
          category: Discipline;
          title_ar: string;
          description_ar: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["services"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          client_role: string | null;
          client_logo_path: string | null;
          quote_ar: string;
          is_published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["testimonials"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          message: string;
          is_read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]>;
      };
    };
    Enums: {
      discipline: Discipline;
      media_kind: MediaKind;
    };
  };
}

// اختصارات مريحة
export type SiteSettings =
  Database["public"]["Tables"]["site_settings"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectMedia =
  Database["public"]["Tables"]["project_media"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Testimonial =
  Database["public"]["Tables"]["testimonials"]["Row"];
export type ContactMessage =
  Database["public"]["Tables"]["contact_messages"]["Row"];
