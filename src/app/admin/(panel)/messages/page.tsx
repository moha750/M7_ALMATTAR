import { Trash2, MailOpen, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { setMessageRead, deleteMessage } from "../../actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

export const metadata = { title: "الرسائل" };

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-1 font-[family-name:var(--font-heading)] text-3xl font-bold">
        الرسائل
      </h1>
      <p className="mb-6 text-espresso/60">
        {messages?.length ?? 0} رسالة من نموذج التواصل.
      </p>

      {!messages || messages.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-espresso/20 bg-parchment/50 p-12 text-center text-espresso/60">
          لا توجد رسائل بعد.
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-2xl border p-5 ${
                m.is_read
                  ? "border-espresso/10 bg-parchment"
                  : "border-gold/40 bg-gold/5"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{m.name}</span>
                  {m.intent && (
                    <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-medium text-gold-deep">
                      {m.intent}
                    </span>
                  )}
                  <a
                    href={`mailto:${m.email}`}
                    dir="ltr"
                    className="text-sm text-gold-deep hover:underline"
                  >
                    {m.email}
                  </a>
                  {!m.is_read && (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-medium text-espresso">
                      جديد
                    </span>
                  )}
                </div>
                <span className="text-xs text-taupe" dir="ltr">
                  {new Date(m.created_at).toLocaleString("ar")}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-espresso/80">
                {m.message}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <form action={setMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <input
                    type="hidden"
                    name="next"
                    value={(!m.is_read).toString()}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-espresso/70 transition-colors hover:bg-espresso/5"
                  >
                    {m.is_read ? (
                      <>
                        <Mail className="h-4 w-4" />
                        تعليم كغير مقروء
                      </>
                    ) : (
                      <>
                        <MailOpen className="h-4 w-4" />
                        تعليم كمقروء
                      </>
                    )}
                  </button>
                </form>

                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <ConfirmSubmit
                    message="حذف هذه الرسالة؟"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-600/80 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
