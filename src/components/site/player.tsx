"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { isDirectVideo, toEmbedUrl } from "@/lib/embed";

/** يعرض الغلاف، وعند الضغط يشغّل الفيديو مكانه. */
export function Player({ url, title, children }: { url: string; title: string; children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const embed = toEmbedUrl(url);
  const direct = isDirectVideo(url) ? url : null;

  if (on && embed) {
    return (
      <iframe
        src={`${embed}${embed.includes("?") ? "&" : "?"}autoplay=1`}
        title={title}
        className="absolute inset-0 h-full w-full bg-black"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (on && direct) {
    return <video src={direct} controls autoPlay className="absolute inset-0 h-full w-full bg-black object-contain" />;
  }
  return (
    <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 block" aria-label={`شاهد ${title}`}>
      {children}
      <span className="absolute bottom-6 right-6 flex items-center gap-3 bg-paper px-5 py-3 text-[16px] font-semibold text-ink transition-colors group-hover:bg-accent">
        <Play className="h-4 w-4 fill-current" />
        شاهد العمل
      </span>
    </button>
  );
}
