"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { DISCIPLINES } from "@/lib/disciplines";

// لكل تخصص: الفعل (أسود) + «كـ»، ثم اسم التخصص (ذهبي). الواو تُضاف برمجيًّا
// لكل ظهور عدا الأول على الإطلاق (حتى تكرار «أُبدِع» لاحقًا يأخذ واوًا).
const ROLES = [
  { lead: "أُبدِع كـ ", name: "مصمم جرافيك" },
  { lead: "أسرُد كـ ", name: "مونتير فيديو" },
  { lead: "أُحرّك كـ ", name: "موشن جرافكر" },
  { lead: "أبني كـ ", name: "مبرمج" },
  { lead: "أروي كـ ", name: "معلّق صوتي" },
];

// مواضع الأيقونات الخمس حول الصورة (التصميم في المنتصف بالأعلى)
const POSITIONS = [
  "top-[-7%] left-1/2 -translate-x-1/2",
  "top-[6%] left-[0%]",
  "top-[6%] right-[0%]",
  "top-[40%] left-[-9%]",
  "top-[40%] right-[-9%]",
];

function Typewriter() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [started, setStarted] = useState(false); // بعد أول مهارة تصبح true فتظهر الواو لكل ما بعدها

  const role = ROLES[index % ROLES.length];
  const lead = (started ? "و" : "") + role.lead; // أول ظهور بلا واو، وكل ما بعده بواو
  const full = lead + role.name;

  useEffect(() => {
    if (reduce) return; // الحالة الثابتة تُعرض أدناه
    let timer: ReturnType<typeof setTimeout>;
    if (!deleting && count === full.length) {
      timer = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && count === 0) {
      timer = setTimeout(() => {
        setDeleting(false);
        setStarted(true);
        setIndex((p) => (p + 1) % ROLES.length);
      }, 400);
    } else {
      timer = setTimeout(
        () => setCount((c) => c + (deleting ? -1 : 1)),
        deleting ? 45 : 95,
      );
    }
    return () => clearTimeout(timer);
  }, [count, deleting, full, reduce]);

  const caret = (
    <span className="mx-0.5 inline-block animate-pulse font-light text-gold">
      |
    </span>
  );

  if (reduce) {
    return (
      <span>
        <span className="text-espresso">{ROLES[0].lead}</span>
        <span className="text-gold-gradient">{ROLES[0].name}</span>
      </span>
    );
  }

  // الفعل (أسود) ثم اسم التخصص (ذهبي)، حسب عدد الحروف المكتوبة
  const typed = full.slice(0, count);
  const leadLen = lead.length;
  const leadPart = typed.slice(0, Math.min(count, leadLen));
  const namePart = count > leadLen ? typed.slice(leadLen) : "";

  return (
    <span>
      <span className="text-espresso">{leadPart}</span>
      <span className="text-gold-gradient">{namePart}</span>
      {caret}
    </span>
  );
}

export function Hero({ name = "محمد المطر" }: { name?: string | null }) {
  const reduce = useReducedMotion();
  const displayName = name ?? "محمد المطر";

  return (
    <section className="grain relative overflow-hidden bg-cream">
      {/* توهّج ذهبي خلفي */}
      <div
        aria-hidden
        className="pointer-events-none absolute start-1/2 top-1/4 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-14 text-center lg:grid lg:max-w-6xl lg:grid-cols-2 lg:items-center lg:gap-x-8 lg:py-20 lg:text-start">
        {/* العمود البصري: الصورة + الاسم + المسمّى — تبقى وحدة التداخل معًا */}
        <div className="w-full lg:text-center">
          {/* الصورة + الأيقونات الطافية */}
          <div className="relative mx-auto w-[clamp(15rem,33vw,21rem)]">
            {DISCIPLINES.map((d, idx) => {
              const Icon = d.icon;
              return (
                <motion.div
                  key={d.slug}
                  className={`absolute z-0 ${POSITIONS[idx]}`}
                  animate={reduce ? undefined : { y: [0, -10, 0] }}
                  transition={
                    reduce
                      ? undefined
                      : {
                          duration: 3 + idx * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: idx * 0.3,
                        }
                  }
                >
                  <span
                    title={d.title}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-espresso/10 bg-parchment/90 shadow-[0_10px_25px_-12px_rgba(28,26,23,0.5)] backdrop-blur sm:h-14 sm:w-14"
                  >
                    <Icon className="h-6 w-6 text-espresso/80" />
                  </span>
                </motion.div>
              );
            })}

            {/* الصورة الشخصية الشفافة — تتلاشى من الأسفل لتندمج بالخلفية */}
            <Image
              src="/brand/profile.png"
              alt={displayName}
              width={1023}
              height={1149}
              priority
              className="relative z-[5] mx-auto h-auto w-full object-contain"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 74%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, #000 74%, transparent 100%)",
              }}
            />
          </div>

          {/* النصّان مرفوعان داخل حاوية فوق الصورة ليتداخلا مع أسفلها المتلاشي */}
          <div className="relative z-10 -mt-16 w-full sm:-mt-13">
            {/* الترحيب */}
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-[family-name:var(--font-display)] text-4xl leading-[1.35] text-espresso sm:text-5xl"
            >
              أهلاً، أنا{" "}
              <span className="text-gold-gradient">{displayName}</span>،
            </motion.h1>

            {/* المسمّى المتغيّر — بنفس خط وحجم سطر الترحيب */}
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-[1.35] text-espresso sm:text-5xl">
              <Typewriter />
            </p>
          </div>
        </div>

        {/* العمود الداعم: جملة تعريفية + شرائط التخصّصات + الأزرار.
            الجملة والشرائط تظهران على الشاشات الكبيرة فقط ليبقى الجوال كما هو */}
        <div className="mt-10 w-full lg:mt-0">
          {/* جملة تعريفية تملأ عرض العمود الثاني على الشاشات الكبيرة */}
          <p className="hidden font-[family-name:var(--font-display)] text-2xl leading-[1.8] text-espresso/85 lg:block">
            من الفكرة إلى الإتقان — أمزج التصميم والحركة والصوت والبرمجة في عملٍ
            واحدٍ متماسك.
          </p>

          {/* شرائط التخصّصات الخمسة */}
          <ul className="mt-6 hidden flex-wrap gap-2.5 lg:flex">
            {DISCIPLINES.map((d) => {
              const Icon = d.icon;
              return (
                <li
                  key={d.slug}
                  className="inline-flex items-center gap-2 rounded-full border border-espresso/10 bg-parchment/70 px-3.5 py-1.5 text-sm text-espresso/80"
                >
                  <Icon className="h-4 w-4 text-espresso/70" />
                  {d.title}
                </li>
              );
            })}
          </ul>

          {/* الأزرار */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:mt-8 lg:justify-start">
            <Link
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-3.5 text-base font-semibold text-cream transition-transform hover:scale-[1.03]"
            >
              شاهد الأعمال
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-espresso/15 px-7 py-3.5 text-base font-semibold text-espresso transition-colors hover:bg-espresso/5"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل معي
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
