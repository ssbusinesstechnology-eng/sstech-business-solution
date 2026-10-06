import { ADDITIONAL_PAGES, ALL_PLANS, PACKAGE_CATEGORIES, PROFESSIONAL_EMAIL } from "@/lib/pricing";
import type { ProjectRecommendation } from "@/lib/project-advisor";

export const BUSINESS_TYPES = [
  "Salon / Beauty",
  "Restaurant / Café",
  "Retail / Shop",
  "Professional Services",
  "Corporate / SME",
  "Consultancy",
  "Real Estate",
  "Insurance / Financial Services",
  "Hospitality",
  "Other",
] as const;

export const NEEDS = [
  "Website",
  "Website + Selling",
  "Restaurant Website",
  "Professional Email",
  "Domain",
  "Hosting",
  "POS",
  "Inventory Management",
  "Business Dashboard",
  "Custom Web Application",
  "Digital Marketing",
  "SEO",
  "Graphic Design",
  "Branding",
  "Logo Design",
  "IT Consulting",
  "Custom Business Technology",
  "Other",
] as const;

export const WEBSITE_NEEDS: readonly string[] = ["Website", "Website + Selling", "Restaurant Website"];

export const FEATURES = [
  "WhatsApp",
  "Contact / Lead Form",
  "Social Media Links",
  "Services Presentation",
  "Product Presentation",
  "Digital Menu",
  "Location / Map",
  "Selling / E-commerce",
  "Online Ordering",
  "Booking / Reservations",
  "Professional Email",
  "Blog / Articles",
  "Other",
] as const;

export const MAILBOX_OPTIONS = ["1", "2", "3", "4", "5+"] as const;

export const PACKAGE_UNSURE = "Not sure — let S&S recommend";
/** Must match the custom-quote value the advisor server may return. */
export const PACKAGE_CUSTOM = "Custom Solution — Request a Quote";

export type ClientRequest = {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  businessType: string;
  businessTypeOther: string;
  needs: string[];
  needsOther: string;
  packageChoice: string;
  mailboxes: string;
  mailboxesApprox: string;
  features: string[];
  featuresOther: string;
  extraPages: number;
  description: string;
  budget: string;
};

export const EMPTY_REQUEST: ClientRequest = {
  name: "",
  businessName: "",
  phone: "",
  email: "",
  businessType: "",
  businessTypeOther: "",
  needs: [],
  needsOther: "",
  packageChoice: PACKAGE_UNSURE,
  mailboxes: "1",
  mailboxesApprox: "",
  features: [],
  featuresOther: "",
  extraPages: 0,
  description: "",
  budget: "Not decided yet",
};

export const hasWebsite = (r: ClientRequest) => r.needs.some((n) => WEBSITE_NEEDS.includes(n));
export const hasEmail = (r: ClientRequest) => r.needs.includes("Professional Email");

/** Which package category is most relevant for this visitor. */
export function primaryCategoryId(r: ClientRequest) {
  if (r.needs.includes("Restaurant Website") || r.businessType === "Restaurant / Café") return "restaurant";
  if (r.businessType === "Corporate / SME") return "corporate";
  return "small-business";
}

export function mailboxCount(r: ClientRequest) {
  if (r.mailboxes === "5+") {
    const n = Number.parseInt(r.mailboxesApprox, 10);
    return Number.isFinite(n) ? Math.min(Math.max(n, 5), 100) : 5;
  }
  return Number.parseInt(r.mailboxes, 10) || 1;
}

export const planPriceLabel = (plan: { kes?: number; quoteLabel?: string }) =>
  plan.kes ? `KES ${plan.kes.toLocaleString()} / month` : (plan.quoteLabel ?? "Request a Quote");

export function findPlan(name: string) {
  return ALL_PLANS.find((plan) => plan.name === name);
}

export const allPackageCategories = PACKAGE_CATEGORIES;

/** Monthly cost lines derived from the catalogue for a given package name. */
export function costNotes(r: ClientRequest, packageName: string) {
  const plan = findPlan(packageName);
  const quoteOnly = !plan || !plan.kes;
  const notes: string[] = [];

  if (hasWebsite(r) && r.extraPages > 0) {
    notes.push(
      quoteOnly
        ? `${r.extraPages} additional page(s) will be included in your quotation.`
        : `${r.extraPages} additional page(s): KES ${(r.extraPages * ADDITIONAL_PAGES.kes).toLocaleString()} / month (KES ${ADDITIONAL_PAGES.kes.toLocaleString()} per page).`,
    );
  }

  if (hasEmail(r)) {
    const count = mailboxCount(r);
    const included = packageName === PROFESSIONAL_EMAIL.includedWithPlan ? PROFESSIONAL_EMAIL.includedMailboxes : 0;
    const billable = Math.max(count - included, 0);
    if (included > 0) {
      notes.push(
        billable === 0
          ? `Professional email: your ${count} mailbox is included in ${packageName}.`
          : `Professional email: 1 mailbox included; ${billable} additional at KES ${(billable * PROFESSIONAL_EMAIL.kes).toLocaleString()} / month (KES ${PROFESSIONAL_EMAIL.kes} each).`,
      );
    } else {
      notes.push(
        `Professional email: ${count} mailbox(es) at KES ${(count * PROFESSIONAL_EMAIL.kes).toLocaleString()} / month (KES ${PROFESSIONAL_EMAIL.kes} per mailbox).`,
      );
    }
  }
  return notes;
}

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

export const needsList = (r: ClientRequest) =>
  r.needs.map((n) => (n === "Other" && r.needsOther.trim() ? `Other: ${clip(r.needsOther.trim(), 150)}` : n));

export const featuresList = (r: ClientRequest) =>
  r.features.map((f) => (f === "Other" && r.featuresOther.trim() ? `Other: ${clip(r.featuresOther.trim(), 120)}` : f));

export const businessTypeLabel = (r: ClientRequest) =>
  r.businessType === "Other" && r.businessTypeOther.trim()
    ? `Other: ${clip(r.businessTypeOther.trim(), 100)}`
    : r.businessType;

export const mailboxLabel = (r: ClientRequest) =>
  r.mailboxes === "5+" && r.mailboxesApprox.trim() ? `${mailboxCount(r)} mailboxes (approx.)` : `${mailboxCount(r)} mailbox(es)`;

/** Compact brief sent to the existing advisor endpoint (max 1,200 characters). */
export function buildGoals(r: ClientRequest) {
  const parts = [
    `Client request. Business type: ${businessTypeLabel(r)}.`,
    `Needs: ${needsList(r).join(", ")}.`,
    hasWebsite(r) ? `Visitor's package preference: ${r.packageChoice}.` : "",
    hasEmail(r) ? `Professional email: ${mailboxLabel(r)}.` : "",
    hasWebsite(r) && r.features.length ? `Requested website features: ${featuresList(r).join(", ")}.` : "",
    hasWebsite(r) && r.extraPages > 0 ? `Additional pages needed: ${r.extraPages}.` : "",
    r.description.trim() ? `Project description: ${clip(r.description.trim(), 500)}` : "",
  ];
  return clip(parts.filter(Boolean).join(" "), 1200);
}

/** Message stored in the existing contact_leads table (max 2,000 characters). */
export function buildLeadMessage(r: ClientRequest, rec: ProjectRecommendation | null) {
  const lines = [
    "Client request form",
    `Name: ${r.name}`,
    `Business: ${r.businessName}`,
    `Phone / WhatsApp: ${r.phone}`,
    `Email: ${r.email}`,
    `Business type: ${businessTypeLabel(r)}`,
    `Services requested: ${needsList(r).join(", ")}`,
    hasWebsite(r) ? `Selected package: ${r.packageChoice}` : "",
    hasEmail(r) ? `Professional email: ${mailboxLabel(r)}` : "",
    hasWebsite(r) && r.features.length ? `Requested features: ${featuresList(r).join(", ")}` : "",
    hasWebsite(r) && r.extraPages > 0 ? `Additional pages: ${r.extraPages}` : "",
    `Budget: ${r.budget}`,
    r.description.trim() ? `Project description: ${clip(r.description.trim(), 600)}` : "",
    rec ? `AI recommendation: ${rec.packageName} — ${clip(rec.summary, 300)}` : "AI recommendation: not generated",
  ];
  return clip(lines.filter(Boolean).join("\n"), 2000);
}

export const leadServiceLabel = (r: ClientRequest, rec: ProjectRecommendation | null) =>
  clip(`Client request — ${rec?.packageName ?? (hasWebsite(r) ? r.packageChoice : needsList(r)[0] ?? "General")}`, 160);

/** Short summary used for the optional WhatsApp follow-up. */
export function buildWhatsAppSummary(r: ClientRequest, rec: ProjectRecommendation | null) {
  return [
    `I just submitted a client request for ${r.businessName}.`,
    `Business type: ${businessTypeLabel(r)}`,
    `Services: ${clip(needsList(r).join(", "), 200)}`,
    rec ? `Recommended: ${rec.packageName}` : hasWebsite(r) ? `Package preference: ${r.packageChoice}` : "",
    `Budget: ${r.budget}`,
  ]
    .filter(Boolean)
    .join("\n");
}
