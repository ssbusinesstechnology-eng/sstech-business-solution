import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Send, X } from "lucide-react";
import { toast } from "sonner";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DESIGN_PRICING } from "@/lib/content";
import { submitContactLead } from "@/lib/leads.functions";
import { designEnquiryMessage, waLink } from "@/lib/whatsapp";

export function DesignEnquiryCards() {
  const [open, setOpen] = useState<string | null>(null);
  const [formFor, setFormFor] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const submit = useServerFn(submitContactLead);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>, service: string) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const time = String(f.get("time") || "").trim();
    setSending(true);
    try {
      await submit({
        data: {
          name: String(f.get("name") || ""),
          phone: String(f.get("phone") || ""),
          email: String(f.get("email") || ""),
          service,
          message: `${String(f.get("message") || "")}${time ? `\nPreferred contact time: ${time}` : ""}`,
        },
      });
      setSent(service);
      setFormFor(null);
      toast.success("Enquiry sent — we'll be in touch.");
    } catch {
      toast.error("Couldn't send your enquiry. Please try again or use WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {DESIGN_PRICING.map((s, i) => (
        <Reveal key={s.item} delay={i * 60} className="h-full">
          <article className="surface-card flex h-full flex-col rounded-2xl p-6">
            <h3 className="text-lg font-semibold">{s.item}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.body}</p>
            {sent === s.item && (
              <p className="mt-4 text-sm font-medium text-primary">Thanks — your enquiry was received.</p>
            )}
            {open !== s.item ? (
              <Button className="mt-5 rounded-full" onClick={() => setOpen(s.item)}>
                Enquire Now
              </Button>
            ) : formFor !== s.item ? (
              <div className="mt-5 grid gap-2">
                <Button asChild className="rounded-full">
                  <a href={waLink(designEnquiryMessage(s.item))} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                  </a>
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => setFormFor(s.item)}>
                  <Send className="mr-2 h-4 w-4" /> Enquiry form
                </Button>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="mt-5 grid gap-2" onSubmit={(e) => onSubmit(e, s.item)}>
                <Input name="name" required minLength={2} maxLength={120} placeholder="Your name" />
                <Input name="phone" required maxLength={40} placeholder="Phone number" />
                <Input name="email" type="email" maxLength={160} placeholder="Email (optional)" />
                <Input name="time" maxLength={60} placeholder="Preferred contact time (optional)" />
                <Textarea name="message" required minLength={5} maxLength={1500} placeholder={`Brief requirements for your ${s.item}`} />
                <div className="flex gap-2">
                  <Button type="submit" disabled={sending} className="flex-1 rounded-full">
                    {sending ? "Sending…" : "Send enquiry"}
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setFormFor(null)} aria-label="Cancel">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  );
}
