import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { Waypoint } from "@/components/site/waypoint";
import { Reveal } from "@/components/reveal";
import { SketchPanel, ResultPanel } from "@/components/site/journey-panels";
import { Bridge, Notes } from "@/components/site/journeys";
import { getJourneyBySlug, getJourneys, getProjectMedia } from "@/lib/queries";
import { publicUrl } from "@/lib/storage";
import { toEmbedUrl } from "@/lib/embed";
import type { ProjectMedia } from "@/lib/database.types";
import { skillHref, skillTitle } from "@/lib/disciplines";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getJourneyBySlug(slug);
  return {
    title: found?.journey.title ?? "رحلة",
    description: found?.journey.summary ?? undefined,
  };
}

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getJourneyBySlug(slug);
  if (!found) notFound();
  const { journey: j, project } = found;

  const [media, all] = await Promise.all([
    project ? getProjectMedia(project.id) : Promise.resolve([] as ProjectMedia[]),
    getJourneys(),
  ]);
  const idx = all.findIndex((x) => x.slug === j.slug);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;

  return (
    <PageShell>
      <article className="relative z-10">
        <div className="shell pt-10 lg:pt-16">
          <div className="flex justify-end">
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 py-2 text-[15px] text-ivory/65 hover:text-gilt-light"
            >
              <ArrowRight className="h-4 w-4" />
              كل الأعمال
            </Link>
          </div>

          <div className="mt-8">
            <Waypoint label="رحلة فكرة" />
          </div>
          <Reveal>
            <h1 className="mt-6 font-display text-[60px] leading-[1.2] sm:text-[110px]">{j.title}</h1>
            {j.subtitle && <p className="mt-2 text-lg text-ivory/75 sm:text-[22px]">{j.subtitle}</p>}
            {j.summary && (
              <p className="mt-6 max-w-[760px] text-lg leading-[1.9] text-ivory/85 sm:text-[21px]">{j.summary}</p>
            )}
          </Reveal>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {j.skills.map((s) => (
              <Link
                key={s}
                href={skillHref(s)}
                className="rounded-full border border-dashed border-gilt/50 px-4 py-2 text-[14px] text-gilt-light transition-colors hover:border-gilt hover:bg-gilt/10"
              >
                {skillTitle(s)}
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            {j.roles.length > 0 && <p className="text-[15px] text-ivory/70">{j.roles.join(" · ")}</p>}
            {j.projectUrl && (
              <a
                href={j.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] bg-gilt px-5 py-3 text-[15px] font-semibold text-night"
              >
                <ExternalLink className="h-4 w-4" />
                زيارة العمل
              </a>
            )}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-14 grid items-stretch lg:grid-cols-[minmax(0,1fr)_140px_minmax(0,1.5fr)]">
              <div className="lg:min-h-[520px]">
                <SketchPanel j={j} />
              </div>
              <div className="hidden lg:flex">
                <Bridge text={j.bridge} />
              </div>
              <div className="lg:hidden">
                <Bridge text={j.bridge} vertical />
              </div>
              <div className="min-h-[340px] lg:min-h-[520px]">
                <ResultPanel j={j} />
              </div>
            </div>
          </Reveal>

          <div className="mt-24">
            <Waypoint label="كيف نضجت" />
            <div className="mt-8">
              <Notes j={j} />
            </div>
          </div>

          {project?.description_ar && (
            <div className="mt-14 max-w-[820px] whitespace-pre-wrap text-lg leading-[1.95] text-ivory/85">
              {project.description_ar}
            </div>
          )}

          {media.length > 0 && (
            <div className="mt-16 grid gap-6">
              {media.map((m) => (
                <MediaItem key={m.id} item={m} alt={j.title} />
              ))}
            </div>
          )}

          {/* الرحلة التالية + الدعوة */}
          <div className="mt-28 grid gap-6 pb-28 md:grid-cols-2">
            {next && next.slug !== j.slug && (
              <Link
                href={next.href}
                className="group flex flex-col gap-2 rounded-2xl border border-dashed border-gilt/45 bg-night/85 p-7 transition-colors hover:border-gilt"
              >
                <span className="text-[15px] text-gilt">الرحلة التالية</span>
                <span className="flex items-center justify-between font-display text-4xl sm:text-5xl">
                  {next.title}
                  <ArrowLeft className="h-7 w-7 text-gilt transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            )}
            <div className="flex flex-col gap-4 rounded-2xl bg-gilt p-7 text-night">
              <span className="text-[15px] font-medium">فكرتك</span>
              <span className="font-display text-4xl sm:text-5xl">عندك فكرة؟</span>
              <Link href="/#contact" className="self-start rounded-[10px] bg-night px-6 py-3 text-[16px] font-semibold text-ivory">
                لنحلّق بها معًا
              </Link>
            </div>
          </div>
        </div>
      </article>
    </PageShell>
  );
}

function MediaItem({ item, alt }: { item: ProjectMedia; alt: string }) {
  if (item.kind === "image") {
    const src = publicUrl(item.storage_path) ?? item.external_url;
    if (!src) return null;
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-gilt/20 bg-midnight">
        <Image src={src} alt={item.alt_ar ?? alt} fill sizes="(max-width: 1296px) 100vw, 1296px" className="object-cover" />
      </div>
    );
  }
  if (item.kind === "video") {
    const embed = toEmbedUrl(item.external_url);
    if (embed) {
      return (
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-gilt/20 bg-black">
          <iframe src={embed} title={item.alt_ar ?? alt} className="h-full w-full" allow="fullscreen; picture-in-picture" allowFullScreen />
        </div>
      );
    }
    const src = publicUrl(item.storage_path) ?? item.external_url;
    return src ? <video src={src} controls className="w-full rounded-2xl border border-gilt/20 bg-black" /> : null;
  }
  if (item.kind === "audio") {
    const src = publicUrl(item.storage_path, "audio") ?? item.external_url;
    if (!src) return null;
    return (
      <div className="rounded-2xl border border-dashed border-gilt/45 p-5">
        {item.alt_ar && <p className="mb-2 text-[15px] text-ivory/75">{item.alt_ar}</p>}
        <audio src={src} controls className="w-full" />
      </div>
    );
  }
  return item.external_url ? (
    <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gilt-light hover:underline">
      <ExternalLink className="h-4 w-4" />
      {item.alt_ar ?? item.external_url}
    </a>
  ) : null;
}
