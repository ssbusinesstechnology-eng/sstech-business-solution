import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/Reveal";
import { PageHeader, Section } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_OPTIONS } from "@/lib/content";
import { submitContactLead } from "@/lib/leads.functions";
import { EMAIL, breadcrumbJsonLd, seo } from "@/lib/site";
import {
  WHATSAPP_PRIMARY,
  WHATSAPP_SECONDARY,
  bookingMessage,
  enquiryMessage,
  waLink,
} from "@/lib/whatsapp";

const PATH = "/contact";
const TITLE = "Contact S&S Business Solutions — Request a Quote in Kenya";
const DESCRIPTION =
  "Tell us what you need — a website, branding, professional email, POS or business software, digital marketing or corporate solutions. Send the form to WhatsApp or book a free discovery call.";

export const Route = createFileRoute("/contact")({
  head: () => {
    const base = seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      keywords: "contact web designer Nairobi, website quote Kenya, graphic designer Nairobi contact",
    });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd("Contact", PATH)),
        },
      ],
    };
  },
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    service: SERVICE_OPTIONS[0] ?? "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const saveLead = useServerFn(submitContactLead);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.message.trim().length < 5) {
      toast.error("Please add your name and a short message.");
      return;
    }
    setSending(true);
    const wa = window.open("", "_blank", "noopener");
    try {
      await saveLead({
        data: {
          name: form.name,
          businessName: form.businessName,
          email: form.email,
          phone: form.phone,
          service: form.service,
          message: form.message,
        },
      });
      toast.success("Enquiry received — opening WhatsApp…");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
      const url = waLink(enquiryMessage(form));
      if (wa) wa.location.href = url;
      else window.open(url, "_blank", "noopener");
    }
  }


  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Tell us about your project"
        description="Fill in the form and it opens WhatsApp with everything already written, or reach us directly on the numbers below."
      />

      <Section
        eyebrow="Get in touch"
        title="Send an enquiry"
        description="We reply during working hours, Monday to Saturday."
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <form onSubmit={submit} className="space-y-5 rounded-2xl surface-card p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Wanjiku"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business">Business name (optional)</Label>
                  <Input
                    id="business"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="Acme Ltd"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone / WhatsApp (optional)</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">What do you need?</Label>
                <select
                  id="service"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Project details</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your goals, timeline and budget."
                />
              </div>
              <Button type="submit" disabled={sending} className="w-full rounded-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                {sending ? "Sending…" : "Talk to S&S on WhatsApp"}
              </Button>
            </form>
          </Reveal>

          <Reveal delay={80}>
            <div className="space-y-4">
              <div className="rounded-2xl surface-card p-6">
                <h2 className="text-lg font-semibold">Talk to us directly</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <a
                      href={waLink(bookingMessage(), WHATSAPP_PRIMARY)}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      +254 713 268806
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <a
                      href={waLink(bookingMessage(), WHATSAPP_SECONDARY)}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary"
                    >
                      +254 115 323 604
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${EMAIL}`} className="hover:text-primary">
                      {EMAIL}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    Nairobi CBD &amp; Westlands, Kenya
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl surface-card p-6">
                <h2 className="text-lg font-semibold">Free discovery call</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Twenty minutes to talk through your goals, audience and budget — no obligation.
                </p>
                <Button asChild variant="outline" className="mt-5 w-full rounded-full">
                  <a href={waLink(bookingMessage())} target="_blank" rel="noreferrer">
                    Book the call
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </SiteLayout>
  );
}
