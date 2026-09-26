import ogCover from "@/assets/og-cover.jpg.asset.json";

export const SITE_URL = "https://sstech-business-solution.lovable.app";
export const SITE_NAME = "S&S Business Solutions";
export const TAGLINE = "Build. Brand. Digitize. Grow.";

export const EMAIL = "ssbusinesstechnology@gmail.com";
export const WHATSAPP_PRIMARY = "254713268806";
export const WHATSAPP_SECONDARY = "254115323604";

/** Absolute URL used for Open Graph / Twitter previews. */
export const OG_IMAGE = `${SITE_URL}${ogCover.url}`;

export type SeoInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  keywords?: string;
};

/** Builds a complete title/description/Open Graph/Twitter/canonical head block. */
export function seo({ title, description, path, type = "website", keywords }: SeoInput) {
  const url = `${SITE_URL}${path}`;

  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_KE" },
    { property: "og:image", content: OG_IMAGE },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE },
    { name: "geo.region", content: "KE-30" },
    { name: "geo.placename", content: "Nairobi" },
  ];

  if (keywords) meta.push({ name: "keywords", content: keywords });

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  slogan: TAGLINE,
  description:
    "S&S Business Solutions provides technology, digital, branding and business solutions for entrepreneurs, professionals, SMEs, cooperatives and organisations in Kenya.",
  url: SITE_URL,
  email: EMAIL,
  telephone: `+${WHATSAPP_PRIMARY}`,
  image: OG_IMAGE,
  logo: OG_IMAGE,
  priceRange: "KES 800 – KES 140,000",
  areaServed: [{ "@type": "City", name: "Nairobi" }, { "@type": "Country", name: "Kenya" }],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    addressCountry: "KE",
    streetAddress: "Nairobi CBD & Westlands",
  },
  founder: [
    { "@type": "Person", name: "Sheila", jobTitle: "Chief Technology & Innovation Officer" },
    { "@type": "Person", name: "Sam", jobTitle: "Chief Marketing & Frontend Officer" },
  ],
  knowsAbout: [
    "Business solutions Kenya",
    "Business websites Kenya",
    "Web design Kenya",
    "Branding Kenya",
    "Business software Kenya",
    "POS systems Kenya",
    "Digital solutions Kenya",
    "Business technology solutions Kenya",
  ],
};

export function breadcrumbJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
}
