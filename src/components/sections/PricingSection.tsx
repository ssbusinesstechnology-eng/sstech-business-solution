import { Check, MessageCircle } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import {
  ADDITIONAL_PAGES,
  CUSTOM_SOLUTIONS,
  PACKAGE_CATEGORIES,
  PROFESSIONAL_EMAIL,
  type PackagePlan,
} from "@/lib/pricing";
import { SITE_NAME } from "@/lib/site";
import { BOOKING_URL, waLink } from "@/lib/whatsapp";

function planMessage(categoryTitle: string, plan: PackagePlan) {
  const lines = [
    `Hi ${SITE_NAME}!`,
    "",
    plan.kes
      ? `I'd like the *${plan.name}* package (${categoryTitle}).`
      : `I'd like a quote for *${plan.name}* (${categoryTitle}).`,
    plan.kes ? `Price: KES ${plan.kes.toLocaleString()} / month` : "",
    "",
    `Booking link: ${BOOKING_URL}`,
  ];
  return lines.join("\n");
}

function customMessage() {
  return [
    `Hi ${SITE_NAME}!`,
    "",
    `I'd like a quote for *${CUSTOM_SOLUTIONS.name}*.`,
    "Here's what I need:",
    "•",
    "",
    `Booking link: ${BOOKING_URL}`,
  ].join("\n");
}

export function PricingSection({ id = "pricing" }: { id?: string }) {
  return (
    <Section
      id={id}
      eyebrow="Website packages"
      title="Simple monthly website packages"
      description="Everything included in one monthly subscription — domain, hosting, maintenance and support. Pick a package and message us on WhatsApp to get started."
    >
      <div className="space-y-16">
        {PACKAGE_CATEGORIES.map((category) => (
          <div key={category.id}>
            <Reveal>
              <h3 className="mb-6 text-xl font-semibold md:text-2xl">{category.title}</h3>
            </Reveal>
            <div
              className={`grid gap-5 md:grid-cols-2 ${
                category.plans.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"
              }`}
            >
              {category.plans.map((plan, i) => (
                <Reveal key={plan.name} delay={i * 70} className="h-full">
                  <article className="surface-card relative flex h-full flex-col rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-primary">
                      {plan.name}
                    </h4>
                    {plan.kes ? (
                      <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5 text-3xl font-bold">
                        KES {plan.kes.toLocaleString()}
                        <span className="text-base font-medium text-muted-foreground">/ month</span>
                      </p>
                    ) : (
                      <p className="mt-3 text-3xl font-bold">{plan.quoteLabel}</p>
                    )}
                    {plan.highlight && (
                      <p className="mt-3 inline-flex w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                        {plan.highlight}
                      </p>
                    )}
                    <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                      {plan.features.map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="mt-6 w-full rounded-full">
                      <a
                        href={waLink(planMessage(category.title, plan))}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" /> {plan.cta}
                      </a>
                    </Button>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="mt-5 text-center text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{ADDITIONAL_PAGES.label}.</span>{" "}
                {category.id === "small-business" && ADDITIONAL_PAGES.description}
              </p>
            </Reveal>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-5 lg:grid-cols-2">
        <Reveal className="h-full">
          <article className="surface-card flex h-full flex-col rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">
              {PROFESSIONAL_EMAIL.name}
            </h3>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5 text-3xl font-bold">
              KES 250
              <span className="text-base font-medium text-muted-foreground">
                / month per mailbox
              </span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{PROFESSIONAL_EMAIL.description}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {PROFESSIONAL_EMAIL.examples.map((e) => (
                <li key={e} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="break-all text-muted-foreground">{e}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">{PROFESSIONAL_EMAIL.additional}</p>
            <p className="mt-3 inline-flex w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              {PROFESSIONAL_EMAIL.included}
            </p>
          </article>
        </Reveal>

        <Reveal className="h-full">
          <article className="surface-card flex h-full flex-col rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">
              {CUSTOM_SOLUTIONS.name}
            </h3>
            <p className="mt-3 text-3xl font-bold">{CUSTOM_SOLUTIONS.quoteLabel}</p>
            <p className="mt-3 text-sm text-muted-foreground">Quotation-based services include:</p>
            <ul className="mt-4 grid flex-1 gap-2.5 text-sm sm:grid-cols-2">
              {CUSTOM_SOLUTIONS.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full rounded-full">
              <a href={waLink(customMessage())} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> {CUSTOM_SOLUTIONS.quoteLabel}
              </a>
            </Button>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
