import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { PageHeader, Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { SiteLayout } from "@/components/SiteLayout";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { Button } from "@/components/ui/button";
import { DESIGN_PRICING } from "@/lib/content";
import { breadcrumbJsonLd, seo } from "@/lib/site";
import { designItemMessage, waLink } from "@/lib/whatsapp";

const PATH = "/services";
const TITLE = "Services — Websites, Branding, Business Software | S&S Business Solutions";
const DESCRIPTION =
  "Full service list from S&S Business Solutions: business websites, hosting and professional email, branding and logos, POS and business systems, corporate solutions and digital marketing in Kenya.";

export const Route = createFileRoute("/services")({
  head: () => {
    const base = seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      keywords:
        "business websites Kenya, branding Kenya, POS systems Kenya, business software Kenya, professional business email Kenya, digital marketing Kenya",
    });
    return {
      ...base,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd("Services", PATH)) },
      ],
    };
  },
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Services"
        title="Everything we deliver, in detail"
        description="Six solution areas covering digital presence, branding, business technology, professional services, organisations and digital growth."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/contact">Request a quote</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/solutions">See solutions by client type</Link>
          </Button>
        </div>
      </PageHeader>

      <ServicesSection
        detailed
        title="Our full service list"
        description="Each area can be delivered on its own or combined into one programme of work."
      />

      <PricingSection />

      <Section
        id="design-pricing"
        eyebrow="Design rates"
        title="Poster, marketing and logo design"
        description="Ranges depend on complexity, revisions and turnaround. Bulk and retainer rates available."
      >
        <Reveal>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card">
            {DESIGN_PRICING.map((row, i) => (
              <div
                key={row.item}
                className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 ${
                  i !== 0 ? "border-t border-border" : ""
                }`}
              >
                <span className="text-sm font-medium">{row.item}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-primary">{row.price}</span>
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <a href={waLink(designItemMessage(row))} target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 h-3.5 w-3.5" /> Enquire
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-muted-foreground">
            Designing for a church?{" "}
            <Link to="/church-poster-design" className="font-medium text-primary hover:underline">
              See our church poster design service in Nairobi
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      <ProcessSection />
    </SiteLayout>
  );
}
