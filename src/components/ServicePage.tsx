import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { PageHeader, Section } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL, breadcrumbJsonLd, seo } from "@/lib/site";
import { SERVICE_PAGES, getServicePage, type ServicePageSlug } from "@/lib/service-pages";
import { waLink } from "@/lib/whatsapp";

export function servicePageHead(slug: ServicePageSlug) {
  const p = getServicePage(slug);
  const base = seo({ title: p.title, description: p.description, path: p.path });
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.label,
    description: p.description,
    areaServed: "Kenya",
    url: `${SITE_URL}${p.path}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return {
    ...base,
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(service) },
      { type: "application/ld+json", children: JSON.stringify(faq) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd(p.label, p.path)) },
    ],
  };
}

export function ServicePage({ slug }: { slug: ServicePageSlug }) {
  const p = getServicePage(slug);
  const related = p.related.map(getServicePage);
  const wa = waLink(`Hello S&S, I'm interested in ${p.label}. Could you share more details?`);

  return (
    <SiteLayout>
      <PageHeader eyebrow={p.label} title={p.h1} description={p.intro}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-none">
            <Link to="/contact">Request a Quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none">
            <a href={wa} target="_blank" rel="noreferrer">Talk to S&S on WhatsApp</a>
          </Button>
        </div>
      </PageHeader>

      <Section eyebrow="What we offer" title={`${p.label} services`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {p.offers.map((o) => (
            <Reveal key={o.title}>
              <div className="glass-panel h-full p-6">
                <h3 className="font-sans text-lg font-semibold">{o.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{o.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Who it's for" title="Built for businesses like yours">
        <ul className="grid gap-3 sm:grid-cols-2">
          {p.audience.map((a) => (
            <li key={a} className="flex gap-3 border border-border p-4 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {a}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Why S&S" title="Why businesses choose S&S">
        <ul className="space-y-3">
          {p.why.map((w) => (
            <li key={w} className="flex gap-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {w}
            </li>
          ))}
        </ul>
        {p.why.some((w) => w.includes("Solutions")) && (
          <Link to="/solutions" className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline">
            View current packages <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </Section>

      <Section eyebrow="Related services" title="Services that work well together">
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} to={r.path} className="glass-panel block p-5 transition-colors hover:border-primary">
              <h3 className="font-sans font-semibold">{r.label}</h3>
              <span className="mt-2 inline-flex items-center text-sm text-primary">Learn more <ArrowRight className="ml-1 h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="FAQ" title="Frequently asked questions">
        <div className="space-y-3">
          {p.faqs.map((f) => (
            <details key={f.q} className="group border border-border p-5">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section eyebrow="Get started" title="Tell Us What Your Business Needs" description="Share your requirements and S&S will get back to you with the right solution.">
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-none">
            <Link to="/contact">Open the request form <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none">
            <a href={wa} target="_blank" rel="noreferrer">WhatsApp us</a>
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}

export { SERVICE_PAGES };
