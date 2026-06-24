import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries";
import { DISCIPLINES } from "@/lib/disciplines";
import { publicUrl } from "@/lib/storage";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata = { title: "تعديل المشروع" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!project) notFound();

  const categories = await getCategories();
  const cats =
    categories.length > 0
      ? categories.map((c) => ({ slug: c.slug, title: c.title_ar }))
      : DISCIPLINES.map((d) => ({ slug: d.slug, title: d.title }));

  return (
    <div>
      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center gap-1 text-sm text-espresso/60 hover:text-espresso"
      >
        <ArrowRight className="h-4 w-4" />
        رجوع للمشاريع
      </Link>
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-3xl font-bold">
        تعديل المشروع
      </h1>
      <ProjectForm
        categories={cats}
        project={project}
        currentCover={publicUrl(project.cover_path)}
      />
    </div>
  );
}
