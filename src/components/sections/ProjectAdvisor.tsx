import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Compass, Download, MessageCircle, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getProjectRecommendation } from "@/lib/project-advisor.functions";
import type { ProjectRecommendation } from "@/lib/project-advisor";
import { downloadProjectBrief } from "@/lib/project-brief-pdf";
import { submitContactLead } from "@/lib/leads.functions";
import { projectRecommendationMessage, waLink } from "@/lib/whatsapp";

const BUDGETS = [
  "Under KES 20,000",
  "KES 20,000–50,000",
  "KES 50,000–100,000",
  "KES 100,000–200,000",
  "Above KES 200,000",
  "Not decided yet",
];

const TIMELINES = [
  "Within 1 week",
  "Within 2–3 weeks",
  "Within 1 month",
  "Within 2–3 months",
  "Flexible / exploring",
];

export function ProjectAdvisor() {
  const getRecommendation = useServerFn(getProjectRecommendation);
  const saveLead = useServerFn(submitContactLead);
  const [goals, setGoals] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<ProjectRecommendation | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [sending, setSending] = useState(false);
  const [followUpSent, setFollowUpSent] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });

  async function submit() {
    if (goals.trim().length < 20 || !budget || !timeline) {
      toast.error("Add your project goals, budget and timeline first.");
      return;
    }
    setLoading(true);
    setRecommendation(null);
    try {
      const next = await getRecommendation({ data: { goals, budget, timeline } });
      setRecommendation(next);
      setShowFollowUp(false);
      setFollowUpSent(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The recommendation could not be completed.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadBrief() {
    if (!recommendation) return;
    setDownloading(true);
    try {
      await downloadProjectBrief({ goals, budget, timeline, recommendation });
      toast.success("Your tailored brief has been downloaded.");
    } catch {
      toast.error("The PDF could not be prepared. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function requestFollowUp(event: React.FormEvent) {
    event.preventDefault();
    if (!recommendation) return;
    if (contact.name.trim().length < 2 || (!contact.email.trim() && !contact.phone.trim())) {
      toast.error("Add your name and either an email or phone number.");
      return;
    }
    setSending(true);
    try {
      await saveLead({
        data: {
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          businessName: "",
          service: recommendation.serviceArea,
          message: [
            "Project advisor follow-up request",
            `Recommended package: ${recommendation.packageName}`,
            `Goals: ${goals}`,
            `Budget: ${budget}`,
            `Timeline: ${timeline}`,
          ].join("\n"),
        },
      });
      setFollowUpSent(true);
      toast.success("Thanks — S&S can now follow up with you.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Your details could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="project-advisor" className="relative overflow-hidden border-t border-border bg-ink py-20 text-background md:py-28">
      <div className="facet-shard pointer-events-none absolute -right-12 top-8 h-56 w-44 bg-accent/10" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(22rem,0.48fr)] lg:gap-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">AI project advisor</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Find a practical starting package.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-background/70 md:text-base">
            Share what you want to achieve, your working budget and timing. You’ll receive one concise recommendation based only on our published services and packages.
          </p>

          <div className="mt-9 space-y-5">
            <div>
              <label htmlFor="project-goals" className="text-sm font-semibold text-background">Project goals</label>
              <Textarea
                id="project-goals"
                rows={6}
                maxLength={1200}
                value={goals}
                onChange={(event) => setGoals(event.target.value)}
                placeholder="Example: We need a credible website for our consultancy, branded email, enquiry capture and better Google visibility."
                className="mt-2 min-h-36 rounded-none border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-accent"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-background">Working budget</label>
                <Select value={budget} onValueChange={setBudget}>
                  <SelectTrigger className="mt-2 h-11 rounded-none border-background/20 bg-background/5 text-background focus:ring-accent">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGETS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold text-background">Preferred timeline</label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger className="mt-2 h-11 rounded-none border-background/20 bg-background/5 text-background focus:ring-accent">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMELINES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={submit} disabled={loading} size="lg" className="w-full rounded-none sm:w-auto">
              <Compass className="h-4 w-4" />
              {loading ? "Preparing recommendation…" : "Recommend my package"}
            </Button>
            <p className="text-xs text-background/50">AI runs only when you press the button. Your answers are used for this recommendation.</p>
          </div>
        </Reveal>

        <Reveal delay={80} className="lg:pt-14">
          <aside aria-live="polite" className="min-h-[28rem] border border-background/15 bg-background/6 p-6 backdrop-blur-md md:p-8">
            {loading ? (
              <div className="flex min-h-[24rem] items-center justify-center text-center">
                <div>
                  <span className="mx-auto block h-12 w-12 animate-spin rounded-full border-2 border-background/20 border-t-accent motion-reduce:animate-none" />
                  <p className="mt-5 text-sm text-background/65">Matching your goals to our service catalogue…</p>
                </div>
              </div>
            ) : recommendation ? (
              <div className="animate-fade-in motion-reduce:animate-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Recommended starting point</p>
                <h3 className="mt-3 text-2xl font-bold text-background">{recommendation.packageName}</h3>
                <p className="mt-1 text-sm font-medium text-accent">{recommendation.serviceArea}</p>
                <p className="mt-5 text-sm leading-relaxed text-background/75">{recommendation.summary}</p>
                <dl className="mt-6 space-y-4 border-y border-background/15 py-5 text-sm">
                  <div><dt className="font-semibold text-background">Budget fit</dt><dd className="mt-1 text-background/65">{recommendation.budgetFit}</dd></div>
                  <div><dt className="font-semibold text-background">Timeline fit</dt><dd className="mt-1 text-background/65">{recommendation.timelineFit}</dd></div>
                </dl>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-background">Tailored next steps</p>
                  <ol className="mt-3 space-y-3">
                    {recommendation.nextSteps.map((step) => (
                      <li key={step} className="flex gap-3 text-sm text-background/70">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                {recommendation.considerations.length > 0 && (
                  <p className="mt-5 text-xs leading-relaxed text-background/50">{recommendation.considerations.join(" · ")}</p>
                )}
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <Button asChild size="lg" className="w-full rounded-none">
                    <a href={waLink(projectRecommendationMessage({ goals, budget, timeline, recommendation }))} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-4 w-4" /> WhatsApp brief <ArrowRight className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={downloadBrief} disabled={downloading} className="w-full rounded-none border-background/25 bg-transparent text-background hover:bg-background/10 hover:text-background">
                    <Download className="h-4 w-4" /> {downloading ? "Preparing PDF…" : "Download PDF"}
                  </Button>
                </div>

                <div className="mt-6 border-t border-background/15 pt-6">
                  {followUpSent ? (
                    <div className="flex gap-3 bg-accent/10 p-4 text-sm text-background/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <p>Your details were received. S&amp;S will use your preferred contact to follow up.</p>
                    </div>
                  ) : showFollowUp ? (
                    <form onSubmit={requestFollowUp} className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-background">Would you like S&amp;S to follow up?</p>
                        <p className="mt-1 text-xs text-background/55">Optional. Add your name and one contact method.</p>
                      </div>
                      <Input
                        aria-label="Your name"
                        value={contact.name}
                        onChange={(event) => setContact({ ...contact, name: event.target.value })}
                        placeholder="Your name"
                        maxLength={120}
                        className="h-11 rounded-none border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-accent"
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          aria-label="Email address"
                          type="email"
                          value={contact.email}
                          onChange={(event) => setContact({ ...contact, email: event.target.value })}
                          placeholder="Email address"
                          maxLength={160}
                          className="h-11 rounded-none border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-accent"
                        />
                        <Input
                          aria-label="Phone number"
                          type="tel"
                          value={contact.phone}
                          onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                          placeholder="Phone / WhatsApp"
                          maxLength={40}
                          className="h-11 rounded-none border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-accent"
                        />
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button type="submit" disabled={sending} className="rounded-none">
                          <UserRound className="h-4 w-4" /> {sending ? "Sending…" : "Request a follow-up"}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setShowFollowUp(false)} className="rounded-none text-background/65 hover:bg-background/10 hover:text-background">
                          Not now
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button type="button" variant="ghost" onClick={() => setShowFollowUp(true)} className="w-full rounded-none text-background/75 hover:bg-background/10 hover:text-background">
                      <UserRound className="h-4 w-4" /> Ask S&amp;S to follow up
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[24rem] items-center justify-center text-center">
                <div className="max-w-xs">
                  <span className="mx-auto grid h-14 w-14 place-items-center bg-accent/10 text-accent [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]">
                    <Compass className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-background">Your brief will appear here</h3>
                  <p className="mt-3 text-sm leading-relaxed text-background/55">One package, one service direction and a short action plan — without a sales form or automatic follow-up.</p>
                </div>
              </div>
            )}
          </aside>
        </Reveal>
      </div>
    </section>
  );
}