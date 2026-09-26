import type { ReactNode } from "react";

import { Reveal } from "@/components/Reveal";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative overflow-hidden border-t border-border/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-12 grid gap-5 md:grid-cols-[minmax(0,0.78fr)_minmax(18rem,0.42fr)] md:items-end md:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{title}</h2>
          </div>
          {description && <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/** Same visual rhythm as Section but renders an <h1> — used at the top of sub-pages. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
          {description && <p className="mt-5 text-lg text-muted-foreground">{description}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
