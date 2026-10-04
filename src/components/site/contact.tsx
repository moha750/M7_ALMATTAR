"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Waypoint } from "@/components/site/waypoint";
import { CONTACT_INTENTS, SOCIAL_LABELS } from "@/content/site";

const base =
  "w-full rounded-[10px] border border-dashed border-ivory/35 bg-night px-4 text-[17px] text-ivory placeholder:text-ivory/40 outline-none transition focus:border-solid focus:border-gilt";
const field = `${base} h-[52px]`;

export function Contact({
  email,
  socials,
}: {
  email: string | null;
  socials: Record<string, string>;
}) {
  const [intent, setIntent] = useState<string>(CONTACT_INTENTS[0]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("loading");
    const supabase = createClient();
    const base = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    let { error } = await supabase.from("contact_messages").insert({ ...base, intent });
    // قبل ترحيل 0003 لا يوجد عمود intent: نرسل النية داخل الرسالة
    if (error) {
      ({ error } = await supabase
        .from("contact_messages")
        .insert({ ...base, message: `[${intent}] ${base.message}` }));
    }
    if (error) {
      setState("error");
      return;
    }
    setState("done");
    form.reset();
  }

  const socialEntries = Object.entries(socials).filter(([, v]) => v);

  return (
    <section id="contact" className="relative z-10 scroll-mt-24">
      <div className="shell pb-28 pt-28 lg:pt-[140px]">
        <Waypoint label="٤ · فكرتك" />
        <div className="mt-6 flex flex-col items-center text-center">
          <h2 className="font-display text-[64px] leading-[1.3] sm:text-[120px]">عندك فكرة؟</h2>
          <p className="mt-1 font-hand text-3xl text-gilt-light sm:text-[44px]">لنحلّق بها معًا.</p>

          {state === "done" ? (
            <div className="mt-10 flex w-full max-w-[880px] flex-col items-center gap-3 rounded-[18px] border-[1.5px] border-gilt/60 bg-night/90 px-6 py-14">
              <CheckCircle2 className="h-10 w-10 text-gilt" />
              <p className="text-xl font-semibold">وصلت فكرتك، وبدأ التحليق.</p>
              <p className="text-ivory/65">أرد عليك قريبًا.</p>
              <button onClick={() => setState("idle")} className="mt-2 py-2 text-gilt-light hover:underline">
                أرسل فكرة أخرى
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-10 flex w-full max-w-[880px] flex-col gap-5 rounded-[18px] border-[1.5px] border-dashed border-gilt/50 bg-night/90 p-5 text-right sm:p-10"
            >
              <fieldset className="flex flex-wrap items-center gap-2.5">
                <legend className="sr-only">بخصوص</legend>
                <span className="ml-1.5 text-[16px] text-ivory/75">بخصوص:</span>
                {CONTACT_INTENTS.map((it) => (
                  <button
                    key={it}
                    type="button"
                    aria-pressed={intent === it}
                    onClick={() => setIntent(it)}
                    className={`rounded-[10px] px-5 py-3 text-[16px] transition-colors ${
                      intent === it
                        ? "border border-gilt bg-gilt text-night"
                        : "border border-dashed border-ivory/40 text-ivory hover:border-gilt/70"
                    }`}
                  >
                    {it}
                  </button>
                ))}
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-[15px] text-ivory/75">
                  الاسم
                  <input name="name" required placeholder="اسمك أو اسم جهتك" className={field} />
                </label>
                <label className="flex flex-col gap-2 text-[15px] text-ivory/75">
                  البريد
                  <input
                    name="email"
                    type="email"
                    required
                    dir="ltr"
                    placeholder="name@company.com"
                    className={`${field} text-right`}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-[15px] text-ivory/75">
                الفكرة باختصار
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="حدثني عن الفكرة، وما الذي تريد أن يحدث"
                  className={`${base} h-40 resize-none py-3.5`}
                />
              </label>
              {state === "error" && <p className="text-sm text-red-300">تعذّر الإرسال، حاول مرة أخرى.</p>}
              <button
                type="submit"
                disabled={state === "loading"}
                className="flex h-14 items-center justify-center gap-2 rounded-[10px] bg-gilt text-[18px] font-semibold text-night transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {state === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
                أطلق الفكرة
              </button>
            </form>
          )}

          {email && (
            <p className="mt-8 text-[16px] text-ivory/70">
              أو راسلني مباشرة:{" "}
              <a href={`mailto:${email}`} dir="ltr" className="text-gilt-light underline underline-offset-4">
                {email}
              </a>
            </p>
          )}
          {socialEntries.length > 0 && (
            <nav aria-label="حساباتي" className="mt-4 flex flex-wrap justify-center gap-7 text-[17px]">
              {socialEntries.map(([k, url]) => (
                <a key={k} href={url} target="_blank" rel="noopener noreferrer" className="py-3 text-ivory/80 hover:text-gilt-light">
                  {SOCIAL_LABELS[k] ?? k}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
