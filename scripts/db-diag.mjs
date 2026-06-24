import pg from "pg";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

const pol = await client.query(
  `select policyname, permissive, roles, cmd, with_check
   from pg_policies where tablename='contact_messages' order by policyname`,
);
console.log("سياسات contact_messages:");
for (const p of pol.rows) {
  console.log(
    `  - ${p.policyname} | ${p.permissive} | ${p.cmd} | roles=${p.roles} | check=${p.with_check}`,
  );
}
await client.end();

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const a = await sb
  .from("contact_messages")
  .insert({ name: "ا", email: "diag1@example.com", message: "م" });
console.log("إدراج بدون select:", a.error ? a.error.message : "OK");

const b = await sb
  .from("contact_messages")
  .insert({ name: "ا", email: "diag2@example.com", message: "م" })
  .select();
console.log("إدراج مع select:", b.error ? b.error.message : "OK");
