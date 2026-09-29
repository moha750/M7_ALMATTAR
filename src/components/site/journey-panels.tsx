"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { toEmbedUrl, isDirectVideo } from "@/lib/embed";
import type { Journey } from "@/lib/journeys";
import {
  ChaptersArt,
  DoorArt,
  StoryFrameCard,
  WireframeArt,
} from "@/components/site/art";

/** لوحة «المسودة»: صورة المسودة الحقيقية، أو لوحة قصة مرسومة، أو مخطّط سلكي. */
export function SketchPanel({
  j,
  compact = false,
}: {
  j: Journey;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border-[1.5px] border-dashed border-gilt/50 ${
        compact ? "gap-3 p-4 sm:p-5" : "gap-4 p-5 sm:p-7"
      }`}
    >
      <span className="text-sm font-semibold text-gilt">المسودة</span>
      {j.sketch ? (
        <div className="relative min-h-40 flex-1 overflow-hidden rounded-lg">
          <Image
            src={j.sketch}
            alt={`مسودة ${j.title}`}
            fill
            sizes="(max-width: 1024px) 90vw, 500px"
            className="object-contain"
          />
        </div>
      ) : (
        <>
          {j.storyboard && !compact ? (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {j.storyboard.map((f) => (
                <StoryFrameCard key={f.label} frame={f} />
              ))}
            </div>
          ) : (
            <div className="flex-1">
              <WireframeArt />
            </div>
          )}
          {j.sketchNote && (
            <p
              className={`font-hand leading-[1.5] text-gilt-light ${
                compact ? "text-lg" : "text-2xl sm:text-[30px]"
              }`}
            >
              {j.sketchNote}
            </p>
          )}
          {!compact && (
            <span className="mt-auto text-xs text-ivory/55">
              [استبدلها بلوحة القصة أو مسودتك الحقيقية]
            </span>
          )}
        </>
      )}
    </div>
  );
}

/** لوحة «النتيجة»: فيديو، أو صورة الغلاف، أو رسم بديل. */
export function ResultPanel({
  j,
  compact = false,
}: {
  j: Journey;
  compact?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const embed = toEmbedUrl(j.videoUrl);
  const direct = isDirectVideo(j.videoUrl) ? j.videoUrl : null;
  const canPlay = !compact && (embed || direct);

  if (playing && embed) {
    return (
      <div className="relative h-full min-h-64 overflow-hidden rounded-2xl border border-gilt/25 bg-black">
        <iframe
          src={`${embed}${embed.includes("?") ? "&" : "?"}autoplay=1`}
          title={j.title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (playing && direct) {
    return (
      <video
        src={direct}
        controls
        autoPlay
        className="h-full w-full rounded-2xl border border-gilt/25 bg-black object-contain"
      />
    );
  }

  return (
    <div className="panel-result relative flex h-full min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-gilt/25">
      <span className="absolute right-5 top-4 z-10 text-sm font-semibold text-gilt">
        النتيجة
      </span>

      {j.cover ? (
        <Image
          src={j.cover}
          alt={j.title}
          fill
          sizes="(max-width: 1024px) 90vw, 700px"
          className="object-cover"
        />
      ) : j.art === "door" ? (
        <DoorArt className={compact ? "h-44 w-44" : "h-64 w-64 sm:h-[340px] sm:w-[340px]"} />
      ) : j.art === "chapters" ? (
        <div className={compact ? "px-3 sm:px-5" : "px-10"}>
          <ChaptersArt compact={compact} />
        </div>
      ) : (
        <span className="text-sm text-ivory/60">[صورة من {j.title}]</span>
      )}

      {!j.cover && !compact && j.art && (
        <span className="absolute bottom-4 right-5 text-xs text-ivory/55">
          [لقطة من العمل]
        </span>
      )}

      {canPlay && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute bottom-6 left-6 z-10 flex items-center gap-3 text-[17px] font-semibold text-ivory"
        >
          <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gilt text-night transition-transform hover:scale-105">
            <Play className="h-5 w-5 fill-current" />
          </span>
          شاهد العمل
        </button>
      )}
    </div>
  );
}
