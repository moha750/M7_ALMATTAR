import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { FlightPath } from "@/components/site/flight-path";

/** غلاف الصفحات العامة: خلفية المخطّط، الهيدر، مسار التحليق، والتذييل. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="blueprint flex min-h-dvh flex-col text-ivory">
      <SiteHeader />
      <main className="relative flex-1">
        <FlightPath />
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
