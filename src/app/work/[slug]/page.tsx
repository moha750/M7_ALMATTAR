import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Shell } from "@/components/site/shell";
import { Cover } from "@/components/site/cover";
import { Player } from "@/components/site/player";
import { BigLink } from "@/components/site/big-link";
import { Reveal } from "@/components/reveal";
import { getJourneyBySlug, getJourneys, getProjectMedia } from "@/lib/queries";
import { isPending } from "@/lib/journeys";
import { publicUrl } from "@/lib/storage";
import { toEmbedUrl } from "@/lib/embed";
import { skillHref, skillTitle } from "@/lib/disciplines";
import type { ProjectMedia } from "@/lib/database.types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = await getJourneyBySlug(slug);
  return {
    title: found?.journey.title ?? "عمل",
    description: found?.journey.summary ?? undefined,
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = await getJourneyBySlug(slug);
  if (!found) notFound();
  const { journey: w, project } = found;

  const [media, all] = await Promise.all([
    project ? getProjectMedia(project.id) : Promise.resolve([] as ProjectMedia[]),
    getJourneys(),
  ]);
  const idx = all.findIndex((x) => x.slug === w.slug);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;

  const notes = [
    { k: "التحدي", v: w.challenge },
    { k: "الفكرة", v: w.idea },
    { k: "التنفيذ", v: w.execution },
  ].filter((x) => !isPending(x.v));

  return (
    <Shell>
      <article className="wrap pb-28 pt-6 lg:pb-40 lg:pt-10">
        <div className="t-meta flex items-center justify-between gap-4 border-b border-ink/15 pb-4">
          <Link href="/work" className="inline-flex items-center gap-1.5 text-ink/60 transition-colors hover:text-ink">
            <ArrowRight className="h-4 w-4" />
            كل الأعمال
          </Link>
          <span className="flex flex-wrap justify-end gap-x-4">
            {w.skills.map((s) => (
              <Link key={s} href={skillHref(s)} className="underline-offset-4 hover:underline">
                {skillTitle(s)}
              </Link>
            ))}
          </span>
        </div>

        <h1 className="t-xl mt-8 lg:mt-10">{w.title}</h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {w.subtitle && <p className="text-[22px] leading-[1.6] lg:text-[26px]">{w.subtitle}</p>}
            {!isPending(w.summary) && (
              <p className="mt-2 text-[18px] leading-[1.7] text-ink/65 lg:text-[20px]">{w.summary}</p>
            )}
          </div>
          <div className="flex flex-col items-start gap-5 lg:col-span-5 lg:items-end">
            {w.roles.length > 0 && <p className="t-meta text-ink/60 lg:text-left">{w.roles.join(" · ")}</p>}
            {w.projectUrl && (
              <a
                href={w.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center gap-3 bg-ink px-6 text-[15px] font-semibold text-paper transition-colors hover:bg-ink-2"
              >
                زيارة العمل
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </a>
            )}
          </div>
        </div>

        <Reveal className="mt-10 lg:mt-14">
          <figure className="group relative aspect-[4/3] overflow-hidden bg-paper-2 sm:aspect-[16/9]">
            {w.videoUrl ? (
              <Player url={w.videoUrl} title={w.title}>
                <Cover w={w} priority sizes="(max-width: 1520px) 100vw, 1410px" />
              </Player>
            ) : (
              <Cover w={w} priority sizes="(max-width: 1520px) 100vw, 1410px" />
            )}
          </figure>
        </Reveal>

        {/* المسودة ← النتيجة: تظهر حين تُرفع المسودة الحقيقية */}
        {w.sketch && (
          <Reveal className="mt-6 grid gap-6 md:grid-cols-2">
            <Frame label="المسودة" src={w.sketch} alt={`مسودة ${w.title}`} />
            {w.cover && <Frame label="النتيجة" src={w.cover} alt={w.title} />}
          </Reveal>
        )}

        {notes.length > 0 && (
          <Reveal className="mt-16 grid gap-10 border-t border-ink pt-8 lg:mt-24 lg:grid-cols-3 lg:gap-8">
            {notes.map((x) => (
              <div key={x.k}>
                <p className="t-meta text-accent">{x.k}</p>
                <p className="mt-3 text-[19px] leading-[1.8] lg:text-[20px]">{x.v}</p>
              </div>
            ))}
          </Reveal>
        )}

        {project?.description_ar && (
          <div className="mt-16 max-w-[820px] whitespace-pre-wrap text-[19px] leading-[1.9] text-ink/85">
            {project.description_ar}
          </div>
        )}

        {media.length > 0 && (
          <div className="mt-16 grid gap-6">
            {media.map((m) => (
              <MediaItem key={m.id} item={m} alt={w.title} />
            ))}
          </div>
        )}

        {next && next.slug !== w.slug && (
          <div className="mt-24 lg:mt-32">
            <p className="t-meta mb-3 text-ink/55">العمل التالي</p>
            <BigLink href={next.href} label={next.title} />
          </div>
        )}
      </article>
    </Shell>
  );
}

function Frame({ label, src, alt }: { label: string; src: string; alt: string }) {
  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 700px" className="object-contain" />
      </div>
      <figcaption className="t-meta mt-3 text-ink/60">{label}</figcaption>
    </figure>
  );
}

function MediaItem({ item, alt }: { item: ProjectMedia; alt: string }) {
  if (item.kind === "image") {
    const src = publicUrl(item.storage_path) ?? item.external_url;
    if (!src) return null;
    return (
      <div className="relative aspect-video overflow-hidden bg-paper-2">
        <Image src={src} alt={item.alt_ar ?? alt} fill sizes="(max-width: 1520px) 100vw, 1410px" className="object-cover" />
      </div>
    );
  }
  if (item.kind === "video") {
    const embed = toEmbedUrl(item.external_url);
    if (embed) {
      return (
        <div className="relative aspect-video overflow-hidden bg-black">
          <iframe src={embed} title={item.alt_ar ?? alt} className="h-full w-full" allow="fullscreen; picture-in-picture" allowFullScreen />
        </div>
      );
    }
    const src = publicUrl(item.storage_path) ?? item.external_url;
    return src ? <video src={src} controls className="w-full bg-black" /> : null;
  }
  if (item.kind === "audio") {
    const src = publicUrl(item.storage_path, "audio") ?? item.external_url;
    if (!src) return null;
    return (
      <div className="border-y border-ink/15 py-5">
        {item.alt_ar && <p className="t-meta mb-3 text-ink/60">{item.alt_ar}</p>}
        <audio src={src} controls className="w-full" />
      </div>
    );
  }
  return item.external_url ? (
    <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="text-[17px] underline underline-offset-4">
      {item.alt_ar ?? item.external_url} ↗
    </a>
  ) : null;
}
