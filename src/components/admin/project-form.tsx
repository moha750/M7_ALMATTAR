"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Loader2, Save, Upload } from "lucide-react";
import { saveProject } from "@/app/admin/actions";
import type { Project } from "@/lib/database.types";

type Cat = { slug: string; title: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 font-semibold text-cream transition-transform hover:scale-[1.02] disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      حفظ المشروع
    </button>
  );
}

const field =
  "w-full rounded-xl border border-espresso/15 bg-parchment px-4 py-2.5 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";
const labelCls = "mb-1.5 block text-sm font-medium text-espresso/80";

export function ProjectForm({
  categories,
  project,
  currentCover,
}: {
  categories: Cat[];
  project?: Project;
  currentCover?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(currentCover ?? null);

  return (
    <form action={saveProject} className="space-y-6">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>عنوان المشروع *</label>
          <input
            name="title_ar"
            required
            defaultValue={project?.title_ar ?? ""}
            className={field}
            placeholder="مثال: هوية مقهى «روّاد»"
          />
        </div>

        <div>
          <label className={labelCls}>التخصص</label>
          <select
            name="category"
            defaultValue={project?.category ?? categories[0]?.slug}
            className={field}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>الرابط الدائم (slug) — اختياري</label>
          <input
            name="slug"
            defaultValue={project?.slug ?? ""}
            dir="ltr"
            className={`${field} text-start`}
            placeholder="يُولّد تلقائيًّا من العنوان"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>ملخّص قصير</label>
          <input
            name="summary_ar"
            defaultValue={project?.summary_ar ?? ""}
            className={field}
            placeholder="جملة تختصر المشروع"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>الوصف التفصيلي</label>
          <textarea
            name="description_ar"
            defaultValue={project?.description_ar ?? ""}
            rows={5}
            className={field}
            placeholder="المشكلة ← العملية ← النتيجة"
          />
        </div>

        <div>
          <label className={labelCls}>اسم العميل</label>
          <input
            name="client_name"
            defaultValue={project?.client_name ?? ""}
            className={field}
          />
        </div>

        <div>
          <label className={labelCls}>رابط المشروع (للبرمجة/الفيديو)</label>
          <input
            name="project_url"
            defaultValue={project?.project_url ?? ""}
            dir="ltr"
            className={`${field} text-start`}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelCls}>ترتيب العرض</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={project?.sort_order ?? 0}
            className={field}
          />
        </div>
      </div>

      {/* صورة الغلاف */}
      <div>
        <label className={labelCls}>صورة الغلاف</label>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-36 overflow-hidden rounded-xl border border-espresso/15 bg-parchment">
            {preview && (
              <Image
                src={preview}
                alt="معاينة"
                fill
                sizes="144px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-espresso/15 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-espresso/5">
            <Upload className="h-4 w-4" />
            اختر صورة
            <input
              type="file"
              name="cover"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
          </label>
        </div>
      </div>

      {/* المفاتيح */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={project?.is_published ?? false}
            className="h-5 w-5 accent-[var(--color-gold-deep)]"
          />
          <span className="text-sm font-medium">منشور (يظهر في الموقع)</span>
        </label>
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={project?.is_featured ?? false}
            className="h-5 w-5 accent-[var(--color-gold-deep)]"
          />
          <span className="text-sm font-medium">مميّز</span>
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}
