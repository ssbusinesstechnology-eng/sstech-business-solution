import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { AUDIENCES } from "@/lib/content";

export function AudiencesSection({ id = "who-we-serve" }: { id?: string }) {
  return (
    <Section
      id={id}
      eyebrow="Who we serve"
      title="Solutions for businesses and professionals"
      description="Different clients need different starting points. These are the pathways we work through most often."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AUDIENCES.map((audience, i) => (
          <Reveal key={audience.title} delay={i * 50}>
            <article className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/60">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-primary">
                <audience.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-sans text-base font-semibold">{audience.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{audience.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
