import { createClient } from "@/lib/supabase/server";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export const metadata = { title: "الحساب" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="mb-1 font-[family-name:var(--font-heading)] text-3xl font-bold">
        الحساب
      </h1>
      <p className="mb-8 text-espresso/60">
        بريد الدخول:{" "}
        <span dir="ltr" className="font-medium">
          {user?.email}
        </span>
      </p>

      <div className="rounded-2xl border border-espresso/10 bg-parchment p-6">
        <h2 className="mb-4 font-[family-name:var(--font-heading)] text-lg font-bold">
          تغيير كلمة المرور
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
