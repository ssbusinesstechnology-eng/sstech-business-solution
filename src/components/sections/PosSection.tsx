import { MessageCircle } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { POS } from "@/lib/content";
import { posMessage, waLink } from "@/lib/whatsapp";

export function PosSection({ id = "pos" }: { id?: string }) {
  return (
    <section id={id} className="border-t border-border bg-ink py-20 text-background">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Business technology
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="font-sans text-3xl font-bold sm:text-4xl">{POS.name}</h2>
            <span className="border border-accent bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
              Coming Soon
            </span>
          </div>
          <p className="mt-4 text-background/75">{POS.intro}</p>
          <Button asChild className="mt-7 rounded-none">
            <a href={waLink(posMessage())} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> Get notified when S&amp;S POS launches
            </a>
          </Button>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POS.features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 50}>
              <article className="h-full border border-background/15 bg-background/5 p-6 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
                <feature.icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-sans text-base font-semibold text-background">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-background/70">{feature.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
