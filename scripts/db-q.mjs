import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const c = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});
await c.connect();
const r = await c.query(
  "select id, title_ar, is_published, cover_path from public.projects order by created_at desc",
);
console.log("projects:", r.rowCount);
for (const row of r.rows)
  console.log(
    ` - ${row.title_ar} | published=${row.is_published} | cover=${row.cover_path ?? "—"}`,
  );
await c.end();
