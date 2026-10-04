"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/** زر «اسمعني» — يظهر فقط حين يُرفع التسجيل الصوتي. */
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
      aria-label={playing ? "إيقاف" : "اسمعني"}
      className="inline-flex h-[60px] items-center gap-3 rounded-full border border-bone/30 pe-7 ps-2 text-[17px] font-semibold transition-all hover:-translate-y-0.5 hover:border-bone"
    >
      <audio ref={audio} src={src} preload="none" onEnded={() => setPlaying(false)} />
      <span className="grid h-11 w-11 place-items-center rounded-full bg-bone text-void">
        {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
      </span>
      اسمعني
    </button>
  );
}
