import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

/** غلاف الصفحات العامة. */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div id="top" className="flex min-h-dvh flex-col overflow-x-clip bg-void text-bone">
      <div aria-hidden className="film-grain" />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
