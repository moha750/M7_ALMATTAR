import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

/** غلاف الصفحات العامة: ورق وحبر. */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div id="top" className="flex min-h-dvh flex-col bg-paper text-ink">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
