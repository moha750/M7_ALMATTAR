"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const field =
  "w-full rounded-xl border border-espresso/15 bg-cream px-4 py-3 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("loading");
    const supabase = createClient();
    // إدراج دون قراءة الصف (سياسة RLS تسمح للزائر بالإرسال لا القراءة)
    const { error } = await supabase.from("contact_messages").insert({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    });
    if (error) {
      setState("error");
      return;
    }
    setState("done");
    form.reset();
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gold/40 bg-parchment p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold-deep" />
        <p className="text-lg font-semibold">وصلتني رسالتك، شكرًا لك!</p>
        <p className="text-sm text-espresso/60">سأعاود التواصل معك قريبًا.</p>
        <button
          onClick={() => setState("idle")}
          className="mt-2 text-sm text-gold-deep hover:underline"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="الاسم" className={field} />
        <input
          name="email"
          type="email"
          required
          dir="ltr"
          placeholder="البريد الإلكتروني"
          className={`${field} text-start`}
        />
      </div>
      <textarea
        name="message"
        required
        rows={5}
        placeholder="كيف أقدر أخدمك؟"
        className={field}
      />
      {state === "error" && (
        <p className="text-sm text-red-600">تعذّر الإرسال، حاول مرة أخرى.</p>
      )}
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-3.5 font-semibold text-cream transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        إرسال الرسالة
      </button>
    </form>
  );
}
