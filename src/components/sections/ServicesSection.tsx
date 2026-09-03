import { MessageCircle } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/content";
import { serviceMessage, waLink } from "@/lib/whatsapp";

export function ServicesSection({ id = "services" }: { id?: string }) {
  return (
    <Section
      id={id}
      eyebrow="What we do"
      title="Design and technology, under one roof"
      description="Every service opens a pre-filled WhatsApp chat with the details already written for you."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, i) => (
          <Reveal key={service.title} delay={i * 60}>
            <article className="group flex h-full flex-col surface-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:glow">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <service.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{service.body}</p>
              <Button asChild variant="outline" size="sm" className="mt-6 w-full rounded-full">
                <a href={waLink(serviceMessage(service))} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Enquire on WhatsApp
                </a>
              </Button>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
