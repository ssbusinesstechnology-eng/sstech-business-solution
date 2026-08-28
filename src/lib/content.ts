import {
  Brush,
  Cake,
  Code2,
  Megaphone,
  PartyPopper,
  Vote,
  type LucideIcon,
} from "lucide-react";

export const NAV = [
  { label: "Services", hash: "#services", to: "/services" },
  { label: "Pricing", hash: "#pricing", to: "/pricing" },
  { label: "Portfolio", hash: "#portfolio", to: "/portfolio" },
  { label: "Process", hash: "#process", to: "/process" },
  { label: "About", hash: "#about", to: "/about" },
  { label: "Contact", hash: "#contact", to: "/contact" },
];

export type Service = { icon: LucideIcon; title: string; body: string };

export const SERVICES: Service[] = [
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

export type Tier = {
  name: string;
  kes: number;
  usd: number;
  tagline: string;
  delivery: string;
  features: string[];
  popular?: boolean;
};

export const TIERS: Tier[] = [
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

export type Addon = {
  id: string;
  label: string;
  note: string;
  kes: number;
  usd: number;
  /** Quantity-based add-ons (e.g. extra pages) get a counter instead of a toggle. */
  perUnit?: boolean;
  unitLabel?: string;
  max?: number;
  /** Recurring add-ons are shown separately from the one-off build total. */
  recurring?: "monthly";
};

export const ADDONS: Addon[] = [
  {
    id: "extra-pages",
    label: "Extra pages",
    note: "Designed and built beyond your package allowance",
    kes: 3500,
    usd: 27,
    perUnit: true,
    unitLabel: "page",
    max: 20,
  },
  {
    id: "ecommerce",
    label: "E-commerce setup",
    note: "Cart, checkout, M-Pesa & card payments, up to 50 products",
    kes: 35000,
    usd: 265,
  },
  {
    id: "booking",
    label: "Booking / appointment system",
    note: "Calendar, reminders and admin view",
    kes: 18000,
    usd: 135,
  },
  {
    id: "brand-kit",
    label: "Logo & brand kit",
    note: "Logo suite, colour system, typography and usage guide",
    kes: 12000,
    usd: 90,
  },
  {
    id: "copywriting",
    label: "Copywriting & content",
    note: "Written page copy plus sourced imagery",
    kes: 9000,
    usd: 68,
  },
  {
    id: "seo-boost",
    label: "Advanced SEO boost",
    note: "Keyword research, schema, Search Console setup",
    kes: 8000,
    usd: 60,
  },
  {
    id: "maintenance",
    label: "Maintenance & hosting plan",
    note: "Updates, backups, security and small edits",
    kes: 4000,
    usd: 30,
    recurring: "monthly",
  },
];

export const DESIGN_PRICING = [
  { item: "Church Poster", price: "KES 800 – 2,000" },
  { item: "Event Poster", price: "KES 1,000 – 2,500" },
  { item: "Club Poster", price: "KES 1,500 – 3,000" },
  { item: "Business Promotion Poster", price: "KES 2,000 – 4,000" },
  { item: "Product Advertisement Poster", price: "KES 2,500 – 5,000" },
  { item: "Logo Design", price: "from KES 1,500" },
];

export const PORTFOLIO_CATEGORIES = [
  "Event & Occasion Posters",
  "Political & Campaign Branding",
  "Festive & Personal Greetings",
  "Business & Organisational Ads",
];

export const PROCESS = [
  { step: "01", title: "Discovery Call", body: "Free 20-minute call to understand your goals, audience and budget." },
  { step: "02", title: "Proposal & Agreement", body: "A clear scope, timeline and fixed price — no surprises." },
  { step: "03", title: "Deposit", body: "A deposit locks your slot in our production calendar." },
  { step: "04", title: "Design & Build", body: "We design, develop and share progress as it happens." },
  { step: "05", title: "Review & Revisions", body: "You review, we refine until it's right for your brand." },
  { step: "06", title: "Launch & Handover", body: "We go live, train your team and hand over every file." },
];

export const FOUNDERS = [
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
];

export const SERVICE_OPTIONS = SERVICES.map((s) => s.title);
