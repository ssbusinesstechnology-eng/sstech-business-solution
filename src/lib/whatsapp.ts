import { SITE_NAME, SITE_URL, WHATSAPP_PRIMARY, WHATSAPP_SECONDARY } from "./site";

export { WHATSAPP_PRIMARY, WHATSAPP_SECONDARY };

/** Where every WhatsApp flow points people to book a discovery call. */
export const BOOKING_URL = `${SITE_URL}/contact`;

export type Currency = "KES" | "USD";

export function money(currency: Currency, kes: number, usd: number) {
  return currency === "KES" ? `KES ${kes.toLocaleString()}` : `USD ${usd.toLocaleString()}`;
}

/** Builds a wa.me deep link with a pre-filled message. */
export function waLink(text: string, number: string = WHATSAPP_PRIMARY) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

const greeting = `Hi ${SITE_NAME}!`;

function compose(lines: (string | false | undefined)[]) {
  return [greeting, "", ...lines.filter(Boolean), "", `Booking link: ${BOOKING_URL}`].join("\n");
}

export function generalMessage() {
  return compose(["I'd like a quote for a project.", "Please send me your availability."]);
}

export function bookingMessage() {
  return compose([
    "I'd like to book the free 20-minute discovery call.",
    "Here's a quick summary of what I need:",
    "•",
  ]);
}

export function serviceMessage(service: { title: string; body: string }) {
  return compose([
    `I'm interested in: *${service.title}*`,
    service.body,
    "",
    "Could you share pricing, timeline and what you need from me to start?",
  ]);
}

export function posMessage() {
  return compose([
    "I'd like to know more about *S&S POS*.",
    "Here's my business type and what I need to manage:",
    "•",
    "",
    "Please share pricing, setup time and what's included.",
  ]);
}

export function tierMessage(
  tier: { name: string; kes: number; usd: number; delivery: string; features: string[] },
  currency: Currency,
) {
  return compose([
    `I'd like the *${tier.name}* website package.`,
    `Price: ${money(currency, tier.kes, tier.usd)}`,
    `Timeline: ${tier.delivery}`,
    "Includes:",
    ...tier.features.slice(0, 4).map((f) => `• ${f}`),
    "",
    "Please confirm the next step and deposit details.",
  ]);
}

export function designItemMessage(item: { item: string; price: string }) {
  return compose([
    `I'd like a quote for: *${item.item}*`,
    `Listed rate: ${item.price}`,
    "",
    "Here's what the design is for:",
  ]);
}

export function quoteMessage(input: {
  tier: { name: string; kes: number; usd: number; delivery: string };
  currency: Currency;
  addons: { label: string; detail: string }[];
  total: string;
}) {
  return compose([
    "*Quote request from the website estimator*",
    "",
    `Package: ${input.tier.name} — ${money(input.currency, input.tier.kes, input.tier.usd)}`,
    `Timeline: ${input.tier.delivery}`,
    "",
    "Add-ons:",
    ...(input.addons.length ? input.addons.map((a) => `• ${a.label} — ${a.detail}`) : ["• None"]),
    "",
    `*Estimated total: ${input.total}*`,
    "",
    "Please confirm this estimate and book me in.",
  ]);
}

export function enquiryMessage(input: {
  name: string;
  email: string;
  service: string;
  message: string;
}) {
  return compose([
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Service: ${input.service}`,
    "",
    input.message,
  ]);
}

export function portfolioMessage(item: { title: string; category: string }) {
  return compose([
    `I saw *${item.title}* (${item.category}) on your portfolio.`,
    "I'd like something similar — could you quote me?",
  ]);
}
