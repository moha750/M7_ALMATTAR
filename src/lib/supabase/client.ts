import { createBrowserClient } from "@supabase/ssr";

/**
 * عميل Supabase للمتصفّح (Client Components).
 * يُستخدم في النماذج التفاعلية ولوحة التحكم على جهة العميل.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
