"use client";

import { useState, type ChangeEvent } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * يرفع ملفًّا من المتصفّح مباشرةً إلى التخزين، ويضع مساره في حقل مخفي باسم `name`.
 * (يتجاوز حدّ 1MB على الـ Server Actions.)
 */
export function FileUploadField({
  name,
  label,
  bucket,
  folder,
  accept,
  initialPath,
  hint,
}: {
  name: string;
  label: string;
  bucket: "images" | "audio";
  folder: string;
  accept: string;
  initialPath?: string | null;
  hint?: string;
}) {
  const [path, setPath] = useState<string | null>(initialPath ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const p = `${folder}/${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error: upErr } = await createClient()
        .storage.from(bucket)
        .upload(p, file, { contentType: file.type, upsert: true });
      if (upErr) throw new Error(upErr.message);
      setPath(p);
    } catch (err) {
      setError("فشل الرفع: " + (err instanceof Error ? err.message : ""));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-espresso/80">{label}</span>
      <input type="hidden" name={name} value={path ?? ""} />
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-espresso/15 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-espresso/5">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {path ? "استبدال الملف" : "اختر ملفًّا"}
          <input type="file" accept={accept} className="hidden" onChange={onChange} />
        </label>
        {path && (
          <>
            <span className="max-w-[260px] truncate text-xs text-espresso/60" dir="ltr">
              {path}
            </span>
            <button
              type="button"
              onClick={() => setPath(null)}
              className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              إزالة
            </button>
          </>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-espresso/55">{hint}</p>}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
