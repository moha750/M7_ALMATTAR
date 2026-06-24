"use client";

import { useState } from "react";
import { Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const field =
  "w-full rounded-xl border border-espresso/15 bg-parchment px-4 py-2.5 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";
const labelCls = "mb-1.5 block text-sm font-medium text-espresso/80";

export function ChangePasswordForm() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (pw.length < 8) {
      setErr("كلمة المرور يجب أن تكون ٨ أحرف على الأقل.");
      return;
    }
    if (pw !== pw2) {
      setErr("كلمتا المرور غير متطابقتين.");
      return;
    }
    setState("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) {
      setErr(error.message);
      setState("idle");
      return;
    }
    setPw("");
    setPw2("");
    setState("done");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5">
      <div>
        <label className={labelCls}>كلمة المرور الجديدة</label>
        <input
          type="password"
          dir="ltr"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
          className={`${field} text-start`}
          placeholder="••••••••"
        />
      </div>
      <div>
        <label className={labelCls}>تأكيد كلمة المرور</label>
        <input
          type="password"
          dir="ltr"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          required
          className={`${field} text-start`}
          placeholder="••••••••"
        />
      </div>

      {err && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {err}
        </p>
      )}
      {state === "done" && (
        <p className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          تم تحديث كلمة المرور بنجاح.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 font-semibold text-cream transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <KeyRound className="h-4 w-4" />
        )}
        تحديث كلمة المرور
      </button>
    </form>
  );
}
