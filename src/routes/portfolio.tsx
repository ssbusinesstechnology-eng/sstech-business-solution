import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd, seo } from "@/lib/site";

const PATH = "/portfolio";
const TITLE = "Portfolio — Websites, Branding & Business Projects | S&S Business Solutions";
const DESCRIPTION =
  "Selected work from S&S Business Solutions: business websites, branding and logos, business systems and POS interfaces, corporate projects and marketing design in Kenya.";

export const Route = createFileRoute("/portfolio")({
  head: () => {
    const base = seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      keywords: "web design portfolio Kenya, branding portfolio Nairobi, business software projects Kenya",
    });
    return {
      ...base,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd("Portfolio", PATH)) },
      ],
    };
  },
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Portfolio"
        title="Work we've delivered"
        description="Browse by category — websites, branding, business systems, corporate projects and marketing design."
      >
        <div className="mt-8">
          <Button asChild className="rounded-full">
            <Link to="/contact">Start something similar</Link>
          </Button>
        </div>
      </PageHeader>

      <PortfolioSection />
    </SiteLayout>
  );
}
