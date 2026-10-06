/**
 * Single source of truth for the public website packages (monthly subscriptions),
 * the Professional Email add-on and the quotation-based custom services.
 */

/** Monthly subscription website packages shown in the public Packages section. */
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

/** Every package plan with its category, used by the AI project advisor. */
export const ALL_PLANS = PACKAGE_CATEGORIES.flatMap((category) =>
  category.plans.map((plan) => ({ ...plan, category: category.title })),
);
