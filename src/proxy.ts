import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: ملف الاصطلاح صار "proxy" بدل "middleware".
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * يطابق كل المسارات عدا:
     * - ملفات Next الثابتة والصور
     * - الأيقونة المفضّلة
     * - ملفات الصور الشائعة
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
