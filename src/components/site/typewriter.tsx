"use client";

import { useEffect, useState } from "react";

/** يكتب الكلمات حرفًا حرفًا ثم يمسحها وينتقل للتالية (وفي «تقليل الحركة» يبدّلها كاملة). */
export function Typewriter({ words, className = "" }: { words: string[]; className?: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;
    let n = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const chars = Array.from(words[i]);
      if (reduce) {
        setText(words[i]);
        i = (i + 1) % words.length;
        timer = setTimeout(tick, 2200);
        return;
      }
      let delay = deleting ? 45 : 95;
      if (!deleting && n < chars.length) n += 1;
      else if (!deleting) {
        deleting = true;
        delay = 1700;
      } else if (n > 0) n -= 1;
      else {
        deleting = false;
        i = (i + 1) % words.length;
        delay = 350;
      }
      setText(Array.from(words[i]).slice(0, n).join(""));
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [words]);

  return (
    <span className={className}>
      <span aria-hidden>{text}</span>
      <span aria-hidden className="caret ms-1 inline-block w-[.06em] translate-y-[.08em] bg-current align-baseline" style={{ height: ".9em" }} />
      <span className="sr-only">{words.join("، ")}</span>
    </span>
  );
}
