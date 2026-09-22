import {
  Boxes,
  Briefcase,
  Building2,
  Globe2,
  Handshake,
  LineChart,
  Mail,
  Megaphone,
  Palette,
  Rocket,
  Server,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const NAV = [
  { label: "Solutions", to: "/solutions" as const },
  { label: "Services", to: "/services" as const },
  { label: "Portfolio", to: "/portfolio" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

export type Service = {
  icon: LucideIcon;
  title: string;
  body: string;
  items: string[];
  benefits: string[];
};

/** Six major solution categories — the backbone of the services page and homepage. */
export const SERVICES: Service[] = [
  {
    icon: Globe2,
    title: "Digital Presence & Web Solutions",
    body: "Complete digital presence — from the website itself to the domain, hosting, business email and ongoing technical support behind it.",
    items: [
      "Business website design & development",
      "Corporate website development",
      "Professional portfolio websites",
      "Landing pages",
      "E-commerce / online store solutions",
      "Website redesign & modernisation",
      "Website maintenance & support",
      "Domain registration & management",
      "Web hosting",
      "Professional business email",
      "Website security & technical support",
    ],
    benefits: [
      "One partner for the site, domain, email and hosting",
      "Built responsive and handed over complete",
      "Support after launch, not just at delivery",
    ],
  },
  {
    icon: Palette,
    title: "Branding & Online Brand Presence",
    body: "A consistent, professional identity across every platform your clients meet you on — online and in print.",
    items: [
      "Business branding",
      "Logo design",
      "Brand identity development",
      "Corporate branding",
      "Social media branding",
      "Online brand setup",
      "Digital brand presence",
      "Marketing materials",
      "Business profiles & digital assets",
      "Professional business documentation",
    ],
    benefits: [
      "One identity applied consistently everywhere",
      "Print and digital assets delivered in editable formats",
      "Profiles and documents that look considered",
    ],
  },
  {
    icon: Boxes,
    title: "Business Technology Solutions",
    body: "Practical systems that digitise how a business runs — sales, stock, records and workflows — including our own S&S POS.",
    items: [
      "S&S POS — point of sale & business management",
      "Inventory management systems",
      "Business management systems",
      "Custom business software",
      "Digital record management",
      "Business workflow digitisation",
      "Custom web applications",
      "Business dashboards",
      "Technology consulting",
    ],
    benefits: [
      "Systems scoped around how you actually work",
      "Start with one module and grow into more",
      "Training and handover included",
    ],
  },
  {
    icon: Briefcase,
    title: "Professional & Financial Services Solutions",
    body: "Technology, branding and digital tools for financial advisors, insurance professionals, accountants and consultants. We provide the digital solutions — not financial, insurance, accounting or legal advice.",
    items: [
      "Professional websites",
      "Online branding & digital profiles",
      "Lead and contact systems",
      "Professional business email",
      "Client-facing digital platforms",
      "Custom business tools",
      "Digital marketing support",
    ],
    benefits: [
      "A credible online presence clients can verify",
      "Enquiries captured and routed to you",
      "Client-facing tools that fit regulated industries",
    ],
  },
  {
    icon: Building2,
    title: "Corporate & Organisational Solutions",
    body: "Digital transformation, systems and branding for corporates, SMEs, cooperatives, NGOs and community-based organisations.",
    items: [
      "Corporate websites",
      "Organisational branding",
      "Digital transformation",
      "Custom software & business systems",
      "Professional email infrastructure",
      "Online presence development",
      "Technology consulting",
      "Digital communication solutions",
    ],
    benefits: [
      "Solutions that suit committees and boards",
      "Documented handover for internal teams",
      "Room to phase work across budgets",
    ],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing & Online Growth",
    body: "Structured digital marketing built around visibility and enquiries — strategy first, posting second.",
    items: [
      "Digital marketing strategy",
      "Social media presence & branding",
      "Search engine optimisation (SEO)",
      "Online business visibility",
      "Content & digital campaign support",
      "Lead-generation focused digital solutions",
    ],
    benefits: [
      "Clear goals before any content goes out",
      "Search visibility built into the website",
      "Reporting you can act on",
    ],
  },
];

export const POS = {
  name: "S&S POS",
  intro:
    "A modern business management and point-of-sale solution that helps businesses manage sales, products, inventory, customers and day-to-day operations more efficiently.",
  features: [
    { icon: ShoppingCart, title: "Sales & checkout", body: "Record sales quickly and keep an accurate daily picture of what moved." },
    { icon: Store, title: "Products & inventory", body: "Track stock levels, products and pricing in one place." },
    { icon: Users, title: "Customers", body: "Keep customer records and purchase history attached to each sale." },
    { icon: LineChart, title: "Business reporting", body: "See sales and stock activity summarised for decision-making." },
    { icon: Wrench, title: "Fits your operation", body: "Configured around how your business already runs." },
    { icon: Rocket, title: "Grows with you", body: "Start with point of sale and add modules as the business expands." },
  ],
};

export type Audience = { icon: LucideIcon; title: string; body: string };

export const AUDIENCES: Audience[] = [
  { icon: Rocket, title: "For entrepreneurs", body: "Build a professional brand and digital presence from the ground up." },
  { icon: Store, title: "For SMEs", body: "Digitise operations and manage customers, products and sales more efficiently." },
  { icon: LineChart, title: "For financial advisors", body: "Build a credible professional presence and a clear digital client experience." },
  { icon: ShieldCheck, title: "For insurance professionals", body: "Branding, websites and digital tools designed around client engagement." },
  { icon: Building2, title: "For corporates", body: "Scalable digital, branding and technology solutions." },
  { icon: Handshake, title: "For cooperatives & organisations", body: "Digital presence, business systems and technology that support growth." },
  { icon: Briefcase, title: "For professional service providers", body: "Build credibility online and make it easier for clients to find and contact you." },
];

export const WHY_US = [
  { icon: Briefcase, title: "Business-focused", body: "We scope around business outcomes — enquiries, efficiency, credibility — not just deliverables." },
  { icon: Boxes, title: "Multiple solutions, one partner", body: "Website, branding, email, systems and marketing handled by the same team." },
  { icon: Sparkles, title: "Modern technology", body: "Current tools and frameworks, chosen for maintainability rather than novelty." },
  { icon: Wrench, title: "Practical implementation", body: "We build what can be run day to day by your team, and we train them on it." },
  { icon: Server, title: "Scalable by design", body: "Start with what's needed now and extend as the business grows." },
  { icon: Mail, title: "Ongoing support", body: "Maintenance, updates and technical help after launch." },
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
    id: "business-email",
    label: "Professional business email",
    note: "Branded mailboxes set up on your domain",
    kes: 6000,
    usd: 45,
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
  "Websites",
  "Branding & Logos",
  "Business Systems & POS",
  "Corporate Projects",
  "Marketing & Design",
  "Event & Occasion Posters",
  "Political & Campaign Branding",
  "Festive & Personal Greetings",
];

export const PROCESS = [
  { step: "01", title: "Discovery Call", body: "Free 20-minute call to understand your goals, operations and budget." },
  { step: "02", title: "Proposal & Agreement", body: "A clear scope, timeline and fixed price — no surprises." },
  { step: "03", title: "Deposit", body: "A deposit locks your slot in our production calendar." },
  { step: "04", title: "Design & Build", body: "We design, develop and share progress as it happens." },
  { step: "05", title: "Review & Revisions", body: "You review, we refine until it's right for your business." },
  { step: "06", title: "Launch & Handover", body: "We go live, train your team and hand over every file." },
];

export const FOUNDERS = [
  {
    name: "Sheila",
    role: "Chief Technology & Innovation Officer",
    body: "Leads engineering, infrastructure and product — making sure every platform and system we ship is secure, maintainable and built to scale.",
  },
  {
    name: "Sam",
    role: "Chief Marketing & Frontend Officer",
    body: "Leads frontend craft, marketing and client relations — translating business goals into interfaces and campaigns that work.",
  },
];

/** Enquiry categories used by the contact form and its WhatsApp message. */
export const SERVICE_OPTIONS = [
  "Website",
  "Branding",
  "Online business presence",
  "POS / business software",
  "Professional email",
  "Digital marketing",
  "Corporate / organisational solutions",
  "Other",
];
