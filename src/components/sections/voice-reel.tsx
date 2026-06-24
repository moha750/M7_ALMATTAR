"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import type WaveSurfer from "wavesurfer.js";

export function VoiceReel({ url }: { url?: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!url || !containerRef.current) return;
    let cancelled = false;
    let ws: WaveSurfer | null = null;

    (async () => {
      const WaveSurferMod = (await import("wavesurfer.js")).default;
      if (cancelled || !containerRef.current) return;
      ws = WaveSurferMod.create({
        container: containerRef.current,
        waveColor: "#8A8073",
        progressColor: "#D2A45C",
        cursorColor: "#D2A45C",
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
        height: 72,
        url,
      });
      wsRef.current = ws;
      ws.on("ready", () => setReady(true));
      ws.on("play", () => setPlaying(true));
      ws.on("pause", () => setPlaying(false));
      ws.on("finish", () => setPlaying(false));
    })();

    return () => {
      cancelled = true;
      ws?.destroy();
      wsRef.current = null;
    };
  }, [url]);

  if (!url) {
    return (
      <p className="text-cream/70">
        قريبًا — أضف رابط ملف التعليق الصوتي من إعدادات لوحة التحكم ليظهر مشغّل
        الموجة هنا.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-cream/10 bg-walnut/40 p-5">
      <button
        onClick={() => wsRef.current?.playPause()}
        disabled={!ready}
        aria-label={playing ? "إيقاف" : "تشغيل"}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-espresso transition-transform hover:scale-105 disabled:opacity-50"
      >
        {playing ? (
          <Pause className="h-6 w-6 fill-espresso" />
        ) : (
          <Play className="h-6 w-6 translate-x-[1px] fill-espresso" />
        )}
      </button>
      <div ref={containerRef} className="min-w-0 flex-1" />
    </div>
  );
}
