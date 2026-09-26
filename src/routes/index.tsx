import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Mail, MessageCircle, Server, ShieldCheck } from "lucide-react";

import { FacetedForm } from "@/components/FacetedForm";
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
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden border-b border-border bg-background">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_50%_38%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_32%),linear-gradient(to_right,color-mix(in_oklab,var(--border)_30%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_30%,transparent)_1px,transparent_1px)] [background-size:auto,72px_72px,72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
        <div className="facet-shard pointer-events-none absolute -left-10 top-24 h-36 w-28 bg-primary/10 md:left-[7%] md:h-52 md:w-40" />
        <div className="facet-shard pointer-events-none absolute -right-8 bottom-20 h-44 w-36 bg-accent/15 [animation-delay:-4s] md:right-[5%] md:h-64 md:w-52" />
        <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center px-5 py-14 md:px-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(24rem,0.45fr)] lg:gap-8">
          <Reveal className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 border-l-2 border-accent pl-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              S&amp;S Business Solutions · Nairobi, Kenya
            </span>
            <h1 className="mt-7 font-sans text-5xl font-extrabold leading-[0.98] sm:text-6xl md:text-7xl lg:text-[5.4rem]">
              Build. Brand.<br />Digitize. <span className="text-gradient">Grow.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              We provide modern technology, digital, branding and business solutions that help
              entrepreneurs, professionals and organisations establish, manage, market and grow
              stronger businesses.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-none px-7">
                <Link to="/contact">
                  Start a project <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-none border-primary/35 bg-background/55 px-7 text-foreground backdrop-blur-md hover:bg-secondary"
              >
                <a href={waLink(generalMessage())} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>
          <div className="relative mx-auto mt-14 grid w-full max-w-lg place-items-center lg:mt-0">
            <div className="absolute h-64 w-64 rounded-full border border-accent/20 md:h-96 md:w-96" />
            <div className="absolute h-80 w-80 rounded-full border border-primary/10 md:h-[30rem] md:w-[30rem]" />
            <FacetedForm className="relative z-10 w-[18rem] md:w-[28rem]" />
            <div className="glass-panel absolute bottom-0 right-0 z-20 w-48 p-4 md:bottom-6 md:w-56">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Integrated solutions</p>
              <p className="mt-2 text-sm font-semibold">Technology, identity and growth — one team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <Section
        eyebrow="Who we are"
        title="A technology and business solutions partner"
        description="S&S Business Solutions combines technology, branding and practical business thinking. We work with entrepreneurs, professionals, SMEs, cooperatives, organisations and corporates to build digital presence, digitise operations and support growth — with solutions scoped around real business needs."
      >
        <Reveal>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
            {[
              { title: "Establish", body: "Websites, branding and professional email that put your business online properly." },
              { title: "Manage", body: "Business systems, S&S POS and custom tools that digitise daily operations." },
              { title: "Grow", body: "SEO, digital marketing and ongoing support that keep the business moving." },
            ].map((item) => (
              <div key={item.title} className="bg-card p-7 backdrop-blur-md transition-colors hover:bg-surface">
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
            <div className="glass-panel h-full p-7">
              <ul className="space-y-3 text-sm">
                {WEB_AND_EMAIL.map((line) => (
                  <li key={line} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-7 rounded-none">
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
                <div key={card.title} className="glass-panel p-6 transition-transform duration-300 hover:-translate-y-1">
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
      <section className="relative overflow-hidden border-t border-border bg-ink py-24 text-background">
        <div className="facet-shard absolute -right-10 top-0 h-52 w-40 bg-accent/10" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <h2 className="font-sans text-3xl font-bold sm:text-4xl">
              Let's scope your next step
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-background/65">
              Book a free 20-minute discovery call, or send us the details on WhatsApp and we'll come
              back with a clear scope and price.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-none">
                <Link to="/contact">Book a discovery call</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-none border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground">
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
