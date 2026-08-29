import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Brush,
  Cake,
  Check,
  Code2,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  PartyPopper,
  Phone,
  Sparkles,
  Vote,
} from "lucide-react";
import { toast } from "sonner";

import heroImage from "@/assets/hero.jpg";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const TITLE = "S&S Tech Solutions Hub — Web Design & Branding in Nairobi";
const DESCRIPTION =
  "Nairobi-based web design, development and graphic design agency. Websites from KES 15,000, logos, posters and campaign branding that get you noticed.";

const SITE_URL = "https://brandscape-builder-66.lovable.app";

const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: "S&S Tech Solutions Hub",
  description: DESCRIPTION,
  url: SITE_URL,
  email: "sstechsolutionsa@gmail.com",
  telephone: "+254713268806",
  priceRange: "KES 800 - KES 140,000",
  areaServed: [
    { "@type": "City", name: "Nairobi" },
    { "@type": "Country", name: "Kenya" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Nairobi CBD & Westlands",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    addressCountry: "KE",
  },
  sameAs: [`https://wa.me/254713268806`],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Website packages",
    itemListElement: [
      { name: "Starter website", price: 15000, description: "Up to 3 pages, responsive, contact form" },
      { name: "Basic website", price: 25000, description: "Up to 5 pages, basic SEO, analytics" },
      { name: "Premium website", price: 65000, description: "Up to 10 semi-custom pages, CMS, advanced SEO" },
      { name: "Pro website", price: 140000, description: "Up to 20 custom pages, e-commerce, brand kit" },
    ].map((tier) => ({
      "@type": "Offer",
      priceCurrency: "KES",
      price: tier.price,
      availability: "https://schema.org/InStock",
      itemOffered: {
        "@type": "Service",
        name: tier.name,
        description: tier.description,
        serviceType: "Web design and development",
        areaServed: "Nairobi, Kenya",
        provider: { "@id": `${SITE_URL}/#business` },
      },
    })),
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "web design Nairobi, website development Kenya, graphic design Nairobi, logo design Kenya, poster design Nairobi, campaign branding" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:site_name", content: "S&S Tech Solutions Hub" },
      { property: "og:locale", content: "en_KE" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "geo.region", content: "KE-30" },
      { name: "geo.placename", content: "Nairobi" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(LOCAL_BUSINESS_JSONLD),
      },
    ],
  }),
  component: Index,
});


const WHATSAPP_PRIMARY = "254713268806";
const WHATSAPP_SECONDARY = "254115323604";
const EMAIL = "sstechsolutionsa@gmail.com";

const waLink = (number: string, text = "Hi S&S Tech Solutions Hub, I'd like a quote.") =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    icon: Brush,
    title: "Graphic Design & Branding",
    body: "Logos, full brand identity systems and marketing collateral that make you unmistakable.",
  },
  {
    icon: PartyPopper,
    title: "Event & Party Posters",
    body: "Invites, flyers and social graphics built to stop the scroll and fill the room.",
  },
  {
    icon: Vote,
    title: "Political & Campaign Materials",
    body: "Candidate branding, rally posters and civic awareness creatives with real presence.",
  },
  {
    icon: Cake,
    title: "Festive & Personal Greetings",
    body: "Christmas, Eid, birthdays and milestones — personal designs people actually share.",
  },
  {
    icon: Megaphone,
    title: "Business & Recruitment Ads",
    body: "Promotions, product ads and hiring posts formatted for every channel you use.",
  },
  {
    icon: Code2,
    title: "Web Design & Development",
    body: "Fast, responsive websites and digital platforms — from landing pages to e-commerce.",
  },
];

type Tier = {
  name: string;
  kes: number;
  usd: number;
  tagline: string;
  delivery: string;
  features: string[];
  popular?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Starter",
    kes: 15000,
    usd: 115,
    tagline: "A clean online presence, fast.",
    delivery: "5–7 day delivery",
    features: [
      "Up to 3 pages",
      "Single template design",
      "Fully responsive",
      "Contact form",
      "1 round of revisions",
      "2 weeks support",
    ],
  },
  {
    name: "Basic",
    kes: 25000,
    usd: 190,
    tagline: "For SMEs ready to be found.",
    delivery: "7–10 day delivery",
    features: [
      "Up to 5 pages",
      "Basic SEO setup",
      "Google Maps embed",
      "SSL support",
      "Google Analytics",
      "2 rounds of revisions",
      "1 month support",
    ],
  },
  {
    name: "Premium",
    kes: 65000,
    usd: 490,
    tagline: "Semi-custom, content you control.",
    delivery: "14–21 day delivery",
    popular: true,
    features: [
      "Up to 10 semi-custom pages",
      "CMS + team training",
      "Advanced SEO",
      "Blog setup",
      "Newsletter integration",
      "4 rounds of revisions",
      "3 months support",
    ],
  },
  {
    name: "Pro",
    kes: 140000,
    usd: 1050,
    tagline: "Full custom platform + brand kit.",
    delivery: "21–30 day delivery",
    features: [
      "Up to 20 fully custom pages",
      "Full brand kit",
      "E-commerce (50 products)",
      "Booking system",
      "CRM integration",
      "Unlimited revisions",
      "6 months priority support",
      "Dedicated account manager",
    ],
  },
];

const DESIGN_PRICING = [
  { item: "Church Poster", price: "KES 800 – 2,000" },
  { item: "Event Poster", price: "KES 1,000 – 2,500" },
  { item: "Club Poster", price: "KES 1,500 – 3,000" },
  { item: "Business Promotion Poster", price: "KES 2,000 – 4,000" },
  { item: "Product Advertisement Poster", price: "KES 2,500 – 5,000" },
  { item: "Logo Design", price: "from KES 1,500" },
];

const PORTFOLIO_CATEGORIES = [
  "All",
  "Event & Occasion Posters",
  "Political & Campaign Branding",
  "Festive & Personal Greetings",
  "Business & Organisational Ads",
] as const;

const PORTFOLIO = [
  { name: "Creative Vibes — Day Event Poster", category: "Event & Occasion Posters" },
  { name: "Nairobi Nights — Club Flyer", category: "Event & Occasion Posters" },
  { name: "Harvest Sunday — Church Poster", category: "Event & Occasion Posters" },
  { name: "Team Victor Campaign", category: "Political & Campaign Branding" },
  { name: "Ward Rally — Civic Awareness", category: "Political & Campaign Branding" },
  { name: "Merry & Bright — Festive Card", category: "Festive & Personal Greetings" },
  { name: "Eid Mubarak Greeting", category: "Festive & Personal Greetings" },
  { name: "Pizza Time Product Poster", category: "Business & Organisational Ads" },
  { name: "We Are Hiring — Recruitment Ad", category: "Business & Organisational Ads" },
];

const PROCESS = [
  { step: "01", title: "Discovery Call", body: "Free 20-minute call to understand your goals, audience and budget." },
  { step: "02", title: "Proposal & Agreement", body: "A clear scope, timeline and fixed price — no surprises." },
  { step: "03", title: "Deposit", body: "A deposit locks your slot in our production calendar." },
  { step: "04", title: "Design & Build", body: "We design, develop and share progress as it happens." },
  { step: "05", title: "Review & Revisions", body: "You review, we refine until it's right for your brand." },
  { step: "06", title: "Launch & Handover", body: "We go live, train your team and hand over every file." },
];

const SERVICE_OPTIONS = [
  "Web Design & Development",
  "Graphic Design & Branding",
  "Event & Party Posters",
  "Political & Campaign Materials",
  "Festive & Personal Greetings",
  "Business & Recruitment Ads",
];

function Index() {
  const [currency, setCurrency] = useState<"KES" | "USD">("KES");
  const [filter, setFilter] = useState<string>("All");

  const filteredWork = useMemo(
    () => (filter === "All" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === filter)),
    [filter],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const message = `Hi S&S Tech Solutions Hub!%0A%0AName: ${data.get("name")}%0AEmail: ${data.get(
      "email",
    )}%0AService: ${data.get("service")}%0A%0A${data.get("message")}`;
    window.open(`https://wa.me/${WHATSAPP_PRIMARY}?text=${message}`, "_blank");
    toast.success("Opening WhatsApp with your enquiry", {
      description: `You can also email us at ${EMAIL}`,
    });
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="#top" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              S&amp;S
            </span>
            <span className="hidden text-sm font-semibold sm:block">
              S&amp;S Tech Solutions Hub
              <span className="block text-[11px] font-normal text-muted-foreground">
                web · design · development
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Button asChild size="sm" className="rounded-full">
            <a href="#contact">
              Get a Quote <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Abstract Nairobi skyline with teal and amber light streaks"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <Reveal className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Nairobi · CBD &amp; Westlands
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
              Web Design &amp; Branding <span className="text-gradient">in Nairobi</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              We build two things exceptionally well: <strong className="text-foreground">web design
              &amp; development</strong> and <strong className="text-foreground">graphic design &amp;
              branding</strong> — for entrepreneurs, SMEs, campaigns and corporates across Kenya.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full glow">
                <a href="#contact">Get a Free Quote</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href={waLink(WHATSAPP_PRIMARY)} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
            <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6">
              {[
                ["4", "website packages"],
                ["6", "creative services"],
                ["KES 15k", "starting from"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-bold text-primary">{value}</dt>
                  <dd className="text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <Section id="services" eyebrow="What we do" title="Design and technology, under one roof">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={i * 60}>
              <article className="group h-full surface-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:glow">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Web pricing */}
      <Section
        id="pricing"
        eyebrow="Website packages"
        title="Transparent pricing, fixed scope"
        description="Every package is built responsive and handed over complete. Add-ons — extra pages, maintenance plans and e-commerce setup — are quoted separately."
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
                  tier.popular
                    ? "border-2 border-primary bg-surface glow"
                    : "surface-card"
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
                <p className="mt-3 text-3xl font-bold">
                  {currency === "KES"
                    ? `KES ${tier.kes.toLocaleString()}`
                    : `USD ${tier.usd.toLocaleString()}`}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>
                <p className="mt-3 inline-flex w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                  {tier.delivery}
                </p>
                <ul className="mt-6 space-y-2.5 text-sm">
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
                  <a
                    href={waLink(
                      WHATSAPP_PRIMARY,
                      `Hi S&S Tech Solutions Hub, I'm interested in the ${tier.name} website package.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Choose {tier.name}
                  </a>
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Graphic design pricing */}
      <Section
        id="design-pricing"
        eyebrow="Graphic design rates"
        title="Poster and logo pricing"
        description="Ranges depend on complexity, revisions and turnaround. Bulk and retainer rates available."
      >
        <Reveal>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl surface-card">
            {DESIGN_PRICING.map((row, i) => (
              <div
                key={row.item}
                className={`flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-primary/5 ${
                  i !== 0 ? "border-t border-border" : ""
                }`}
              >
                <span className="text-sm font-medium">{row.item}</span>
                <span className="text-sm font-semibold text-primary">{row.price}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Portfolio */}
      <Section id="portfolio" eyebrow="Selected work" title="Design that earns attention">
        <div className="mb-8 flex flex-wrap gap-2">
          {PORTFOLIO_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                filter === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {filteredWork.map((work, i) => (
            <Reveal key={work.name} delay={i * 50} className="break-inside-avoid">
              <div
                className="group relative flex items-end overflow-hidden rounded-2xl surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60"
                style={{ minHeight: `${200 + ((i * 47) % 130)}px` }}
              >
                <div className="absolute inset-0 bg-[var(--gradient-brand)] opacity-[0.07] transition-opacity duration-300 group-hover:opacity-20" />
                <div className="relative">
                  <p className="text-[11px] uppercase tracking-widest text-accent">
                    {work.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{work.name}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section id="process" eyebrow="How we work" title="Six steps from idea to launch">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={i * 60}>
              <div className="h-full rounded-2xl surface-card p-6">
                <span className="font-sans text-3xl font-bold text-primary/40">{p.step}</span>
                <h3 className="mt-3 text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section
        id="about"
        eyebrow="The founders"
        title="Two owners. Strategy, design and technology."
        description="S&S Tech Solutions Hub is a 50/50 partnership blending strategic thinking, clean design and solid engineering."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              name: "Sheila",
              role: "Chief Technology & Innovation Officer",
              body: "Leads backend engineering, infrastructure and innovation — making sure every platform we ship is secure, fast and built to scale.",
            },
            {
              name: "Sam",
              role: "Chief Marketing & Frontend Officer",
              body: "Leads frontend craft, marketing and client relations — translating brand goals into interfaces and campaigns that convert.",
            },
          ].map((founder, i) => (
            <Reveal key={founder.name} delay={i * 90}>
              <article className="h-full rounded-2xl surface-card p-8">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--gradient-brand)] font-sans text-xl font-bold text-primary-foreground">
                  {founder.name[0]}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{founder.name}</h3>
                <p className="text-sm font-medium text-primary">{founder.role}</p>
                <p className="mt-3 text-sm text-muted-foreground">{founder.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section
        id="contact"
        eyebrow="Let's talk"
        title="Book a free discovery call"
        description="Tell us what you need and we'll come back with a clear scope and price — usually the same day."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="h-full rounded-2xl surface-card p-8">
              <ul className="space-y-5 text-sm">
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Phone &amp; WhatsApp</p>
                    <a
                      href={waLink(WHATSAPP_PRIMARY)}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-muted-foreground hover:text-primary"
                    >
                      +254 713 268806
                    </a>
                    <a
                      href={waLink(WHATSAPP_SECONDARY)}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-muted-foreground hover:text-primary"
                    >
                      +254 115 323 604
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Offices</p>
                    <p className="text-muted-foreground">Nairobi CBD &amp; Westlands, Kenya</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Free discovery call</p>
                    <p className="text-muted-foreground">
                      20 minutes, no obligation — we'll scope your project live.
                    </p>
                  </div>
                </li>
              </ul>
              <Button asChild className="mt-8 w-full rounded-full">
                <a
                  href={waLink(WHATSAPP_PRIMARY, "Hi! I'd like to book a free discovery call.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Book a Free Discovery Call
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <form onSubmit={handleSubmit} className="rounded-2xl surface-card p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.co.ke"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="service">Service interested in</Label>
                <select
                  id="service"
                  name="service"
                  required
                  defaultValue=""
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your project, timeline and budget."
                />
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full rounded-full">
                Send Enquiry <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Sends via WhatsApp — or email us directly at {EMAIL}
              </p>
            </form>
          </Reveal>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border bg-ink">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                S&amp;S
              </span>
              <span className="font-sans font-semibold">S&amp;S Tech Solutions Hub</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              web · design · development · digital solutions
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Quick links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={waLink(WHATSAPP_PRIMARY)} target="_blank" rel="noreferrer" className="hover:text-primary">
                  +254 713 268806
                </a>
              </li>
              <li>
                <a href={waLink(WHATSAPP_SECONDARY)} target="_blank" rel="noreferrer" className="hover:text-primary">
                  +254 115 323 604
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="hover:text-primary">
                  {EMAIL}
                </a>
              </li>
              <li>Nairobi CBD &amp; Westlands</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Say hello</h3>
            <div className="mt-3 flex gap-3">
              <a
                href={waLink(WHATSAPP_PRIMARY)}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                aria-label="Email"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={`tel:+${WHATSAPP_PRIMARY}`}
                aria-label="Call us"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} S&amp;S Tech Solutions Hub. All rights reserved.</p>
            <p className="font-sans text-primary">Building Brands, One Design at a Time.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={waLink(WHATSAPP_PRIMARY)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground glow transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-border/60 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
          {description && <p className="mt-4 text-muted-foreground">{description}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
