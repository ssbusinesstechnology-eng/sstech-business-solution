import { Link } from "@tanstack/react-router";
import { Check, MessageCircle } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/content";
import { serviceMessage, waLink } from "@/lib/whatsapp";

export function ServicesSection({
  id = "services",
  detailed = false,
  title = "Solutions built around how your business works",
  description = "Six solution areas, delivered by one team — so your website, brand, systems and marketing stay consistent.",
}: {
  id?: string;
  detailed?: boolean;
  title?: string;
  description?: string;
}) {
  return (
    <Section id={id} eyebrow="What we do" title={title} description={description}>
      <div className="grid gap-6 md:grid-cols-2">
        {SERVICES.map((service, i) => (
          <Reveal key={service.title} delay={i * 60}>
            <article className="flex h-full flex-col rounded-2xl surface-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <service.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-sans text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{service.body}</p>

              <ul className="mt-5 space-y-2 text-sm">
                {(detailed ? service.items : service.benefits).map((line) => (
                  <li key={line} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                <Button asChild size="sm" className="rounded-full">
                  <a href={waLink(serviceMessage(service))} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> Get started
                  </a>
                </Button>
                {!detailed && (
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link to="/services">Learn more</Link>
                  </Button>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
