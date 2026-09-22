import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageCircle, ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Section, PageHeader } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL, EMAIL, seo, breadcrumbJsonLd } from "@/lib/site";
import { designItemMessage, generalMessage, waLink } from "@/lib/whatsapp";

const PATH = "/church-poster-design";
const TITLE = "Church Poster Design in Nairobi — from KES 800 | S&S Business Solutions";
const DESCRIPTION =
  "Church poster design in Nairobi from KES 800. Sunday service, crusade, revival, conference and harvest posters delivered same day on WhatsApp, print and social ready.";

const POSTER_TYPES = [
  { item: "Sunday Service Poster", price: "KES 800 – 1,200" },
  { item: "Crusade & Revival Poster", price: "KES 1,000 – 1,800" },
  { item: "Church Conference Poster", price: "KES 1,200 – 2,000" },
  { item: "Harvest & Fundraiser Poster", price: "KES 1,000 – 2,000" },
  { item: "Youth & Praise Night Poster", price: "KES 800 – 1,500" },
  { item: "Church Anniversary Poster", price: "KES 1,200 – 2,000" },
];

const INCLUDED = [
  "Print-ready A3/A4 file plus a WhatsApp and Instagram size",
  "Your church name, theme scripture, speakers, date, venue and contacts",
  "Two rounds of revisions included in the quoted price",
  "Same-day delivery on simple posters, 24–48 hours on detailed ones",
  "Consistent colours and fonts so your posters look like one family",
  "Editable source file on request for a small extra fee",
];

const STEPS = [
  { step: "01", title: "Send the details", body: "WhatsApp us the theme, scripture, date, venue, speakers and any photos or logo." },
  { step: "02", title: "Approve the quote", body: "We confirm the rate from the list below and the delivery time before we start." },
  { step: "03", title: "Review the draft", body: "You get the first design, then two rounds of changes to get the wording and look right." },
  { step: "04", title: "Get your files", body: "Final print file and social sizes sent straight back on WhatsApp." },
];

export const Route = createFileRoute("/church-poster-design")({
  head: () => {
    const base = seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      keywords:
        "church poster design Nairobi, crusade poster design Kenya, church flyer designer Nairobi, revival poster, church conference poster",
    });

    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Church Poster Design",
            serviceType: "Graphic design",
            description: DESCRIPTION,
            url: `${SITE_URL}${PATH}`,
            areaServed: [
              { "@type": "City", name: "Nairobi" },
              { "@type": "Country", name: "Kenya" },
            ],
            provider: {
              "@type": "ProfessionalService",
              name: SITE_NAME,
              url: SITE_URL,
              email: EMAIL,
              telephone: "+254713268806",
            },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "KES",
              lowPrice: 800,
              highPrice: 2000,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd("Church Poster Design", PATH)),
        },
      ],
    };
  },
  component: ChurchPosterPage,
});

function ChurchPosterPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Church poster design · Nairobi"
        title={
          <>
            Church Poster Design in Nairobi <span className="text-primary">from KES 800</span>
          </>
        }
        description="Sunday services, crusades, revivals, conferences and harvests — designed for print and for the church WhatsApp group, usually the same day."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <a
              href={waLink(designItemMessage({ item: "Church Poster", price: "KES 800 – 2,000" }))}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Request a church poster
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> All design services
            </Link>
          </Button>
        </div>
      </PageHeader>

      <Section
        eyebrow="Rates"
        title="Church poster prices"
        description="Ranges depend on how much detail, how many photos and how fast you need it. Bulk rates for churches ordering every week."
      >
        <Reveal>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl surface-card">
            {POSTER_TYPES.map((row, i) => (
              <div
                key={row.item}
                className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-primary/5 ${
                  i !== 0 ? "border-t border-border" : ""
                }`}
              >
                <span className="text-sm font-medium">{row.item}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-primary">{row.price}</span>
                  <a
                    href={waLink(designItemMessage(row))}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    Request
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="What you get" title="Every church poster includes">
        <div className="grid gap-4 sm:grid-cols-2">
          {INCLUDED.map((item, i) => (
            <Reveal key={item} delay={i * 60}>
              <div className="flex h-full gap-3 rounded-2xl surface-card p-5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How it works"
        title="From message to finished poster"
        description="Most churches send the details in the morning and share the poster with the congregation the same evening."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 70}>
              <div className="h-full rounded-2xl surface-card p-6">
                <span className="text-xs font-semibold tracking-widest text-accent">{s.step}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Ready when you are"
        title="Send us your service details"
        description="Share the theme, scripture, date, venue and speakers on WhatsApp and we'll come back with the design."
      >
        <Reveal>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <a
                href={waLink(designItemMessage({ item: "Church Poster", price: "KES 800 – 2,000" }))}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href={waLink(generalMessage())} target="_blank" rel="noreferrer">
                Ask about bulk church rates
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Prefer email? Write to{" "}
            <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">
              {EMAIL}
            </a>
            .
          </p>
        </Reveal>
      </Section>
    </SiteLayout>
  );
}
