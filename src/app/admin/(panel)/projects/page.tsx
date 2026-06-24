import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { publicUrl } from "@/lib/storage";
import { DISCIPLINES } from "@/lib/disciplines";
import { deleteProject, toggleProjectPublished } from "../../actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

export const metadata = { title: "المشاريع" };

const CAT_LABEL: Record<string, string> = Object.fromEntries(
  DISCIPLINES.map((d) => [d.slug, d.title]),
);

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold">
            المشاريع
          </h1>
          <p className="mt-1 text-espresso/60">
            {projects?.length ?? 0} مشروع — أضف أعمالك وانشرها لتظهر في الموقع.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
        >
          <Plus className="h-4 w-4" />
          مشروع جديد
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-espresso/20 bg-parchment/50 p-12 text-center">
          <p className="text-espresso/60">لا توجد مشاريع بعد.</p>
          <Link
            href="/admin/projects/new"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-espresso transition-transform hover:scale-[1.03]"
          >
            <Plus className="h-4 w-4" />
            أضف أول مشروع
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {projects.map((p) => {
            const cover = publicUrl(p.cover_path);
            return (
              <li
                key={p.id}
                className="flex items-center gap-4 rounded-2xl border border-espresso/10 bg-parchment p-3"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-cream">
                  {cover && (
                    <Image
                      src={cover}
                      alt={p.title_ar}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold">{p.title_ar}</h3>
                    {p.is_featured && (
                      <Star className="h-4 w-4 shrink-0 fill-gold text-gold" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-espresso/8 px-2 py-0.5 text-espresso/70">
                      {CAT_LABEL[p.category] ?? p.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        p.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.is_published ? "منشور" : "مسودة"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <form action={toggleProjectPublished}>
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="next"
                      value={(!p.is_published).toString()}
                    />
                    <button
                      type="submit"
                      title={p.is_published ? "إلغاء النشر" : "نشر"}
                      className="rounded-lg p-2 text-espresso/60 transition-colors hover:bg-espresso/5 hover:text-espresso"
                    >
                      {p.is_published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </form>

                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    title="تعديل"
                    className="rounded-lg p-2 text-espresso/60 transition-colors hover:bg-espresso/5 hover:text-espresso"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>

                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmSubmit
                      message={`حذف المشروع «${p.title_ar}»؟ لا يمكن التراجع.`}
                      className="rounded-lg p-2 text-red-600/70 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
