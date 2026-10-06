/**
 * Single source of truth for package and add-on pricing.
 * Imported by the UI *and* by the server function that stores quote requests,
 * so totals are always recalculated on the server from this data.
 */

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


export type Currency = "KES" | "USD";

export type QuoteSelection = { id: string; qty: number };

export type QuoteBreakdown = {
  currency: Currency;
  packageName: string;
  packagePrice: number;
  lines: { id: string; label: string; qty: number; amount: number; recurring: boolean }[];
  oneOffTotal: number;
  monthlyTotal: number;
};

const price = (item: { kes: number; usd: number }, currency: Currency) =>
  currency === "KES" ? item.kes : item.usd;

/** Recompute a quote from trusted pricing data. Unknown ids are ignored. */
export function computeQuote(
  currency: Currency,
  packageName: string,
  selections: QuoteSelection[],
): QuoteBreakdown {
  const tier = TIERS.find((t) => t.name === packageName) ?? TIERS[0]!;
  const packagePrice = price(tier, currency);

  let oneOffTotal = packagePrice;
  let monthlyTotal = 0;
  const lines: QuoteBreakdown["lines"] = [];

  for (const selection of selections) {
    const addon = ADDONS.find((a) => a.id === selection.id);
    if (!addon) continue;
    const max = addon.perUnit ? (addon.max ?? 20) : 1;
    const qty = Math.min(Math.max(Math.floor(selection.qty), 1), max);
    const amount = price(addon, currency) * qty;
    const recurring = addon.recurring === "monthly";
    if (recurring) monthlyTotal += amount;
    else oneOffTotal += amount;
    lines.push({ id: addon.id, label: addon.label, qty, amount, recurring });
  }

  return { currency, packageName: tier.name, packagePrice, lines, oneOffTotal, monthlyTotal };
}

/**
 * Monthly subscription website packages shown in the public Packages section.
 * Display-only: the quote builder, server quote calculation and AI advisor
 * continue to use TIERS / ADDONS above.
 */
export type PackagePlan = {
  name: string;
  /** Monthly price in KES. Omit for quotation-only plans. */
  kes?: number;
  /** Shown instead of a price for quotation-only plans. */
  quoteLabel?: string;
  /** Highlighted benefit pill shown under the price. */
  highlight?: string;
  features: string[];
  cta: string;
};

export type PackageCategory = {
  id: string;
  title: string;
  plans: PackagePlan[];
};

const WA_CTA = "Get Started on WhatsApp";

const COMMON_TAIL = [
  "Social media integration",
  "SSL security",
  "Basic SEO",
  "Website maintenance",
  "Technical support",
];

export const PACKAGE_CATEGORIES: PackageCategory[] = [
  {
    id: "small-business",
    title: "Small Business Websites",
    plans: [
      {
        name: "Starter",
        kes: 1100,
        cta: WA_CTA,
        features: [
          "1-page professional website",
          ".co.ke domain",
          "Website hosting",
          "Mobile & desktop responsive design",
          "WhatsApp integration",
          "Contact / lead section",
          ...COMMON_TAIL,
        ],
      },
      {
        name: "Business Services",
        kes: 1300,
        cta: WA_CTA,
        features: [
          "Professional services website",
          "Domain of choice",
          "Website hosting",
          "Mobile & desktop responsive design",
          "WhatsApp integration",
          "Contact / lead form",
          ...COMMON_TAIL,
        ],
      },
      {
        name: "Business + Selling",
        kes: 1500,
        cta: WA_CTA,
        features: [
          "3-page professional website",
          ".co.ke domain",
          "Website hosting",
          "Mobile & desktop responsive design",
          "WhatsApp integration",
          "Product / selling functionality",
          "Contact / lead form",
          ...COMMON_TAIL,
        ],
      },
      {
        name: "Business & Selling Pro",
        kes: 1800,
        cta: WA_CTA,
        features: [
          "Premium business + selling website",
          "Domain of choice",
          "Website hosting",
          "Mobile & desktop responsive design",
          "WhatsApp integration",
          "Expanded business presentation",
          "Selling / e-commerce functionality",
          "Contact / lead forms",
          "Product & service presentation",
          ...COMMON_TAIL,
        ],
      },
    ],
  },
  {
    id: "restaurant",
    title: "Restaurant Websites",
    plans: [
      {
        name: "Restaurant Starter",
        kes: 1700,
        cta: WA_CTA,
        features: [
          ".co.ke domain",
          "3 pages: Home, Menu & Contact",
          "Website hosting",
          "Mobile & desktop responsive design",
          "WhatsApp integration",
          "Digital menu",
          "Contact section",
          "Location / map integration",
          ...COMMON_TAIL,
        ],
      },
      {
        name: "Restaurant Business",
        kes: 2100,
        cta: WA_CTA,
        features: [
          "Domain of choice",
          "Expanded restaurant website",
          "Website hosting",
          "Mobile & desktop responsive design",
          "WhatsApp integration",
          "Digital menu",
          "Contact / lead functionality",
          "Location / map integration",
          ...COMMON_TAIL,
        ],
      },
      {
        name: "Restaurant Premium",
        quoteLabel: "Request a Quote",
        cta: "Request a Quote",
        features: [
          "Advanced restaurant website",
          "Custom requirements",
          "Online ordering options",
          "Reservation / booking options",
          "Delivery integrations where required",
          "Custom functionality",
          "Professional design",
          "Mobile & desktop responsive",
          "Technical support",
        ],
      },
    ],
  },
  {
    id: "corporate",
    title: "Corporate & SME Websites",
    plans: [
      {
        name: "Corporate Starter",
        kes: 3000,
        cta: WA_CTA,
        features: [
          ".co.ke domain",
          "4 pages: Home, Services, Products & Contact",
          "Website hosting",
          "Mobile & desktop responsive design",
          "WhatsApp integration",
          "Contact / lead forms",
          "Services presentation",
          "Products presentation",
          ...COMMON_TAIL,
        ],
      },
      {
        name: "Corporate Business",
        kes: 3700,
        cta: WA_CTA,
        features: [
          "Domain of choice",
          "Expanded professional business website",
          "Website hosting",
          "Mobile & desktop responsive design",
          "WhatsApp integration",
          "Services & products presentation",
          "Contact / lead forms",
          ...COMMON_TAIL,
        ],
      },
      {
        name: "Corporate Premium",
        kes: 4000,
        cta: WA_CTA,
        highlight: "Includes 1 Professional Email",
        features: [
          "Premium professional website",
          "Domain of choice",
          "Website hosting",
          "Mobile & desktop responsive design",
          "WhatsApp integration",
          "Advanced business presentation",
          "Services & products presentation",
          "Contact / lead forms",
          ...COMMON_TAIL,
          "Includes 1 professional email mailbox",
        ],
      },
    ],
  },
];

export const ADDITIONAL_PAGES = {
  label: "Additional Pages — KES 1,000 / month per page",
  description: "Add extra website pages to any subscription package.",
};

export const PROFESSIONAL_EMAIL = {
  name: "Professional Email",
  priceLabel: "KES 250 / month per mailbox",
  description: "Professional business email hosted on your business domain.",
  examples: ["info@yourbusiness.co.ke", "sales@yourbusiness.co.ke", "name@yourbusiness.co.ke"],
  additional: "Additional mailboxes: KES 250 / month each",
  included: "Corporate Premium includes 1 professional email mailbox.",
};

export const CUSTOM_SOLUTIONS = {
  name: "Custom Business Solutions",
  quoteLabel: "Request a Quote",
  items: [
    "Large corporate websites",
    "One-off website projects",
    "Advanced e-commerce",
    "Custom web applications",
    "Booking / reservation systems",
    "POS / inventory systems",
    "Business dashboards",
    "Custom integrations",
    "Advanced automation",
    "Website redesigns",
    "Advanced SEO",
    "Digital marketing campaigns",
    "LinkedIn setup & optimization",
    "Corporate branding",
    "Custom business technology solutions",
  ],
};
