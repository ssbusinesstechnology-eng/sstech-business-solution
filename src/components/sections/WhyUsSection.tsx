import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { WHY_US } from "@/lib/content";

export function WhyUsSection({ id = "why-us" }: { id?: string }) {
  return (
    <Section
      id={id}
      eyebrow="Why S&S"
      title="What working with us looks like"
      description="We keep the scope clear, the build practical and the support going after launch."
    >
      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {WHY_US.map((item, i) => (
          <Reveal key={item.title} delay={i * 40} className="h-full">
            <div className="h-full bg-card p-7">
              <item.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-4 font-sans text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
