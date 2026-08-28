export const SITE_URL = "https://brandscape-builder-66.lovable.app";
export const SITE_NAME = "S&S Tech Solutions Hub";
export const TAGLINE = "Building Brands, One Design at a Time.";

export const EMAIL = "sstechsolutionsa@gmail.com";
export const WHATSAPP_PRIMARY = "254713268806";
export const WHATSAPP_SECONDARY = "254115323604";

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
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
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
  name: SITE_NAME,
  slogan: TAGLINE,
  url: SITE_URL,
  email: EMAIL,
  telephone: `+${WHATSAPP_PRIMARY}`,
  image: `${SITE_URL}/favicon.ico`,
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
    "Web design Nairobi",
    "Web development Kenya",
    "Graphic design Nairobi",
    "Logo design Kenya",
    "Poster design Nairobi",
    "Campaign branding Kenya",
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
