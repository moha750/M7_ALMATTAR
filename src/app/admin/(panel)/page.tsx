import Link from "next/link";
import {
  FolderKanban,
  Eye,
  Star,
  Mail,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "لوحة المعلومات" };

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof FolderKanban;
}) {
  return (
    <div className="rounded-2xl border border-espresso/10 bg-parchment p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-espresso/60">{label}</span>
        <Icon className="h-5 w-5 text-gold-deep" />
      </div>
      <p className="mt-2 font-[family-name:var(--font-tech)] text-3xl font-bold text-espresso">
        {value}
      </p>
    </div>
  );
}

export default async function DashboardHome() {
  const supabase = await createClient();
  const [total, published, featured, unread, recent] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("contact_messages")
      .select("id,name,email,message,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalCount = total.count ?? 0;
  const publishedCount = published.count ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold">
            لوحة المعلومات
          </h1>
          <p className="mt-1 text-espresso/60">نظرة سريعة على أعمالك ومحتواك.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
        >
          <Plus className="h-4 w-4" />
          مشروع جديد
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="إجمالي المشاريع" value={totalCount} icon={FolderKanban} />
        <StatCard label="منشورة" value={publishedCount} icon={Eye} />
        <StatCard label="مميّزة" value={featured.count ?? 0} icon={Star} />
        <StatCard label="رسائل غير مقروءة" value={unread.count ?? 0} icon={Mail} />
      </div>

      <div className="mt-6 rounded-2xl border border-espresso/10 bg-parchment p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold">
            أحدث الرسائل
          </h2>
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-1 text-sm text-gold-deep hover:underline"
          >
            عرض الكل
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recent.data && recent.data.length > 0 ? (
          <ul className="mt-4 divide-y divide-espresso/5">
            {recent.data.map((m) => (
              <li key={m.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-xs text-taupe" dir="ltr">
                    {new Date(m.created_at).toLocaleDateString("ar")}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-sm text-espresso/60">
                  {m.message}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-espresso/50">لا توجد رسائل بعد.</p>
        )}
      </div>
    </div>
  );
}
