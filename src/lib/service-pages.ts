export type ServicePageSlug =
  | "web-design"
  | "business-technology"
  | "pos-inventory"
  | "digital-marketing"
  | "branding"
  | "professional-email";

export type ServicePageData = {
  slug: ServicePageSlug;
  path: `/${ServicePageSlug}`;
  label: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  offers: { title: string; body: string }[];
  audience: string[];
  why: string[];
  related: ServicePageSlug[];
  faqs: { q: string; a: string }[];
};

const WHY_COMMON = [
  "One Kenyan team for your website, brand, systems and marketing",
  "Clear scope and pricing agreed before work starts",
  "Direct support on WhatsApp, phone and email",
];

export const SERVICE_PAGES: ServicePageData[] = [
  {
    slug: "web-design",
    path: "/web-design",
    label: "Website Design & Development",
    title: "Website Design & Development in Kenya | S&S Business Solutions",
    description:
      "Professional, mobile-friendly business websites designed and built in Kenya — fast, search-ready and easy for clients to contact you.",
    h1: "Website design & development for Kenyan businesses",
    intro:
      "We design and build fast, mobile-friendly websites that present your business professionally and turn visitors into enquiries.",
    offers: [
      { title: "Business websites", body: "Clear, credible sites that explain what you do and how to reach you." },
      { title: "Landing pages", body: "Focused pages for a product, campaign or event." },
      { title: "Website redesigns", body: "Modernise an outdated site without losing what already works." },
      { title: "SEO-ready build", body: "Clean structure, metadata and fast loading from day one." },
      { title: "WhatsApp & enquiry forms", body: "Make it effortless for clients to contact you." },
    ],
    audience: ["SMEs and startups", "Professionals and consultants", "Churches, schools and organisations", "Shops and service providers"],
    why: [...WHY_COMMON, "Monthly website packages available — see Solutions for current pricing"],
    related: ["professional-email", "digital-marketing", "branding"],
    faqs: [
      { q: "How long does a website take?", a: "Most business websites are ready within one to three weeks once content is agreed." },
      { q: "Will my website work on phones?", a: "Yes. Every site we build is designed mobile-first." },
      { q: "Can you also set up my domain and email?", a: "Yes — we handle domain, hosting and professional email as part of the setup." },
      { q: "How much does a website cost?", a: "See our Solutions page for current packages, or request a quote for custom work." },
    ],
  },
  {
    slug: "business-technology",
    path: "/business-technology",
    label: "Business Technology Solutions",
    title: "Business Technology Solutions in Kenya | S&S Business Solutions",
    description:
      "Practical business systems, custom tools and digital workflows that help Kenyan businesses work faster and stay organised.",
    h1: "Business technology solutions that fit how you work",
    intro:
      "We help businesses replace manual work with practical systems — from simple digital tools to custom solutions built around your operations.",
    offers: [
      { title: "Custom business systems", body: "Tools built around your actual workflow." },
      { title: "Process digitisation", body: "Move records, bookings and reports off paper." },
      { title: "Dashboards & reporting", body: "See sales, stock and activity at a glance." },
      { title: "Technology advice", body: "Honest guidance on which tools are worth using." },
    ],
    audience: ["Growing SMEs", "Retail and service businesses", "Organisations managing records manually"],
    why: [...WHY_COMMON, "Solutions that can grow with your team"],
    related: ["pos-inventory", "web-design", "professional-email"],
    faqs: [
      { q: "Do I need a custom system?", a: "Not always. We first check whether an existing tool fits, then recommend custom work only when it adds value." },
      { q: "Can you train my staff?", a: "Yes, we include handover and training so your team can use the system confidently." },
      { q: "How is pricing done?", a: "Business technology work is quotation-based. Request a quote and we'll scope it with you." },
    ],
  },
  {
    slug: "pos-inventory",
    path: "/pos-inventory",
    label: "POS & Inventory Solutions",
    title: "POS & Inventory Solutions in Kenya | S&S Business Solutions",
    description:
      "S&S POS and inventory solutions for Kenyan shops and businesses — track sales, stock and reports in one simple system.",
    h1: "POS & inventory solutions for Kenyan businesses",
    intro:
      "Track sales, stock and daily performance in one simple system, set up and supported by S&S.",
    offers: [
      { title: "Point of sale", body: "Fast checkout and accurate sales records." },
      { title: "Inventory tracking", body: "Know what's in stock and what's running low." },
      { title: "Sales reports", body: "Daily, weekly and monthly performance at a glance." },
      { title: "Setup & training", body: "We configure the system and train your staff." },
    ],
    audience: ["Retail shops and supermarkets", "Pharmacies and hardware stores", "Restaurants and cafés", "Any business selling stock"],
    why: [...WHY_COMMON, "Local setup and ongoing support"],
    related: ["business-technology", "web-design", "branding"],
    faqs: [
      { q: "Does the POS track stock automatically?", a: "Yes, sales update stock levels so you always know what's available." },
      { q: "Can I see reports remotely?", a: "Reporting options depend on the setup; we'll recommend what fits your business." },
      { q: "How much does it cost?", a: "Pricing depends on your business size and needs — request a quote for an accurate figure." },
    ],
  },
  {
    slug: "digital-marketing",
    path: "/digital-marketing",
    label: "Digital Marketing & SEO",
    title: "Digital Marketing & SEO Services in Kenya | S&S Business Solutions",
    description:
      "Digital marketing and SEO for Kenyan businesses — get found on Google, grow on social media and attract more enquiries.",
    h1: "Digital marketing & SEO that brings real enquiries",
    intro:
      "We help your business get found on Google and social media, and turn that attention into enquiries.",
    offers: [
      { title: "Search engine optimisation", body: "Improve how your website ranks on Google." },
      { title: "Google Business Profile", body: "Show up on Maps and local searches." },
      { title: "Social media management", body: "Consistent, on-brand content for your audience." },
      { title: "Campaign design", body: "Graphics and copy for promotions and launches." },
    ],
    audience: ["Businesses with a website that gets few enquiries", "New brands building awareness", "Local service providers"],
    why: [...WHY_COMMON, "Data-led improvements, not guesswork"],
    related: ["web-design", "branding", "business-technology"],
    faqs: [
      { q: "How long does SEO take?", a: "Most businesses see meaningful improvement over a few months of consistent work." },
      { q: "Do I need a website first?", a: "A website helps a lot. We can build one or improve your existing site." },
      { q: "How is marketing priced?", a: "Request a quote and we'll recommend a plan that suits your goals and budget." },
    ],
  },
  {
    slug: "branding",
    path: "/branding",
    label: "Branding & Graphic Design",
    title: "Branding & Graphic Design Services in Kenya | S&S Business Solutions",
    description:
      "Logos, brand identity, posters and marketing design for Kenyan businesses, churches and organisations.",
    h1: "Branding & graphic design that looks professional everywhere",
    intro:
      "From your logo to posters and social media graphics, we create one consistent identity your clients recognise and trust.",
    offers: [
      { title: "Logo & brand identity", body: "A distinctive logo, colours and type." },
      { title: "Posters & flyers", body: "Eye-catching designs for events and promotions." },
      { title: "Social media graphics", body: "On-brand templates and campaign visuals." },
      { title: "Business documents", body: "Cards, letterheads and company profiles." },
    ],
    audience: ["New businesses", "Churches and event organisers", "Brands refreshing an old look"],
    why: [...WHY_COMMON, "Designs applied consistently across web and print"],
    related: ["digital-marketing", "web-design", "professional-email"],
    faqs: [
      { q: "How many logo options will I get?", a: "We share initial concepts and refine your chosen direction." },
      { q: "Do I get the source files?", a: "Yes, you receive the final files for print and digital use." },
      { q: "Can I see past work?", a: "Yes — visit our Portfolio page for sample designs." },
    ],
  },
  {
    slug: "professional-email",
    path: "/professional-email",
    label: "Business Email, Domain & Hosting",
    title: "Professional Business Email in Kenya | S&S Business Solutions",
    description:
      "Professional business email, domain registration and hosting for Kenyan businesses — look credible with name@yourbusiness.co.ke.",
    h1: "Professional business email, domain & hosting",
    intro:
      "Look credible with an email address on your own domain, plus reliable hosting for your website.",
    offers: [
      { title: "Business email", body: "Addresses like name@yourbusiness.co.ke." },
      { title: "Domain registration", body: ".co.ke, .com and other domains." },
      { title: "Website hosting", body: "Reliable hosting for your business website." },
      { title: "Setup on your devices", body: "We configure email on phones and computers." },
    ],
    audience: ["Businesses using Gmail or Yahoo for work", "New companies registering a domain", "Teams needing shared, professional addresses"],
    why: [...WHY_COMMON, "Setup handled end to end"],
    related: ["web-design", "business-technology", "digital-marketing"],
    faqs: [
      { q: "Can I keep my current domain?", a: "Yes, we can connect your existing domain." },
      { q: "Will email work on my phone?", a: "Yes, we set it up on your phone and computer." },
      { q: "What does it cost?", a: "See our Solutions page for current packages, or request a quote." },
    ],
  },
];

export function getServicePage(slug: ServicePageSlug) {
  return SERVICE_PAGES.find((p) => p.slug === slug)!;
}
