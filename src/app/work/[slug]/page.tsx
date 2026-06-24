import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getProjectBySlug, getProjectMedia } from "@/lib/queries";
import { publicUrl } from "@/lib/storage";
import { toEmbedUrl } from "@/lib/embed";
import { DISCIPLINES } from "@/lib/disciplines";

const CAT_LABEL: Record<string, string> = Object.fromEntries(
  DISCIPLINES.map((d) => [d.slug, d.title]),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project?.title_ar ?? "مشروع" };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const media = await getProjectMedia(project.id);
  const cover = publicUrl(project.cover_path);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-6 py-16">
          <Link
            href="/#work"
            className="inline-flex items-center gap-1 text-sm text-espresso/60 hover:text-espresso"
          >
            <ArrowRight className="h-4 w-4" />
            رجوع للأعمال
          </Link>

          <p className="mt-6 font-[family-name:var(--font-tech)] text-sm font-medium tracking-widest text-gold-deep">
            {CAT_LABEL[project.category] ?? project.category}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-[1.3] text-espresso sm:text-5xl">
            {project.title_ar}
          </h1>
          {project.summary_ar && (
            <p className="mt-4 text-lg text-espresso/75">{project.summary_ar}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-espresso/60">
            {project.client_name && <span>العميل: {project.client_name}</span>}
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-espresso px-4 py-2 font-medium text-cream transition-transform hover:scale-[1.03]"
              >
                <ExternalLink className="h-4 w-4" />
                زيارة المشروع
              </a>
            )}
          </div>

          {cover && (
            <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl border border-espresso/10 bg-parchment">
              <Image
                src={cover}
                alt={project.title_ar}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                priority
                className="object-cover"
              />
            </div>
          )}

          {project.description_ar && (
            <div className="mt-10 whitespace-pre-wrap text-lg leading-loose text-espresso/80">
              {project.description_ar}
            </div>
          )}

          {/* معرض الوسائط */}
          {media.length > 0 && (
            <div className="mt-12 space-y-8">
              {media.map((m) => (
                <MediaItem key={m.id} item={m} alt={project.title_ar} />
              ))}
            </div>
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function MediaItem({
  item,
  alt,
}: {
  item: Awaited<ReturnType<typeof getProjectMedia>>[number];
  alt: string;
}) {
  if (item.kind === "image") {
    const src = publicUrl(item.storage_path) ?? item.external_url;
    if (!src) return null;
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-espresso/10 bg-parchment">
        <Image
          src={src}
          alt={item.alt_ar ?? alt}
          fill
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>
    );
  }

  if (item.kind === "video") {
    const embed = toEmbedUrl(item.external_url);
    if (embed) {
      return (
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-espresso/10 bg-black">
          <iframe
            src={embed}
            title={item.alt_ar ?? alt}
            className="h-full w-full"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    const src = publicUrl(item.storage_path) ?? item.external_url;
    if (!src) return null;
    return (
      <video
        src={src}
        controls
        className="w-full rounded-2xl border border-espresso/10 bg-black"
      />
    );
  }

  if (item.kind === "audio") {
    const src = publicUrl(item.storage_path, "audio") ?? item.external_url;
    if (!src) return null;
    return (
      <div className="rounded-2xl border border-espresso/10 bg-parchment p-5">
        {item.alt_ar && (
          <p className="mb-2 text-sm font-medium text-espresso/70">
            {item.alt_ar}
          </p>
        )}
        <audio src={src} controls className="w-full" />
      </div>
    );
  }

  // external_link
  if (item.external_url) {
    return (
      <a
        href={item.external_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-gold-deep hover:underline"
      >
        <ExternalLink className="h-4 w-4" />
        {item.alt_ar ?? item.external_url}
      </a>
    );
  }
  return null;
}
