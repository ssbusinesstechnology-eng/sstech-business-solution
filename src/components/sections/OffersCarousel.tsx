import { Globe, MessageCircle, Server } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { waLink } from "@/lib/whatsapp";

/** Edit `price` once offer prices are approved. */
const OFFERS = [
  {
    icon: Globe,
    title: ".co.ke Domain Offer",
    body: "Affordable .co.ke domain registration for your business, set up and managed by S&S.",
    price: "Price on request",
  },
  {
    icon: Server,
    title: "Web Hosting Offer",
    body: "Affordable, reliable web hosting for business websites, with setup and support from S&S.",
    price: "Price on request",
  },
];

export function OffersCarousel() {
  return (
    <section aria-label="Current offers" className="border-b border-border py-10">
      <div className="mx-auto max-w-5xl px-12 md:px-16">
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {OFFERS.map((o) => (
              <CarouselItem key={o.title}>
                <div className="glass-panel flex h-full flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
                  <div className="flex gap-4">
                    <o.icon className="mt-1 h-6 w-6 shrink-0 text-accent" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                        Offer · {o.price}
                      </p>
                      <h2 className="mt-1 font-sans text-xl font-bold md:text-2xl">{o.title}</h2>
                      <p className="mt-2 max-w-xl text-sm text-muted-foreground">{o.body}</p>
                    </div>
                  </div>
                  <Button asChild className="shrink-0 rounded-none">
                    <a
                      href={waLink(
                        `Hello S&S Business Solutions, I'm interested in the ${o.title}. Please share the details and pricing.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" /> Get This Offer
                    </a>
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious aria-label="Previous offer" className="-left-10 md:-left-12" />
          <CarouselNext aria-label="Next offer" className="-right-10 md:-right-12" />
        </Carousel>
      </div>
    </section>
  );
}
