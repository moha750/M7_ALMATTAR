"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CONTACT, CONTACT_INTENTS, SOCIAL_LABELS } from "@/content/site";

const input =
  "h-[52px] w-full rounded-[14px] border border-bone/15 bg-white/[.04] px-4 text-[16px] text-bone placeholder:text-bone/35 outline-none transition-colors focus:border-sun";

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
    <section id="contact" className="relative mt-28 scroll-mt-10 overflow-hidden rounded-t-[40px] bg-sun text-deep lg:mt-40">
      <div aria-hidden className="pointer-events-none absolute -left-[300px] -top-[420px] h-[900px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,.35),transparent)]" />
      <div className="wrap relative grid gap-12 pb-24 pt-24 lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:pb-28 lg:pt-28">
        <div>
          <span className="text-[13px] font-semibold opacity-70">{CONTACT.eyebrow}</span>
          <h2 className="mt-2 font-display text-[clamp(56px,7.4vw,124px)] leading-[1.06]">
            {CONTACT.title[0]}
            <br />
            {CONTACT.title[1]}
          </h2>
          <p className="mt-5 max-w-[520px] text-[clamp(18px,1.6vw,22px)] font-medium opacity-80">{CONTACT.line}</p>
          {email && (
            <a
              href={`mailto:${email}`}
              dir="ltr"
              className="mt-9 inline-block border-b-[3px] border-deep pb-1 text-[clamp(17px,2vw,28px)] font-semibold transition-opacity hover:opacity-70"
            >
              {email}
            </a>
          )}
          {links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-[17px] font-semibold">
              {links.map(([k, url]) => (
                <li key={k}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                    {SOCIAL_LABELS[k] ?? k} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="self-start rounded-[28px] bg-deep p-7 text-bone md:p-10">
          {state === "done" ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-sun text-deep">
                <Check className="h-6 w-6" />
              </span>
              <p className="font-display text-[40px] leading-[1.2]">وصلت رسالتك.</p>
              <p className="text-bone/65">أرد عليك قريبًا.</p>
              <button onClick={() => setState("idle")} className="mt-2 text-[15px] underline underline-offset-8">
                أرسل رسالة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5">
              <fieldset>
                <legend className="mb-2 text-[13px] text-bone/60">بخصوص</legend>
                <div className="flex flex-wrap gap-2">
                  {CONTACT_INTENTS.map((it) => (
                    <button
                      key={it}
                      type="button"
                      aria-pressed={intent === it}
                      onClick={() => setIntent(it)}
                      className={`h-10 rounded-full px-4 text-[14px] font-medium transition-colors ${
                        intent === it ? "bg-sun text-[#120c02]" : "border border-bone/20 hover:border-bone/50"
                      }`}
                    >
                      {it}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] text-bone/60">الاسم</span>
                  <input name="name" required placeholder="اسمك أو جهتك" className={input} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] text-bone/60">البريد</span>
                  <input name="email" type="email" required dir="ltr" placeholder="name@company.com" className={`${input} text-right`} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[13px] text-bone/60">رسالتك</span>
                <textarea name="message" required placeholder="باختصار" className={`${input} h-[110px] resize-none py-3`} />
              </label>
              {state === "error" && <p className="text-[14px] text-red-300">تعذّر الإرسال، حاول مرة أخرى.</p>}
              <button
                type="submit"
                disabled={state === "loading"}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-sun text-[16px] font-bold text-[#120c02] transition-colors hover:bg-sun-2 disabled:opacity-60"
              >
                {state === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
                أرسل ←
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
