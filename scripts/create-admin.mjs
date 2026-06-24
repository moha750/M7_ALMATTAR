// إنشاء/تحديث حساب الأدمن للوحة التحكم عبر Supabase Auth Admin API.
// يقرأ القيم من .env.local ولا يطبع كلمة المرور.
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey || !email || !password) {
  console.error(
    "✗ تحتاج في .env.local: NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY و ADMIN_EMAIL و ADMIN_PASSWORD",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: list, error: listErr } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (listErr) {
  console.error("✗", listErr.message);
  process.exit(1);
}

const existing = list.users.find(
  (u) => u.email?.toLowerCase() === email.toLowerCase(),
);

if (existing) {
  const { error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
    app_metadata: { ...existing.app_metadata, role: "admin" },
  });
  if (error) {
    console.error("✗", error.message);
    process.exit(1);
  }
  console.log(`✅ حُدِّث حساب الأدمن: ${email} (الدور: admin).`);
} else {
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" },
  });
  if (error) {
    console.error("✗", error.message);
    process.exit(1);
  }
  console.log(`✅ أُنشئ حساب الأدمن: ${email} (الدور: admin).`);
}
