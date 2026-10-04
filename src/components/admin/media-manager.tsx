"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type DragEvent } from "react";
import { ArrowDown, ArrowUp, Film, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ProjectMedia } from "@/lib/database.types";

type Item = ProjectMedia & { url: string | null };

const box = "rounded-2xl border border-espresso/10 bg-parchment p-5 sm:p-6";
const field =
  "w-full rounded-xl border border-espresso/15 bg-white/70 px-3 py-2 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";

/**
 * معرض صور العمل: رفع عدة صور دفعة واحدة، وصف، ترتيب، حذف، روابط فيديو،
 * وجعل أي صورة غلافًا للعمل. كل شيء يُحفظ فورًا.
 */
export function MediaManager({
  projectId,
  initial,
  coverPath,
}: {
  projectId: string;
  initial: Item[];
  coverPath: string | null;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initial);
  const [cover, setCover] = useState<string | null>(coverPath);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState("");
  const [drag, setDrag] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const urlOf = (p: string) => `${base}/storage/v1/object/public/images/${p}`;
  const nextOrder = () => (items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setError(null);
    const supabase = createClient();
    let order = nextOrder();
    const added: Item[] = [];
    try {
      for (let i = 0; i < list.length; i++) {
        const f = list[i];
        setBusy(`رفع ${i + 1} من ${list.length}…`);
        const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
        const path = `projects/${projectId}/media-${crypto.randomUUID().slice(0, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("images").upload(path, f, { contentType: f.type });
        if (upErr) throw new Error(upErr.message);
        const { data, error: insErr } = await supabase
          .from("project_media")
          .insert({ project_id: projectId, kind: "image", storage_path: path, sort_order: order++ })
          .select("*")
          .single();
        if (insErr) throw new Error(insErr.message);
        added.push({ ...(data as ProjectMedia), url: urlOf(path) });
      }
    } catch (e) {
      setError("تعذّر الرفع: " + (e instanceof Error ? e.message : ""));
    } finally {
      setItems((xs) => [...xs, ...added]);
      setBusy(null);
      if (input.current) input.current.value = "";
      router.refresh();
    }
  }

  async function addVideo() {
    const url = video.trim();
    if (!url) return;
    setBusy("إضافة الفيديو…");
    setError(null);
    const { data, error: e } = await createClient()
      .from("project_media")
      .insert({ project_id: projectId, kind: "video", external_url: url, sort_order: nextOrder() })
      .select("*")
      .single();
    setBusy(null);
    if (e) return setError("تعذّرت الإضافة: " + e.message);
    setItems((xs) => [...xs, { ...(data as ProjectMedia), url: null }]);
    setVideo("");
    router.refresh();
  }

  async function saveAlt(id: string, alt: string) {
    await createClient().from("project_media").update({ alt_ar: alt.trim() || null }).eq("id", id);
  }

  async function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[index];
    const b = items[j];
    const next = [...items];
    next[index] = { ...b, sort_order: a.sort_order };
    next[j] = { ...a, sort_order: b.sort_order };
    // ترتيب متساوٍ؟ نعيد ترقيم الجميع
    const fixed = new Set(next.map((x) => x.sort_order)).size === next.length ? next : next.map((x, k) => ({ ...x, sort_order: k }));
    setItems(fixed);
    const supabase = createClient();
    await Promise.all(fixed.map((x) => supabase.from("project_media").update({ sort_order: x.sort_order }).eq("id", x.id)));
    router.refresh();
  }

  async function remove(it: Item) {
    setBusy("حذف…");
    const supabase = createClient();
    const { error: e } = await supabase.from("project_media").delete().eq("id", it.id);
    if (!e && it.storage_path && it.storage_path !== cover) {
      await supabase.storage.from("images").remove([it.storage_path]);
    }
    setBusy(null);
    setConfirmId(null);
    if (e) return setError("تعذّر الحذف: " + e.message);
    setItems((xs) => xs.filter((x) => x.id !== it.id));
    router.refresh();
  }

  async function makeCover(it: Item) {
    if (!it.storage_path) return;
    setBusy("تعيين الغلاف…");
    const { error: e } = await createClient().from("projects").update({ cover_path: it.storage_path }).eq("id", projectId);
    setBusy(null);
    if (e) return setError("تعذّر تعيين الغلاف: " + e.message);
    setCover(it.storage_path);
    // إعادة تحميل حتى يعرض نموذج العمل الغلاف الجديد ولا يعيد القديم عند الحفظ
    window.location.reload();
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files?.length) void upload(e.dataTransfer.files);
  }

  return (
    <section className={`${box} mt-8`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold">معرض صور العمل</h2>
        <p className="text-xs text-espresso/55">تظهر في صفحة العمل بالترتيب، بمقاسها الطبيعي. كل تغيير يُحفظ فورًا.</p>
      </div>

      {/* منطقة الرفع */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          drag ? "border-gold bg-gold/10" : "border-espresso/20 hover:border-gold/60 hover:bg-white/50"
        }`}
      >
        {busy ? <Loader2 className="h-7 w-7 animate-spin text-gold-deep" /> : <ImagePlus className="h-7 w-7 text-gold-deep" />}
        <span className="font-semibold">{busy ?? "اسحب الصور هنا، أو اضغط لاختيارها"}</span>
        <span className="text-xs text-espresso/55">تقدر تختار أكثر من صورة مرة وحدة · JPG أو PNG أو WebP</span>
        <input
          ref={input}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={!!busy}
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </label>

      {/* فيديو */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          dir="ltr"
          placeholder="رابط فيديو (يوتيوب أو فيميو) — اختياري"
          className={`${field} text-start`}
        />
        <button
          type="button"
          onClick={addVideo}
          disabled={!video.trim() || !!busy}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-espresso/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-espresso/5 disabled:opacity-50"
        >
          <Film className="h-4 w-4" />
          أضف الفيديو
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {/* القائمة */}
      {items.length === 0 ? (
        <p className="mt-6 text-center text-sm text-espresso/50">لا توجد صور بعد.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => {
            const isCover = !!it.storage_path && it.storage_path === cover;
            return (
              <li key={it.id} className="overflow-hidden rounded-2xl border border-espresso/10 bg-white/70">
                <div className="relative aspect-[4/3] bg-espresso/5">
                  {it.kind === "image" && it.url ? (
                    <Image src={it.url} alt={it.alt_ar ?? ""} fill sizes="320px" className="object-contain" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-xs text-espresso/60">
                      <Film className="h-7 w-7" />
                      <span className="max-w-full truncate" dir="ltr">
                        {it.external_url}
                      </span>
                    </div>
                  )}
                  <span className="absolute right-2 top-2 rounded-full bg-espresso/80 px-2 py-0.5 text-[11px] text-cream">
                    {i + 1}
                  </span>
                  {isCover && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-espresso">
                      <Star className="h-3 w-3 fill-current" />
                      الغلاف
                    </span>
                  )}
                </div>
                <div className="space-y-2 p-3">
                  <input
                    defaultValue={it.alt_ar ?? ""}
                    onBlur={(e) => saveAlt(it.id, e.target.value)}
                    placeholder="وصف قصير (اختياري)"
                    className={field}
                  />
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="تقديم" className="rounded-lg border border-espresso/15 p-1.5 disabled:opacity-30">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="تأخير" className="rounded-lg border border-espresso/15 p-1.5 disabled:opacity-30">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    {it.kind === "image" && !isCover && (
                      <button type="button" onClick={() => makeCover(it)} className="rounded-lg border border-espresso/15 px-2.5 py-1.5 text-xs font-medium hover:bg-gold/15">
                        اجعلها الغلاف
                      </button>
                    )}
                    <span className="flex-1" />
                    {confirmId === it.id ? (
                      <button type="button" onClick={() => remove(it)} className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white">
                        تأكيد الحذف
                      </button>
                    ) : (
                      <button type="button" onClick={() => setConfirmId(it.id)} aria-label="حذف" className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
