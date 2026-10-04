import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Shell } from "@/components/site/shell";
import { Cover } from "@/components/site/cover";
import { Player } from "@/components/site/player";
import { BigLink } from "@/components/site/big-link";
import { Reveal } from "@/components/reveal";
import { getJourneyBySlug, getJourneys, getProjectMedia } from "@/lib/queries";
import { isPending } from "@/lib/journeys";
import { publicUrl } from "@/lib/storage";
import { toEmbedUrl } from "@/lib/embed";
import { DISCIPLINES, skillHref } from "@/lib/disciplines";
import { PageHead } from "@/components/site/page-head";

const BY = new Map(DISCIPLINES.map((d) => [d.slug, d]));
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
      <PageHead>
        <Link href="/work" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-bone/60 transition-colors hover:text-bone">
          <ArrowRight className="h-4 w-4" />
          كل الأعمال
        </Link>
        <h1 className="mt-5 font-display text-[clamp(60px,8vw,132px)] leading-[1.08]">{w.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {w.skills.map((s) => (
            <Link
              key={s}
              href={skillHref(s)}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors hover:border-bone/40"
            >
              <i className="h-2 w-2 rounded-full" style={{ background: BY.get(s)?.color }} />
              {BY.get(s)?.title}
            </Link>
          ))}
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            {w.subtitle && <p className="text-[clamp(20px,1.8vw,26px)] leading-[1.6]">{w.subtitle}</p>}
            {!isPending(w.summary) && <p className="mt-2 text-[18px] leading-[1.75] text-bone/62">{w.summary}</p>}
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            {w.roles.length > 0 && <p className="text-[14px] text-bone/55 lg:text-left">{w.roles.join(" · ")}</p>}
            {w.projectUrl && (
              <a
                href={w.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-sun px-6 text-[15px] font-semibold text-[#120c02] transition-all hover:-translate-y-0.5 hover:bg-sun-2"
              >
                زيارة العمل ←
              </a>
            )}
          </div>
        </div>
      </PageHead>

      <article className="wrap pb-28 pt-10 lg:pb-36 lg:pt-14">
        <Reveal>
          <figure className="group relative aspect-[4/3] overflow-hidden rounded-[32px] border border-bone/10 sm:aspect-[16/9]">
            {w.videoUrl ? (
              <Player url={w.videoUrl} title={w.title}>
                <Cover w={w} priority sizes="(max-width: 1480px) 100vw, 1360px" />
              </Player>
            ) : (
              <Cover w={w} priority sizes="(max-width: 1480px) 100vw, 1360px" />
            )}
          </figure>
        </Reveal>

        {/* المسودة والنتيجة: تظهران حين تُرفع المسودة الحقيقية */}
        {w.sketch && (
          <Reveal className="mt-5 grid gap-5 md:grid-cols-2">
            <Frame label="المسودة" src={w.sketch} alt={`مسودة ${w.title}`} />
            {w.cover && <Frame label="النتيجة" src={w.cover} alt={w.title} />}
          </Reveal>
        )}

        {notes.length > 0 && (
          <Reveal className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-3">
            {notes.map((x) => (
              <div key={x.k} className="glass rounded-[24px] p-7">
                <p className="text-[13px] font-semibold text-sun">{x.k}</p>
                <p className="mt-3 text-[18px] leading-[1.85] text-bone/85">{x.v}</p>
              </div>
            ))}
          </Reveal>
        )}

        {project?.description_ar && (
          <div className="mt-16 max-w-[820px] whitespace-pre-wrap text-[18px] leading-[1.95] text-bone/80">{project.description_ar}</div>
        )}

        {media.length > 0 && (
          <div className="mt-16 grid gap-5">
            {media.map((m) => (
              <MediaItem key={m.id} item={m} alt={w.title} />
            ))}
          </div>
        )}

        {next && next.slug !== w.slug && (
          <div className="mt-24">
            <p className="mb-3 text-[13px] font-semibold text-bone/55">العمل التالي</p>
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
      <div className="glass relative aspect-[4/3] overflow-hidden rounded-[24px]">
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 700px" className="object-contain" />
      </div>
      <figcaption className="mt-3 text-[13px] font-semibold text-bone/60">{label}</figcaption>
    </figure>
  );
}

function MediaItem({ item, alt }: { item: ProjectMedia; alt: string }) {
  if (item.kind === "image") {
    const src = publicUrl(item.storage_path) ?? item.external_url;
    if (!src) return null;
    return (
      <div className="relative aspect-video overflow-hidden rounded-[24px] border border-bone/10">
        <Image src={src} alt={item.alt_ar ?? alt} fill sizes="(max-width: 1520px) 100vw, 1410px" className="object-cover" />
      </div>
    );
  }
  if (item.kind === "video") {
    const embed = toEmbedUrl(item.external_url);
    if (embed) {
      return (
        <div className="relative aspect-video overflow-hidden rounded-[24px] bg-black">
          <iframe src={embed} title={item.alt_ar ?? alt} className="h-full w-full" allow="fullscreen; picture-in-picture" allowFullScreen />
        </div>
      );
    }
    const src = publicUrl(item.storage_path) ?? item.external_url;
    return src ? <video src={src} controls className="w-full rounded-[24px] bg-black" /> : null;
  }
  if (item.kind === "audio") {
    const src = publicUrl(item.storage_path, "audio") ?? item.external_url;
    if (!src) return null;
    return (
      <div className="glass rounded-[24px] p-5">
        {item.alt_ar && <p className="mb-3 text-[14px] text-bone/60">{item.alt_ar}</p>}
        <audio src={src} controls className="w-full" />
      </div>
    );
  }
  return item.external_url ? (
    <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="text-[17px] text-sun underline underline-offset-4">
      {item.alt_ar ?? item.external_url} ↗
    </a>
  ) : null;
}
