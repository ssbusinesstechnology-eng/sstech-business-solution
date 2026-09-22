import { createFileRoute, Link } from "@tanstack/react-router";

import { Reveal } from "@/components/Reveal";
import { PageHeader, Section } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { Button } from "@/components/ui/button";
import { FOUNDERS } from "@/lib/content";
import { breadcrumbJsonLd, seo } from "@/lib/site";

const PATH = "/about";
const TITLE = "About S&S Business Solutions — Technology & Business Solutions in Kenya";
const DESCRIPTION =
  "S&S Business Solutions is a Kenyan technology and business solutions company combining digital presence, branding and practical business systems for entrepreneurs, professionals and organisations.";

export const Route = createFileRoute("/about")({
  head: () => {
    const base = seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      keywords: "about S&S Business Solutions, technology company Nairobi, business solutions Kenya",
    });
    return {
      ...base,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd("About", PATH)) },
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About us"
        title="Technology, branding and business solutions in one place"
        description="S&S Business Solutions helps businesses and professionals establish a strong digital presence, digitise how they operate and keep growing — with solutions built around real business needs rather than templates."
      >
        <div className="mt-8">
          <Button asChild className="rounded-full">
            <Link to="/contact">Work with us</Link>
          </Button>
        </div>
      </PageHeader>

      <Section
        eyebrow="How we work"
        title="Built around the business, not the deliverable"
        description="We start with what the business needs to achieve, then choose the website, brand, system or campaign that gets it there — and we stay available afterwards."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Digital presence",
              body: "Websites, domains, hosting and professional email set up so clients can find, trust and contact you.",
            },
            {
              title: "Practical technology",
              body: "S&S POS, business systems and custom tools that fit how a business already operates.",
            },
            {
              title: "Consistent branding",
              body: "One identity applied across website, social platforms, documents and marketing material.",
            },
            {
              title: "Room to grow",
              body: "Solutions that can be extended as the business, team or client base expands.",
            },
          ].map((card) => (
            <Reveal key={card.title}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <h3 className="font-sans text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Leadership"
        title="The people behind S&S"
        description="A partnership combining engineering with design, marketing and client relations."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {FOUNDERS.map((founder, i) => (
            <Reveal key={founder.name} delay={i * 80}>
              <article className="h-full rounded-2xl surface-card p-8">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-primary font-sans text-xl font-bold text-primary-foreground">
                  {founder.name[0]}
                </span>
                <h3 className="mt-5 font-sans text-xl font-semibold">{founder.name}</h3>
                <p className="text-sm font-medium text-primary">{founder.role}</p>
                <p className="mt-3 text-sm text-muted-foreground">{founder.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <WhyUsSection />
      <ProcessSection />
    </SiteLayout>
  );
}
