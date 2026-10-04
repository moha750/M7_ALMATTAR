"use client";

import { useState } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CONTACT, CONTACT_INTENTS, SOCIAL_LABELS } from "@/content/site";

const field =
  "w-full border-0 border-b border-paper/30 bg-transparent px-0 py-3 text-[19px] text-paper placeholder:text-paper/35 outline-none transition-colors focus:border-paper";

/** القسم ٣: تواصل معي. */
export function Contact({ email, socials }: { email: string | null; socials: Record<string, string> }) {
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
    if (error) {
      ({ error } = await supabase.from("contact_messages").insert({ ...base, message: `[${intent}] ${base.message}` }));
    }
    if (error) {
      setState("error");
      return;
    }
    setState("done");
    form.reset();
  }

  const links = Object.entries(socials).filter(([, v]) => v);

  return (
    <section id="contact" className="mt-28 scroll-mt-16 bg-ink text-paper lg:mt-44">
      <div className="wrap pb-20 pt-20 lg:pb-28 lg:pt-28">
        <p className="t-meta text-accent">تواصل معي</p>
        <h2 className="t-mega mt-3">{CONTACT.title}</h2>
        <p className="mt-3 text-[22px] text-paper/70 lg:text-[28px]">{CONTACT.line}</p>

        <div className="mt-14 grid gap-14 border-t border-paper/20 pt-10 lg:mt-20 lg:grid-cols-12 lg:gap-8 lg:pt-12">
          <div className="flex flex-col gap-10 lg:col-span-5">
            {email && (
              <div>
                <p className="t-meta text-paper/50">البريد</p>
                <a
                  href={`mailto:${email}`}
                  dir="ltr"
                  className="mt-2 inline-block whitespace-nowrap text-[clamp(1.125rem,1.95vw,2rem)] font-medium underline decoration-accent decoration-2 underline-offset-[10px] transition-colors hover:text-accent"
                >
                  {email}
                </a>
              </div>
            )}
            {links.length > 0 && (
              <div>
                <p className="t-meta text-paper/50">حساباتي</p>
                <ul className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-[18px]">
                  {links.map(([k, url]) => (
                    <li key={k}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                        {SOCIAL_LABELS[k] ?? k} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {state === "done" ? (
              <div className="flex flex-col items-start gap-4 border-t border-paper/20 pt-8">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-ink">
                  <Check className="h-6 w-6" />
                </span>
                <p className="font-display text-[44px] leading-[1.2]">وصلت فكرتك.</p>
                <p className="text-paper/65">أرد عليك قريبًا.</p>
                <button onClick={() => setState("idle")} className="mt-2 text-[16px] underline underline-offset-8">
                  أرسل فكرة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-8">
                <fieldset className="flex flex-wrap items-center gap-2.5">
                  <legend className="t-meta mb-3 text-paper/50">بخصوص</legend>
                  {CONTACT_INTENTS.map((it) => (
                    <button
                      key={it}
                      type="button"
                      aria-pressed={intent === it}
                      onClick={() => setIntent(it)}
                      className={`h-11 px-5 text-[15px] font-medium transition-colors ${
                        intent === it ? "bg-paper text-ink" : "border border-paper/30 text-paper hover:border-paper"
                      }`}
                    >
                      {it}
                    </button>
                  ))}
                </fieldset>
                <div className="grid gap-8 sm:grid-cols-2">
                  <label className="t-meta flex flex-col text-paper/50">
                    الاسم
                    <input name="name" required placeholder="اسمك أو اسم جهتك" className={field} />
                  </label>
                  <label className="t-meta flex flex-col text-paper/50">
                    البريد
                    <input name="email" type="email" required dir="ltr" placeholder="name@company.com" className={`${field} text-right`} />
                  </label>
                </div>
                <label className="t-meta flex flex-col text-paper/50">
                  الفكرة
                  <textarea name="message" required rows={3} placeholder="باختصار: ما الذي تريد أن يحدث؟" className={`${field} resize-none`} />
                </label>
                {state === "error" && <p className="text-[15px] text-red-300">تعذّر الإرسال، حاول مرة أخرى.</p>}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="group inline-flex h-14 items-center gap-3 self-start bg-paper px-8 text-[16px] font-semibold text-ink transition-colors hover:bg-accent disabled:opacity-60"
                >
                  {state === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                  أرسل
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
