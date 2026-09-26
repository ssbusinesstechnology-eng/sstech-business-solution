import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Compass, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getProjectRecommendation } from "@/lib/project-advisor.functions";
import type { ProjectRecommendation } from "@/lib/project-advisor.server";
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
  const [goals, setGoals] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<ProjectRecommendation | null>(null);

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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The recommendation could not be completed.");
    } finally {
      setLoading(false);
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
                <Button asChild size="lg" className="mt-7 w-full rounded-none">
                  <a href={waLink(projectRecommendationMessage({ goals, budget, timeline, recommendation }))} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" /> Send brief on WhatsApp <ArrowRight className="ml-auto h-4 w-4" />
                  </a>
                </Button>
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