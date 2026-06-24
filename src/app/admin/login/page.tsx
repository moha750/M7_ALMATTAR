import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata = { title: "تسجيل الدخول" };

export default async function LoginPage() {
  // إن كان مسجّلًا بالفعل، انتقل للوحة مباشرة.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <main className="grain flex min-h-dvh items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/brand/logo.png"
            alt="الشعار"
            width={140}
            height={80}
            priority
            className="h-14 w-auto"
          />
          <h1 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold text-espresso">
            لوحة التحكم
          </h1>
          <p className="mt-1 text-sm text-espresso/60">
            سجّل الدخول لإدارة أعمالك ومحتوى الموقع
          </p>
        </div>

        <div className="rounded-2xl border border-espresso/10 bg-cream/80 p-7 shadow-[0_20px_60px_-30px_rgba(28,26,23,0.5)]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
