/** رأس الصفحات الداخلية: إضاءة خفيفة + مسافة الهيدر الثابت. */
export function PageHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate pt-[124px] lg:pt-[150px]">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(50% 70% at 85% 0%, rgba(227,176,75,.16), transparent 70%)" }}
      />
      <div className="wrap">{children}</div>
    </div>
  );
}
