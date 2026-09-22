import { useServerFn } from "@tanstack/react-start";
import { Calculator, Minus, MessageCircle, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ADDONS, TIERS } from "@/lib/content";
import { submitQuoteRequest } from "@/lib/leads.functions";
import { money, quoteMessage, waLink, type Currency } from "@/lib/whatsapp";

type Selection = Record<string, number>;

export function QuoteBuilder({ currency }: { currency: Currency }) {
  const [tierName, setTierName] = useState(TIERS[2]!.name);
  const [selected, setSelected] = useState<Selection>({});
  const [details, setDetails] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    requirements: "",
  });
  const [sending, setSending] = useState(false);
  const saveQuote = useServerFn(submitQuoteRequest);

  const tier = TIERS.find((t) => t.name === tierName) ?? TIERS[0]!;


  const toggle = (id: string, on: boolean) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (on) next[id] = next[id] ?? 1;
      else delete next[id];
      return next;
    });

  const setQty = (id: string, qty: number, max: number) =>
    setSelected((prev) => {
      const next = { ...prev };
      const clamped = Math.min(Math.max(qty, 0), max);
      if (clamped <= 0) delete next[id];
      else next[id] = clamped;
      return next;
    });

  const summary = useMemo(() => {
    const chosen = ADDONS.filter((a) => selected[a.id]);
    const price = (a: (typeof ADDONS)[number]) => (currency === "KES" ? a.kes : a.usd);

    let oneOff = currency === "KES" ? tier.kes : tier.usd;
    let monthly = 0;
    const lines = chosen.map((a) => {
      const qty = selected[a.id] ?? 1;
      const amount = price(a) * qty;
      if (a.recurring === "monthly") monthly += amount;
      else oneOff += amount;
      return {
        label: a.perUnit ? `${a.label} × ${qty}` : a.label,
        detail:
          (currency === "KES" ? `KES ${amount.toLocaleString()}` : `USD ${amount.toLocaleString()}`) +
          (a.recurring === "monthly" ? " / month" : ""),
      };
    });

    const fmt = (n: number) =>
      currency === "KES" ? `KES ${n.toLocaleString()}` : `USD ${n.toLocaleString()}`;

    return {
      lines,
      oneOff,
      monthly,
      oneOffLabel: fmt(oneOff),
      monthlyLabel: monthly ? `${fmt(monthly)} / month` : null,
      totalLabel: monthly ? `${fmt(oneOff)} + ${fmt(monthly)} / month` : fmt(oneOff),
    };
  }, [selected, currency, tier]);

  async function send() {
    if (details.name.trim().length < 2) {
      toast.error("Please add your name so we can follow up.");
      return;
    }
    setSending(true);
    const wa = window.open("", "_blank", "noopener");
    try {
      await saveQuote({
        data: {
          name: details.name,
          businessName: details.businessName,
          email: details.email,
          phone: details.phone,
          currency,
          packageName: tier.name,
          selections: Object.entries(selected).map(([id, qty]) => ({ id, qty })),
          requirements: details.requirements,
        },
      });
      toast.success("Quote saved — opening WhatsApp with your summary…");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
      const url = waLink(
        quoteMessage({ tier, currency, addons: summary.lines, total: summary.totalLabel }),
      );
      if (wa) wa.location.href = url;
      else window.open(url, "_blank", "noopener");
    }
  }


  return (
    <Reveal className="mt-14">
      <div id="quote-builder" className="rounded-2xl surface-card p-6 md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent">
            <Calculator className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Add-on quote builder</h3>
            <p className="text-sm text-muted-foreground">
              Choose your package and extras — your estimate updates live.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Base package
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TIERS.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTierName(t.name)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    t.name === tierName
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  }`}
                >
                  {t.name} · {money(currency, t.kes, t.usd)}
                </button>
              ))}
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Add-ons
            </p>
            <ul className="mt-3 space-y-2">
              {ADDONS.map((addon) => {
                const qty = selected[addon.id] ?? 0;
                const active = qty > 0;
                return (
                  <li
                    key={addon.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      active ? "border-primary/60 bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`addon-${addon.id}`}
                        checked={active}
                        onCheckedChange={(v) => toggle(addon.id, v === true)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`addon-${addon.id}`}
                          className="cursor-pointer text-sm font-medium"
                        >
                          {addon.label}
                        </label>
                        <p className="text-xs text-muted-foreground">{addon.note}</p>
                        {addon.perUnit && active && (
                          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border">
                            <button
                              type="button"
                              aria-label={`Remove one ${addon.unitLabel}`}
                              onClick={() => setQty(addon.id, qty - 1, addon.max ?? 20)}
                              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:text-primary"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-16 text-center text-xs">
                              {qty} {addon.unitLabel}
                              {qty > 1 ? "s" : ""}
                            </span>
                            <button
                              type="button"
                              aria-label={`Add one ${addon.unitLabel}`}
                              onClick={() => setQty(addon.id, qty + 1, addon.max ?? 20)}
                              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:text-primary"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="whitespace-nowrap text-sm font-semibold text-primary">
                        {money(currency, addon.kes, addon.usd)}
                        {addon.perUnit ? ` / ${addon.unitLabel}` : ""}
                        {addon.recurring === "monthly" ? " / mo" : ""}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="h-fit rounded-2xl border border-primary/40 bg-surface p-6 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Your estimate
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{tier.name} package</dt>
                <dd>{money(currency, tier.kes, tier.usd)}</dd>
              </div>
              {summary.lines.map((line) => (
                <div key={line.label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{line.label}</dt>
                  <dd>{line.detail}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 border-t border-border pt-5">
              <p className="text-xs text-muted-foreground">Estimated total</p>
              <p className="mt-1 text-3xl font-bold text-primary">{summary.oneOffLabel}</p>
              {summary.monthlyLabel && (
                <p className="mt-1 text-sm text-muted-foreground">plus {summary.monthlyLabel}</p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Indicative only — we confirm the final price after a free discovery call.
              </p>
            </div>
            <div className="mt-6 space-y-3 border-t border-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Your details
              </p>
              <Input
                placeholder="Your name"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
              />
              <Input
                placeholder="Business name (optional)"
                value={details.businessName}
                onChange={(e) => setDetails({ ...details, businessName: e.target.value })}
              />
              <Input
                placeholder="Phone / WhatsApp (optional)"
                value={details.phone}
                onChange={(e) => setDetails({ ...details, phone: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email (optional)"
                value={details.email}
                onChange={(e) => setDetails({ ...details, email: e.target.value })}
              />
              <Textarea
                rows={3}
                placeholder="Anything else we should know? (optional)"
                value={details.requirements}
                onChange={(e) => setDetails({ ...details, requirements: e.target.value })}
              />
            </div>
            <Button disabled={sending} onClick={send} className="mt-5 w-full rounded-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              {sending ? "Sending…" : "Get a Quote on WhatsApp"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              We save your request so we can follow up, then open WhatsApp with the summary.
            </p>

          </aside>
        </div>
      </div>
    </Reveal>
  );
}
