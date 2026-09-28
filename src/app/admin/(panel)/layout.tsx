import { Logo } from "@/components/logo";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { signOut } from "../actions";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // حارس: لا بد من مستخدم بدور أدمن.
  if (!user) redirect("/admin/login");
  if (user.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-dvh bg-cream text-espresso">
      {/* الشريط الجانبي (يبدأ من اليمين في RTL) */}
      <aside className="section-dark sticky top-0 hidden h-dvh w-64 shrink-0 flex-col p-5 md:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-2">
          <Logo className="h-9 w-auto" />
          <span className="text-sm font-semibold text-cream/80">لوحة التحكم</span>
        </Link>

        <AdminNav />

        <div className="mt-auto space-y-1 border-t border-cream/10 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            <ExternalLink className="h-[18px] w-[18px]" />
            زيارة الموقع
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <LogOut className="h-[18px] w-[18px]" />
              تسجيل الخروج
            </button>
          </form>
          <p className="px-4 pt-2 text-xs text-cream/40" dir="ltr">
            {user.email}
          </p>
        </div>
      </aside>

      {/* المحتوى */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
