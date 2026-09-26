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
            <article className={`glass-panel flex h-full flex-col p-7 transition-all duration-500 hover:-translate-y-2 hover:border-accent/60 ${i % 3 === 0 ? "md:translate-y-8 md:hover:translate-y-6" : ""}`}>
              <span className="grid h-12 w-12 place-items-center bg-ink text-accent [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]">
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
                <Button asChild size="sm" className="rounded-none">
                  <a href={waLink(serviceMessage(service))} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> Get started
                  </a>
                </Button>
                {!detailed && (
                  <Button asChild size="sm" variant="outline" className="rounded-none">
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
