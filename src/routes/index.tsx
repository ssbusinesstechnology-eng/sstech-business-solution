import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Mail, MessageCircle, Server, ShieldCheck } from "lucide-react";

import heroImage from "@/assets/hero-brand.jpg";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { AudiencesSection } from "@/components/sections/AudiencesSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { PosSection } from "@/components/sections/PosSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { Button } from "@/components/ui/button";
import { localBusinessJsonLd, seo } from "@/lib/site";
import { bookingMessage, generalMessage, waLink } from "@/lib/whatsapp";

const TITLE = "S&S Business Solutions — Technology, Digital & Business Solutions in Kenya";
const DESCRIPTION =
  "S&S Business Solutions provides business websites, branding, professional email, POS and business software, and digital marketing for entrepreneurs, professionals and organisations in Kenya.";

export const Route = createFileRoute("/")({
  head: () => {
    const base = seo({
      title: TITLE,
      description: DESCRIPTION,
      path: "/",
      keywords:
        "business solutions Kenya, business websites Kenya, web design Kenya, branding Kenya, business software Kenya, POS systems Kenya, digital solutions Kenya, business technology solutions Kenya",
    });
    return {
      ...base,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(localBusinessJsonLd) },
      ],
    };
  },
  component: Index,
});

const WEB_AND_EMAIL = [
  "Business, corporate and portfolio websites",
  "Domain registration and management",
  "Web hosting and website security",
  "Professional business email on your own domain",
  "Website maintenance, updates and technical support",
];

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-ink">
        <img
          src={heroImage}
          alt="Warm brown and gold modern business workspace"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <Reveal className="max-w-3xl text-background">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-3 py-1 text-xs font-medium text-accent">
              S&amp;S Business Solutions · Nairobi, Kenya
            </span>
            <h1 className="mt-6 font-sans text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl">
              Build. Brand. Digitize. <span className="text-accent">Grow.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-background/80">
              We provide modern technology, digital, branding and business solutions that help
              entrepreneurs, professionals and organisations establish, manage, market and grow
              stronger businesses.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/contact">
                  Start a project <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-background/40 bg-transparent text-background hover:bg-background hover:text-foreground"
              >
                <a href={waLink(generalMessage())} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Introduction */}
      <Section
        eyebrow="Who we are"
        title="A technology and business solutions partner"
        description="S&S Business Solutions combines technology, branding and practical business thinking. We work with entrepreneurs, professionals, SMEs, cooperatives, organisations and corporates to build digital presence, digitise operations and support growth — with solutions scoped around real business needs."
      >
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Establish", body: "Websites, branding and professional email that put your business online properly." },
              { title: "Manage", body: "Business systems, S&S POS and custom tools that digitise daily operations." },
              { title: "Grow", body: "SEO, digital marketing and ongoing support that keep the business moving." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-sans text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <ServicesSection />

      <AudiencesSection />

      <PosSection />

      {/* Websites & professional email */}
      <Section
        id="web-email"
        eyebrow="Digital presence"
        title="Websites, hosting and professional business email"
        description="Everything that makes your business reachable online, set up and maintained by one team."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl surface-card p-7">
              <ul className="space-y-3 text-sm">
                {WEB_AND_EMAIL.map((line) => (
                  <li key={line} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-7 rounded-full">
                <Link to="/services">
                  See packages and pricing <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="grid h-full gap-4 sm:grid-cols-2">
              {[
                { icon: Mail, title: "Business email", body: "Branded mailboxes on your own domain, configured for your team." },
                { icon: Server, title: "Hosting & domains", body: "Registration, renewals and hosting managed for you." },
                { icon: ShieldCheck, title: "Security & support", body: "SSL, backups, updates and technical help when something breaks." },
                { icon: Check, title: "Redesigns", body: "Modernising an existing website without losing what already works." },
              ].map((card) => (
                <div key={card.title} className="rounded-2xl border border-border bg-card p-6">
                  <card.icon className="h-5 w-5 text-accent" />
                  <h3 className="mt-4 font-sans text-base font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <WhyUsSection />

      <PortfolioSection limit={6} />

      <ProcessSection />

      {/* CTA */}
      <section className="border-t border-border bg-secondary py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Reveal>
            <h2 className="font-sans text-3xl font-bold sm:text-4xl">
              Let's scope your next step
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Book a free 20-minute discovery call, or send us the details on WhatsApp and we'll come
              back with a clear scope and price.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/contact">Book a discovery call</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href={waLink(bookingMessage())} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp us
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
