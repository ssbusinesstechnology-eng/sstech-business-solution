import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { PROCESS } from "@/lib/content";

export function ProcessSection({ id = "process" }: { id?: string }) {
  return (
    <Section
      id={id}
      eyebrow="How we work"
      title="Six steps from first call to handover"
      description="A predictable process with a fixed scope and price agreed before any work starts."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROCESS.map((p, i) => (
          <Reveal key={p.step} delay={i * 50}>
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <span className="font-sans text-3xl font-bold text-accent">{p.step}</span>
              <h3 className="mt-3 font-sans text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
