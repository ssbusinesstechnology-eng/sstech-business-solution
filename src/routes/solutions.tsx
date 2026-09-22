import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { AudiencesSection } from "@/components/sections/AudiencesSection";
import { PosSection } from "@/components/sections/PosSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd, seo } from "@/lib/site";

const PATH = "/solutions";
const TITLE = "Solutions for Businesses & Professionals | S&S Business Solutions";
const DESCRIPTION =
  "Digital, branding and technology solution pathways for entrepreneurs, SMEs, financial advisors, insurance professionals, corporates, cooperatives and professional service providers in Kenya.";

export const Route = createFileRoute("/solutions")({
  head: () => {
    const base = seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      keywords:
        "business solutions Kenya, SME digital solutions Kenya, corporate technology solutions Kenya, solutions for financial advisors, cooperative digital solutions Kenya",
    });
    return {
      ...base,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd("Solutions", PATH)) },
      ],
    };
  },
  component: SolutionsPage,
});

function SolutionsPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Solutions"
        title="Where would you like to start?"
        description="We work with different kinds of clients in different ways. Pick the pathway closest to your situation and we'll shape the scope around it."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/contact">Talk to us</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/services">See the full service list</Link>
          </Button>
        </div>
      </PageHeader>

      <AudiencesSection />
      <PosSection />
      <WhyUsSection />
    </SiteLayout>
  );
}
