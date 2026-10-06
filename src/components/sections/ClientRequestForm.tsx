import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Check, Compass, Download, Minus, MessageCircle, Plus, Send } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BUSINESS_TYPES,
  EMPTY_REQUEST,
  FEATURES,
  MAILBOX_OPTIONS,
  NEEDS,
  PACKAGE_CUSTOM,
  PACKAGE_UNSURE,
  allPackageCategories,
  buildGoals,
  buildLeadMessage,
  buildWhatsAppSummary,
  businessTypeLabel,
  costNotes,
  featuresList,
  findPlan,
  hasEmail,
  hasWebsite,
  leadServiceLabel,
  mailboxLabel,
  needsList,
  planPriceLabel,
  primaryCategoryId,
  type ClientRequest,
} from "@/lib/client-request";
import { submitContactLead } from "@/lib/leads.functions";
import type { ProjectRecommendation } from "@/lib/project-advisor";
import { getProjectRecommendation } from "@/lib/project-advisor.functions";
import { downloadProjectBrief } from "@/lib/project-brief-pdf";
import { ADDITIONAL_PAGES, PROFESSIONAL_EMAIL } from "@/lib/pricing";
import { enquiryMessage, waLink } from "@/lib/whatsapp";

type StepId = "details" | "type" | "needs" | "package" | "email" | "website" | "project" | "recommendation" | "review";

const STEP_TITLES: Record<StepId, string> = {
  details: "Your details",
  type: "Business type",
  needs: "What do you need?",
  package: "Website package",
  email: "Professional email",
  website: "Website features",
  project: "Project & budget",
  recommendation: "Our recommendation",
  review: "Review & submit",
};

const detailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  businessName: z.string().trim().min(2, "Enter your business or company name"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone / WhatsApp number")
    .max(40)
    .regex(/^[0-9+()\-\s]+$/, "Enter a valid phone / WhatsApp number"),
  email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address").max(160),
});

const fieldClass =
  "h-11 rounded-none border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-accent";

type Props = {
  budgets: string[];
  /** Values already entered in the AI advisor, used to prefill. */
  initialGoals?: string;
  initialBudget?: string;
  advisorRecommendation?: ProjectRecommendation | null;
};

function Choice({
  selected,
  onClick,
  children,
  type = "checkbox",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  type?: "checkbox" | "radio";
}) {
  return (
    <button
      type="button"
      role={type}
      aria-checked={selected}
      onClick={onClick}
      className={`flex min-h-12 w-full items-center gap-3 border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        selected ? "border-accent bg-accent/10 text-background" : "border-background/20 bg-background/5 text-background/75 hover:border-background/40"
      }`}
    >
      <span className={`grid h-5 w-5 shrink-0 place-items-center border ${selected ? "border-accent bg-accent text-accent-foreground" : "border-background/30"}`}>
        {selected && <Check className="h-3.5 w-3.5" />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

function FieldError({ message }: { message?: string | undefined }) {
  return message ? <p role="alert" className="mt-1.5 text-xs text-red-300">{message}</p> : null;
}

export function ClientRequestForm({ budgets, initialGoals, initialBudget, advisorRecommendation }: Props) {
  const getRecommendation = useServerFn(getProjectRecommendation);
  const saveLead = useServerFn(submitContactLead);
  const topRef = useRef<HTMLDivElement>(null);

  const [request, setRequest] = useState<ClientRequest>(() => ({
    ...EMPTY_REQUEST,
    description: initialGoals?.trim() ?? "",
    budget: initialBudget && budgets.includes(initialBudget) ? initialBudget : EMPTY_REQUEST.budget,
    packageChoice:
      advisorRecommendation && (findPlan(advisorRecommendation.packageName) || advisorRecommendation.packageName === PACKAGE_CUSTOM)
        ? advisorRecommendation.packageName
        : PACKAGE_UNSURE,
  }));
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [rec, setRec] = useState<ProjectRecommendation | null>(null);
  const [recKey, setRecKey] = useState("");
  const [recLoading, setRecLoading] = useState(false);
  const [recFailed, setRecFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const steps = useMemo<StepId[]>(() => {
    const list: StepId[] = ["details", "type", "needs"];
    if (hasWebsite(request)) list.push("package");
    if (hasEmail(request)) list.push("email");
    if (hasWebsite(request)) list.push("website");
    list.push("project", "recommendation", "review");
    return list;
  }, [request]);

  const step: StepId = steps[Math.min(stepIndex, steps.length - 1)] ?? "details";
  const goals = buildGoals(request);
  const currentKey = JSON.stringify([goals, request.budget]);
  const recIsCurrent = rec !== null && recKey === currentKey;

  const update = <K extends keyof ClientRequest>(key: K, value: ClientRequest[K]) => {
    setRequest((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };
  const toggle = (key: "needs" | "features", item: string) =>
    update(key, request[key].includes(item) ? request[key].filter((x) => x !== item) : [...request[key], item]);

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validate(current: StepId) {
    const next: Record<string, string> = {};
    if (current === "details") {
      const result = detailsSchema.safeParse(request);
      if (!result.success) for (const issue of result.error.issues) next[String(issue.path[0])] ??= issue.message;
    }
    if (current === "type") {
      if (!request.businessType) next["businessType"] = "Select your business type";
      else if (request.businessType === "Other" && request.businessTypeOther.trim().length < 2)
        next["businessTypeOther"] = "Tell us your type of business";
    }
    if (current === "needs") {
      if (request.needs.length === 0) next["needs"] = "Select at least one option";
      else if (request.needs.includes("Other") && request.needsOther.trim().length < 3)
        next["needsOther"] = "Briefly describe what else you need";
    }
    if (current === "email" && request.mailboxes === "5+") {
      const n = Number.parseInt(request.mailboxesApprox, 10);
      if (!Number.isFinite(n) || n < 5) next["mailboxesApprox"] = "Enter the approximate number (5 or more)";
    }
    if (current === "website" && request.features.includes("Other") && request.featuresOther.trim().length < 3)
      next["featuresOther"] = "Briefly describe the other feature";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validate(step)) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    scrollTop();
  }
  function goBack() {
    setErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
    scrollTop();
  }
  function jumpTo(id: StepId) {
    const index = steps.indexOf(id);
    if (index >= 0) {
      setErrors({});
      setStepIndex(index);
      scrollTop();
    }
  }

  async function fetchRecommendation() {
    if (recIsCurrent) return;
    setRecLoading(true);
    setRecFailed(false);
    try {
      const next = await getRecommendation({ data: { goals, budget: request.budget, timeline: "Not specified" } });
      setRec(next);
      setRecKey(currentKey);
    } catch (error) {
      setRecFailed(true);
      toast.error(error instanceof Error ? error.message : "The recommendation could not be completed.");
    } finally {
      setRecLoading(false);
    }
  }

  async function submit() {
    const check = detailsSchema.safeParse(request);
    if (!check.success) {
      toast.error("Please complete your details first.");
      jumpTo("details");
      return;
    }
    const activeRec = recIsCurrent ? rec : null;
    setSubmitting(true);
    try {
      await saveLead({
        data: {
          name: request.name,
          email: request.email,
          phone: request.phone,
          businessName: request.businessName,
          service: leadServiceLabel(request, activeRec),
          message: buildLeadMessage(request, activeRec),
        },
      });
      setSubmitted(true);
      scrollTop();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Your request could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function downloadBrief() {
    if (!rec) return;
    setDownloading(true);
    try {
      await downloadProjectBrief({ goals, budget: request.budget, timeline: "Not specified", recommendation: rec });
      toast.success("Your brief has been downloaded.");
    } catch {
      toast.error("The PDF could not be prepared. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  const activeRec = recIsCurrent ? rec : null;

  if (submitted) {
    return (
      <div ref={topRef} className="animate-fade-in motion-reduce:animate-none">
        <div className="flex gap-3 bg-accent/10 p-5 text-sm text-background/85">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p>Thank you. Your request has been received. S&amp;S Business Solutions will review your requirements and get in touch with you.</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button asChild size="lg" className="w-full rounded-none">
            <a
              href={waLink(
                enquiryMessage({
                  name: request.name,
                  email: request.email,
                  service: leadServiceLabel(request, activeRec),
                  message: buildWhatsAppSummary(request, activeRec),
                }),
              )}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
            </a>
          </Button>
          {activeRec && (
            <Button type="button" variant="outline" size="lg" onClick={downloadBrief} disabled={downloading} className="w-full rounded-none border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background">
              <Download className="h-4 w-4" /> {downloading ? "Preparing PDF…" : "Download PDF brief"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  const primaryId = primaryCategoryId(request);
  const selectedCategoryId = allPackageCategories.find((c) => c.plans.some((p) => p.name === request.packageChoice))?.id;
  const visibleCategories = allPackageCategories.filter(
    (c) => showAllPackages || c.id === primaryId || c.id === selectedCategoryId,
  );

  const reviewRows: { label: string; value: string; step: StepId }[] = [
    { label: "Full name", value: request.name, step: "details" },
    { label: "Business", value: request.businessName, step: "details" },
    { label: "Phone / WhatsApp", value: request.phone, step: "details" },
    { label: "Email", value: request.email, step: "details" },
    { label: "Business type", value: businessTypeLabel(request), step: "type" },
    { label: "Services requested", value: needsList(request).join(", "), step: "needs" },
    ...(hasWebsite(request) ? [{ label: "Selected package", value: request.packageChoice, step: "package" as StepId }] : []),
    ...(hasEmail(request) ? [{ label: "Professional email", value: mailboxLabel(request), step: "email" as StepId }] : []),
    ...(hasWebsite(request)
      ? [
          { label: "Requested features", value: featuresList(request).join(", ") || "None selected", step: "website" as StepId },
          { label: "Additional pages", value: request.extraPages > 0 ? String(request.extraPages) : "None", step: "website" as StepId },
        ]
      : []),
    { label: "Budget", value: request.budget, step: "project" },
    { label: "Project description", value: request.description.trim() || "Not provided", step: "project" },
  ];

  return (
    <div ref={topRef} className="scroll-mt-24">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-background/60">
          <span>Step {stepIndex + 1} of {steps.length}</span>
          <span className="font-semibold text-accent">{STEP_TITLES[step]}</span>
        </div>
        <div className="mt-2 flex gap-1" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={stepIndex + 1}>
          {steps.map((id, i) => (
            <span key={id} className={`h-1 flex-1 ${i <= stepIndex ? "bg-accent" : "bg-background/20"}`} />
          ))}
        </div>
      </div>

      <h4 className="text-xl font-bold text-background">{STEP_TITLES[step]}</h4>

      <div className="mt-5 space-y-4">
        {step === "details" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {([
              ["name", "Full name", "text", "name"],
              ["businessName", "Business / company name", "text", "organization"],
              ["phone", "Phone / WhatsApp number", "tel", "tel"],
              ["email", "Email address", "email", "email"],
            ] as const).map(([key, label, type, autoComplete]) => (
              <div key={key}>
                <label htmlFor={`req-${key}`} className="text-sm font-semibold text-background">{label} <span className="text-accent">*</span></label>
                <Input
                  id={`req-${key}`}
                  type={type}
                  autoComplete={autoComplete}
                  inputMode={key === "phone" ? "tel" : undefined}
                  maxLength={key === "email" ? 160 : key === "phone" ? 40 : 160}
                  value={request[key]}
                  onChange={(event) => update(key, event.target.value)}
                  aria-invalid={Boolean(errors[key])}
                  className={`mt-2 ${fieldClass}`}
                />
                <FieldError message={errors[key]} />
              </div>
            ))}
          </div>
        )}

        {step === "type" && (
          <>
            <div role="radiogroup" aria-label="Business type" className="grid gap-3 sm:grid-cols-2">
              {BUSINESS_TYPES.map((item) => (
                <Choice key={item} type="radio" selected={request.businessType === item} onClick={() => update("businessType", item)}>{item}</Choice>
              ))}
            </div>
            <FieldError message={errors["businessType"]} />
            {request.businessType === "Other" && (
              <div>
                <Input aria-label="Your type of business" maxLength={100} value={request.businessTypeOther} onChange={(e) => update("businessTypeOther", e.target.value)} placeholder="What type of business do you run?" className={fieldClass} />
                <FieldError message={errors["businessTypeOther"]} />
              </div>
            )}
          </>
        )}

        {step === "needs" && (
          <>
            <p className="text-sm text-background/60">Select everything that applies.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {NEEDS.map((item) => (
                <Choice key={item} selected={request.needs.includes(item)} onClick={() => toggle("needs", item)}>{item}</Choice>
              ))}
            </div>
            <FieldError message={errors["needs"]} />
            {request.needs.includes("Other") && (
              <div>
                <Textarea aria-label="Describe what else you need" rows={3} maxLength={300} value={request.needsOther} onChange={(e) => update("needsOther", e.target.value)} placeholder="Describe what else you need" className="rounded-none border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-accent" />
                <FieldError message={errors["needsOther"]} />
              </div>
            )}
          </>
        )}

        {step === "package" && (
          <>
            <p className="text-sm text-background/60">Monthly subscription packages. Prices are per month in KES.</p>
            {visibleCategories.map((category) => (
              <div key={category.id}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{category.title}</p>
                <div role="radiogroup" aria-label={category.title} className="grid gap-3">
                  {category.plans.map((plan) => (
                    <Choice key={plan.name} type="radio" selected={request.packageChoice === plan.name} onClick={() => update("packageChoice", plan.name)}>
                      <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-semibold text-background">{plan.name}</span>
                        <span className="text-accent">{planPriceLabel(plan)}</span>
                      </span>
                      {plan.highlight && <span className="mt-0.5 block text-xs text-accent/80">{plan.highlight}</span>}
                      <span className="mt-1 block text-xs text-background/55">{plan.features.slice(0, 3).join(" · ")}</span>
                    </Choice>
                  ))}
                </div>
              </div>
            ))}
            {!showAllPackages && visibleCategories.length < allPackageCategories.length && (
              <Button type="button" variant="ghost" onClick={() => setShowAllPackages(true)} className="rounded-none text-background/70 hover:bg-background/10 hover:text-background">
                Show other package types
              </Button>
            )}
            <div role="radiogroup" aria-label="Other options" className="grid gap-3">
              <Choice type="radio" selected={request.packageChoice === PACKAGE_CUSTOM} onClick={() => update("packageChoice", PACKAGE_CUSTOM)}>
                <span className="font-semibold text-background">Custom Solution</span> <span className="text-accent">— Request a Quote</span>
                <span className="mt-1 block text-xs text-background/55">For advanced or custom requirements. S&amp;S prepares a quotation based on your needs.</span>
              </Choice>
              <Choice type="radio" selected={request.packageChoice === PACKAGE_UNSURE} onClick={() => update("packageChoice", PACKAGE_UNSURE)}>
                <span className="font-semibold text-background">{PACKAGE_UNSURE}</span>
              </Choice>
            </div>
          </>
        )}

        {step === "email" && (
          <>
            <p className="text-sm text-background/70">
              {PROFESSIONAL_EMAIL.priceLabel}. {PROFESSIONAL_EMAIL.included} Additional mailboxes are KES {PROFESSIONAL_EMAIL.kes} / month each.
            </p>
            <p className="text-sm font-semibold text-background">How many mailboxes do you need?</p>
            <div role="radiogroup" aria-label="Number of mailboxes" className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {MAILBOX_OPTIONS.map((item) => (
                <Choice key={item} type="radio" selected={request.mailboxes === item} onClick={() => update("mailboxes", item)}>{item === "1" ? "1 mailbox" : `${item} mailboxes`}</Choice>
              ))}
            </div>
            {request.mailboxes === "5+" && (
              <div>
                <Input aria-label="Approximate number of mailboxes" inputMode="numeric" maxLength={3} value={request.mailboxesApprox} onChange={(e) => update("mailboxesApprox", e.target.value.replace(/\D/g, ""))} placeholder="Approximate number of mailboxes" className={fieldClass} />
                <FieldError message={errors["mailboxesApprox"]} />
              </div>
            )}
          </>
        )}

        {step === "website" && (
          <>
            <p className="text-sm text-background/60">Select the features you'd like. Not every feature is included in every package — S&amp;S will confirm what fits, and some may need a custom quotation.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map((item) => (
                <Choice key={item} selected={request.features.includes(item)} onClick={() => toggle("features", item)}>{item}</Choice>
              ))}
            </div>
            {request.features.includes("Other") && (
              <div>
                <Input aria-label="Other feature" maxLength={120} value={request.featuresOther} onChange={(e) => update("featuresOther", e.target.value)} placeholder="Describe the other feature" className={fieldClass} />
                <FieldError message={errors["featuresOther"]} />
              </div>
            )}
            <div className="border border-background/15 p-4">
              <p className="text-sm font-semibold text-background">Additional pages <span className="font-normal text-background/55">(optional)</span></p>
              <p className="mt-1 text-xs text-background/60">{ADDITIONAL_PAGES.label}. Only needed if you want more pages than your package includes.</p>
              <div className="mt-3 flex items-center gap-3">
                <Button type="button" variant="outline" size="icon" aria-label="Fewer additional pages" disabled={request.extraPages === 0} onClick={() => update("extraPages", Math.max(0, request.extraPages - 1))} className="h-11 w-11 rounded-none border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background">
                  <Minus className="h-4 w-4" />
                </Button>
                <span aria-live="polite" className="w-10 text-center text-lg font-semibold text-background">{request.extraPages}</span>
                <Button type="button" variant="outline" size="icon" aria-label="More additional pages" disabled={request.extraPages >= 20} onClick={() => update("extraPages", Math.min(20, request.extraPages + 1))} className="h-11 w-11 rounded-none border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "project" && (
          <>
            <div>
              <label htmlFor="req-description" className="text-sm font-semibold text-background">Tell us about your project <span className="font-normal text-background/55">(optional)</span></label>
              <Textarea id="req-description" rows={6} maxLength={1200} value={request.description} onChange={(e) => update("description", e.target.value)} placeholder="Briefly describe what you want your website, system or digital solution to do." className="mt-2 min-h-36 rounded-none border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-accent" />
              <p className="mt-1 text-xs text-background/50">Details such as your goals, customers and any must-have features help us advise you better.</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-background">Monthly budget</label>
              <Select value={request.budget} onValueChange={(value) => update("budget", value)}>
                <SelectTrigger className="mt-2 h-11 rounded-none border-background/20 bg-background/5 text-background focus:ring-accent">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-background/50">Guidance only — you can still choose any package.</p>
            </div>
          </>
        )}

        {step === "recommendation" && (
          <>
            {recLoading ? (
              <div className="flex min-h-48 items-center justify-center text-center">
                <div>
                  <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-2 border-background/20 border-t-accent motion-reduce:animate-none" />
                  <p className="mt-4 text-sm text-background/65">Matching your request to our catalogue…</p>
                </div>
              </div>
            ) : recIsCurrent && rec ? (
              <RecommendationCard request={request} rec={rec} />
            ) : (
              <div className="border border-background/15 p-5 text-sm text-background/70">
                <p>{recFailed ? "The recommendation couldn't be completed. You can try again, or continue to review and submit your request anyway." : "Get a recommendation based on your request. AI runs only when you press the button."}</p>
                <Button type="button" onClick={fetchRecommendation} className="mt-4 rounded-none">
                  <Compass className="h-4 w-4" /> {recFailed ? "Try again" : "Get my recommendation"}
                </Button>
              </div>
            )}
          </>
        )}

        {step === "review" && (
          <>
            <dl className="divide-y divide-background/15 border-y border-background/15 text-sm">
              {reviewRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
                  <dt className="font-semibold text-background sm:w-44 sm:shrink-0">{row.label}</dt>
                  <dd className="min-w-0 flex-1 whitespace-pre-line break-words text-background/70">{row.value}</dd>
                  <button type="button" onClick={() => jumpTo(row.step)} className="self-start text-xs font-semibold text-accent underline-offset-2 hover:underline">Edit</button>
                </div>
              ))}
              <div className="py-3 text-sm">
                <dt className="font-semibold text-background">AI recommendation</dt>
                <dd className="mt-1 text-background/70">
                  {activeRec ? (
                    <>
                      <span className="font-semibold text-background">{activeRec.packageName}</span>
                      {findPlan(activeRec.packageName) && <span className="text-accent"> — {planPriceLabel(findPlan(activeRec.packageName)!)}</span>}
                      <span className="mt-1 block">{activeRec.summary}</span>
                    </>
                  ) : (
                    <>
                      Not generated for the current answers.{" "}
                      <button type="button" onClick={() => jumpTo("recommendation")} className="font-semibold text-accent underline-offset-2 hover:underline">Get recommendation</button>
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button type="button" variant="ghost" onClick={goBack} disabled={stepIndex === 0 || submitting} className="rounded-none text-background/70 hover:bg-background/10 hover:text-background">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        {step === "review" ? (
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => jumpTo("details")} disabled={submitting} className="rounded-none border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background">
              Edit Request
            </Button>
            <Button type="button" onClick={submit} disabled={submitting} size="lg" className="rounded-none">
              <Send className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit Request"}
            </Button>
          </div>
        ) : step === "recommendation" ? (
          <Button type="button" onClick={goNext} disabled={recLoading} size="lg" className="rounded-none">
            {recIsCurrent ? "Review request" : "Skip to review"} <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={goNext} size="lg" className="rounded-none">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function RecommendationCard({ request, rec }: { request: ClientRequest; rec: ProjectRecommendation }) {
  const plan = findPlan(rec.packageName);
  const quoteRequired = !plan || !plan.kes;
  const notes = costNotes(request, rec.packageName);
  return (
    <div className="animate-fade-in motion-reduce:animate-none">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Recommended solution</p>
      <h5 className="mt-2 text-2xl font-bold text-background">{rec.packageName}</h5>
      <p className="mt-1 text-sm font-medium text-accent">
        {plan ? planPriceLabel(plan) : "Request a Quote"}
        {quoteRequired && " — customised quotation, no fixed price"}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-background/75">{rec.summary}</p>
      {plan && (
        <ul className="mt-4 grid gap-1.5 text-sm text-background/70 sm:grid-cols-2">
          {plan.features.slice(0, 8).map((feature) => (
            <li key={feature} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{feature}</li>
          ))}
        </ul>
      )}
      {notes.length > 0 && (
        <ul className="mt-4 space-y-1 border-t border-background/15 pt-4 text-sm text-background/70">
          {notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      )}
      <dl className="mt-4 space-y-3 border-y border-background/15 py-4 text-sm">
        <div><dt className="font-semibold text-background">Budget fit</dt><dd className="mt-1 text-background/65">{rec.budgetFit}</dd></div>
      </dl>
      <p className="mt-4 text-sm font-semibold text-background">Suggested next steps</p>
      <ol className="mt-2 space-y-2">
        {rec.nextSteps.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-background/70"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{item}</span></li>
        ))}
      </ol>
      {rec.considerations.length > 0 && <p className="mt-4 text-xs leading-relaxed text-background/50">{rec.considerations.join(" · ")}</p>}
    </div>
  );
}
