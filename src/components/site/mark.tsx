import { LOGO_PATHS, WRITE_ORDER } from "@/components/logo-paths";

/** شعار «محمد» بلون واحد (currentColor) — يُضبط حجمه ولونه عبر className. */
export function Mark({ className, title = "محمد المطر" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 1920 1080" role="img" aria-label={title} fill="currentColor">
      {WRITE_ORDER.map((k) => (
        <path key={k} d={LOGO_PATHS[k]} />
      ))}
    </svg>
  );
}
