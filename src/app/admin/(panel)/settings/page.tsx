import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "../../actions";

export const metadata = { title: "إعدادات الموقع" };

const field =
  "w-full rounded-xl border border-espresso/15 bg-parchment px-4 py-2.5 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";
const labelCls = "mb-1.5 block text-sm font-medium text-espresso/80";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: s } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const socials = (s?.socials ?? {}) as Record<string, string>;

  return (
    <div>
      <h1 className="mb-1 font-[family-name:var(--font-heading)] text-3xl font-bold">
        إعدادات الموقع
      </h1>
      <p className="mb-6 text-espresso/60">
        تتحكّم هذه الحقول ببيانات التواصل في الواجهة العامة.
      </p>

      <form action={updateSettings} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>الاسم</label>
            <input name="name_ar" defaultValue={s?.name_ar ?? ""} className={field} />
          </div>
          <div>
            <label className={labelCls}>الشعار/العنوان</label>
            <input name="title_ar" defaultValue={s?.title_ar ?? ""} className={field} />
          </div>
          <div>
            <label className={labelCls}>البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              dir="ltr"
              defaultValue={s?.email ?? ""}
              className={`${field} text-start`}
            />
          </div>
          <div>
            <label className={labelCls}>واتساب (رقم دولي)</label>
            <input
              name="whatsapp"
              dir="ltr"
              defaultValue={s?.whatsapp ?? ""}
              className={`${field} text-start`}
              placeholder="9665xxxxxxxx"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-bold">
            روابط التواصل
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {(
              [
                ["instagram", "إنستغرام"],
                ["x", "إكس (تويتر)"],
                ["behance", "بيهانس"],
                ["youtube", "يوتيوب"],
                ["tiktok", "تيك توك"],
                ["linkedin", "لينكدإن"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input
                  name={`social_${key}`}
                  dir="ltr"
                  defaultValue={socials[key] ?? ""}
                  className={`${field} text-start`}
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 font-semibold text-cream transition-transform hover:scale-[1.02]"
        >
          <Save className="h-4 w-4" />
          حفظ الإعدادات
        </button>
      </form>
    </div>
  );
}
