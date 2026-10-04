"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/** زر النبذة الصوتية — يظهر فقط حين يُرفع التسجيل. */
export function Voice({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      void a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "إيقاف صوتي" : "اسمع صوتي"}
      className="group inline-flex items-center gap-3 py-2 text-[16px] font-medium"
    >
      <audio ref={audio} src={src} preload="none" onEnded={() => setPlaying(false)} />
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink transition-colors group-hover:bg-ink group-hover:text-paper">
        {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
      </span>
      اسمع صوتي
    </button>
  );
}
