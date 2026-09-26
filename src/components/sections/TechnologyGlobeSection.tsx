import { ClientOnly } from "@tanstack/react-router";
import { ArrowUpRight, Globe2, Network, Workflow } from "lucide-react";
import { lazy, Suspense } from "react";

import { Reveal } from "@/components/Reveal";

const TechnologyGlobe = lazy(() => import("@/components/TechnologyGlobe"));

const signals = [
  { icon: Globe2, label: "Digital presence" },
  { icon: Network, label: "Connected systems" },
  { icon: Workflow, label: "Smarter operations" },
];

function GlobeFallback() {
  return (
    <div className="grid h-[24rem] place-items-center sm:h-[30rem] lg:h-[36rem]" aria-hidden="true">
      <div className="h-64 w-64 rounded-full border border-accent/35 shadow-[inset_0_0_60px_color-mix(in_oklab,var(--accent)_12%,transparent)] sm:h-80 sm:w-80" />
    </div>
  );
}

export function TechnologyGlobeSection() {
  return (
    <section className="relative overflow-hidden border-y border-background/15 bg-ink text-background">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--accent)_18%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--accent)_18%,transparent)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_right,transparent,black_25%,black_75%,transparent)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-2 px-5 py-16 md:px-8 lg:grid-cols-[minmax(18rem,0.4fr)_minmax(0,0.6fr)] lg:py-20">
        <Reveal className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Connected strategy</p>
          <h2 className="mt-5 text-3xl font-bold leading-tight text-background sm:text-4xl md:text-5xl">
            Technology built around how your business moves
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-background/65 sm:text-base">
            One joined-up approach across your digital presence, customer experience and daily operations.
          </p>
          <div className="mt-8 grid gap-px border border-background/15 bg-background/15 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {signals.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-ink/85 px-4 py-4">
                <Icon className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-xs font-semibold text-background/80">{label}</span>
              </div>
            ))}
          </div>
          <a href="#project-advisor" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Match your project to a package
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <div className="relative -mx-5 lg:mx-0">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
          <ClientOnly fallback={<GlobeFallback />}>
            <Suspense fallback={<GlobeFallback />}>
              <TechnologyGlobe />
            </Suspense>
          </ClientOnly>
          <div className="glass-panel pointer-events-none absolute bottom-5 right-5 hidden w-48 p-4 text-foreground sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">S&amp;S network</p>
            <p className="mt-2 text-xs font-semibold">Build · Brand · Digitize · Grow</p>
          </div>
        </div>
      </div>
    </section>
  );
}