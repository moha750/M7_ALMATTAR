// مُشغّل ملفات SQL عبر اتصال Postgres مباشر بـ Supabase.
// الاستخدام: node scripts/db-run.mjs supabase/migrations/0001_init.sql [...]
// لا يطبع سلسلة الاتصال أو أي أسرار.
import { readFileSync } from "node:fs";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("✗ SUPABASE_DB_URL غير مضبوط في .env.local");
  process.exit(1);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("الاستخدام: node scripts/db-run.mjs <file.sql> [...]");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  for (const f of files) {
    const sql = readFileSync(f, "utf8");
    process.stdout.write(`▶ تنفيذ ${f} ... `);
    await client.query(sql);
    console.log("تم ✓");
  }
  console.log("✅ اكتمل تنفيذ كل الملفات بنجاح.");
} catch (e) {
  console.error("\n✗ خطأ في التنفيذ:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
