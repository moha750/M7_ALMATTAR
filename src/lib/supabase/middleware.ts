import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * يُحدّث جلسة Supabase على كل طلب ويحمي مسارات /admin.
 * إن لم تُضبط متغيّرات البيئة بعد (قبل إنشاء مشروع Supabase) يتخطّى بأمان.
 */
export async function updateSession(request: NextRequest) {
  // حارس: لا تُعطّل الموقع إن لم تُربط Supabase بعد.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // مهم: لا تُدرج منطقًا بين createServerClient و getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminArea =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  // حماية لوحة التحكم: غير المسجّل يُحوّل لصفحة الدخول.
  if (isAdminArea && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
