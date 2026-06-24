"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { toEmbedUrl, isDirectVideo } from "@/lib/embed";

export function Showreel({ url }: { url?: string | null }) {
  const [play, setPlay] = useState(false);
  const embed = toEmbedUrl(url);
  const direct = isDirectVideo(url);

  if (!url || (!embed && !direct)) {
    return (
      <p className="text-cream/70">
        قريبًا — أضف رابط الشوريل (يوتيوب/فيميو أو ملف فيديو) من إعدادات لوحة
        التحكم ليظهر هنا.
      </p>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-cream/10 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
      {direct ? (
        <video src={url!} controls className="h-full w-full object-contain" />
      ) : play ? (
        <iframe
          src={`${embed}?autoplay=1`}
          title="الشوريل"
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlay(true)}
          className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-espresso/40 to-transparent"
          aria-label="تشغيل الشوريل"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-espresso transition-transform group-hover:scale-110">
            <Play className="h-8 w-8 translate-x-[2px] fill-espresso" />
          </span>
        </button>
      )}
    </div>
  );
}
