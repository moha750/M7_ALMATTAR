"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Loader2, Save, Upload } from "lucide-react";
import { saveProject } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";
import { FileUploadField } from "@/components/admin/file-upload-field";
import type { Project } from "@/lib/database.types";

type Cat = { slug: string; title: string };

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
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
  const [coverPath, setCoverPath] = useState<string | null>(
    project?.cover_path ?? null,
  );
  const [newId, setNewId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastUpload = useRef<string | null>(null);

  // رفع صورة الغلاف مباشرةً من المتصفّح إلى التخزين — يتجاوز حدّ 1MB على الـ Server Action
  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const supabase = createClient();

      // مجلد ثابت للمشروع: معرّفه القائم، أو معرّف مُولّد للمشروع الجديد
      let folder = project?.id ?? newId;
      if (!folder) {
        folder = crypto.randomUUID();
        setNewId(folder);
      }

      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `projects/${folder}/cover-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("images")
        .upload(path, file, { contentType: file.type, upsert: true });
      if (upErr) throw new Error(upErr.message);

      // تنظيف رفعة سابقة غير محفوظة ضمن هذه الجلسة
      if (lastUpload.current && lastUpload.current !== path) {
        await supabase.storage
          .from("images")
          .remove([lastUpload.current])
          .catch(() => {});
      }
      lastUpload.current = path;
      setCoverPath(path);
    } catch (err) {
      setError("فشل رفع الصورة: " + (err instanceof Error ? err.message : ""));
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={saveProject} className="space-y-6">
      {project && <input type="hidden" name="id" value={project.id} />}
      {!project && <input type="hidden" name="new_id" value={newId} />}
      <input type="hidden" name="cover_path" value={coverPath ?? ""} />

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
          <label className={labelCls}>سطر تعريفي (يظهر تحت العنوان)</label>
          <input
            name="subtitle_ar"
            defaultValue={project?.subtitle_ar ?? ""}
            className={field}
            placeholder="مثال: حملة «ما فاتك شي» لنادي أدِيب"
          />
        </div>

        <div className="sm:col-span-2 rounded-2xl border border-espresso/10 p-5">
          <p className="mb-4 text-sm font-semibold text-espresso">رحلة الفكرة</p>
          <div className="grid gap-4">
            <div>
              <label className={labelCls}>التحدي</label>
              <textarea name="challenge_ar" rows={2} defaultValue={project?.challenge_ar ?? ""} className={field} placeholder="ما المشكلة أو السؤال الذي بدأت منه؟" />
            </div>
            <div>
              <label className={labelCls}>الفكرة</label>
              <textarea name="idea_ar" rows={2} defaultValue={project?.idea_ar ?? ""} className={field} placeholder="ما الفكرة التي حلّقت بها؟" />
            </div>
            <div>
              <label className={labelCls}>التنفيذ</label>
              <textarea name="execution_ar" rows={3} defaultValue={project?.execution_ar ?? ""} className={field} placeholder="كيف نفّذتها؟ ما الأدوات والتفاصيل؟" />
            </div>
            <div>
              <label className={labelCls}>أدوارك (افصل بينها بفاصلة)</label>
              <input name="roles_ar" defaultValue={(project?.roles_ar ?? []).join("، ")} className={field} placeholder="الفكرة، الإخراج، المونتاج" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FileUploadField
                name="sketch_path"
                label="صورة المسودة / لوحة القصة"
                bucket="images"
                folder={`projects/${project?.id ?? "drafts"}/sketch`}
                accept="image/*"
                initialPath={project?.sketch_path ?? null}
              />
              <div>
                <label className={labelCls}>رابط الفيديو (يوتيوب/فيميو/ملف)</label>
                <input name="video_url" defaultValue={project?.video_url ?? ""} dir="ltr" className={`${field} text-start`} placeholder="https://..." />
              </div>
            </div>
          </div>
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
            {uploading && (
              <div className="absolute inset-0 grid place-items-center bg-espresso/40">
                <Loader2 className="h-5 w-5 animate-spin text-cream" />
              </div>
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-espresso/15 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-espresso/5">
            <Upload className="h-4 w-4" />
            اختر صورة
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
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

      <SubmitButton disabled={uploading} />
    </form>
  );
}
