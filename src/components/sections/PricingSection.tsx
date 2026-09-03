import { Check, MessageCircle } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { QuoteBuilder } from "@/components/sections/QuoteBuilder";
import { Button } from "@/components/ui/button";
import { TIERS } from "@/lib/content";
import { money, tierMessage, waLink, type Currency } from "@/lib/whatsapp";

export function PricingSection({ id = "pricing" }: { id?: string }) {
  const [currency, setCurrency] = useState<Currency>("KES");

  return (
    <Section
      id={id}
      eyebrow="Website packages"
      title="Transparent pricing, fixed scope"
      description="Pick a package, add extras in the quote builder below and send the whole estimate to us on WhatsApp."
    >
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full border border-border bg-surface p-1">
          {(["KES", "USD"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                currency === c
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 70} className="h-full">
            <article
              className={`relative flex h-full flex-col rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 ${
                tier.popular ? "border-2 border-primary bg-surface glow" : "surface-card"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">
                {tier.name}
              </h3>
              <p className="mt-3 text-3xl font-bold">{money(currency, tier.kes, tier.usd)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>
              <p className="mt-3 inline-flex w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                {tier.delivery}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={tier.popular ? "default" : "outline"}
                className="mt-6 w-full rounded-full"
              >
                <a href={waLink(tierMessage(tier, currency))} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Choose {tier.name}
                </a>
              </Button>
            </article>
          </Reveal>
        ))}
      </div>

      <QuoteBuilder currency={currency} />
    </Section>
  );
}
