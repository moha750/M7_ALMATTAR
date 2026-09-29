"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

// شكل موجة ثابت مرسوم باليد
const WAVE =
  "M0 30 Q 9 6 18 30 Q 27 54 36 30 Q 45 12 54 30 Q 63 48 72 30 Q 81 2 90 30 Q 99 58 108 30 Q 117 16 126 30 Q 135 44 144 30 Q 153 8 162 30 Q 171 52 180 30 Q 189 20 198 30 Q 207 40 216 30 Q 225 10 234 30 Q 243 50 252 30 Q 261 18 270 30 Q 279 42 288 30 Q 297 24 306 30 Q 315 36 324 30 Q 333 28 342 30 L 360 30";

/** مشغّل النبذة الصوتية بصوت محمد. بدون ملف: يظهر كـ«قريبًا». */
export function VoicePlayer({ src }: { src: string | null }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const onTime = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-dashed border-gilt/50 px-5 py-4 sm:gap-5">
      {src && <audio ref={audio} src={src} preload="none" />}
      <button
        type="button"
        onClick={toggle}
        disabled={!src}
        aria-label={playing ? "إيقاف النبذة الصوتية" : "تشغيل النبذة الصوتية"}
        className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-gilt text-night transition-transform enabled:hover:scale-105 disabled:opacity-50"
      >
        {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-[17px] font-semibold text-ivory">
          اسمع نبذتي بصوتي
          {!src && <span className="ms-2 text-sm font-normal text-ivory/55">[التسجيل قريبًا]</span>}
        </span>
        <svg viewBox="0 0 360 60" preserveAspectRatio="none" className="h-10 w-full" fill="none" aria-hidden>
          <defs>
            <clipPath id="voice-progress">
              <rect x={360 - 360 * progress} y="0" width={360 * progress} height="60" />
            </clipPath>
          </defs>
          <path d={WAVE} stroke="#D8A850" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d={WAVE} stroke="#F0D38F" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" clipPath="url(#voice-progress)" />
        </svg>
      </div>
    </div>
  );
}
