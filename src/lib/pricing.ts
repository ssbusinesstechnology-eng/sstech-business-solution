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
