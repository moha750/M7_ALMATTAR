import { Reveal } from "@/components/reveal";

/** قسم عام بعنوان فرعي وعنوان رئيسي، مع كشف لطيف عند التمرير. */
export function Section({
  id,
  eyebrow,
  title,
  dark = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  dark?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${dark ? "section-dark" : ""} scroll-mt-24 border-t ${
        dark ? "border-cream/10" : "border-espresso/5"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p
            className={`font-[family-name:var(--font-tech)] text-sm font-medium tracking-widest ${
              dark ? "text-gold" : "text-gold-deep"
            }`}
          >
            {eyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold">
            {title}
          </h2>
        </Reveal>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
