import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { featuredPortfolioItems, publishedPortfolioQuery } from "@/lib/portfolio";
import { portfolioMessage, waLink } from "@/lib/whatsapp";

export function PortfolioSection({
  id = "portfolio",
  limit,
}: {
  id?: string;
  limit?: number;
}) {
  const { data: databaseItems = [], isLoading } = useQuery(publishedPortfolioQuery);
  const items = useMemo(() => {
    const existingTitles = new Set(databaseItems.map((item) => item.title.toLowerCase()));
    return [
      ...featuredPortfolioItems.filter((item) => !existingTitles.has(item.title.toLowerCase())),
      ...databaseItems,
    ];
  }, [databaseItems]);
  const [filter, setFilter] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );

  const visible = useMemo(() => {
    const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [items, filter, limit]);

  return (
    <Section
      id={id}
      eyebrow="Selected work"
      title="Work we've delivered"
      description="Websites, branding, business systems and marketing design for clients across Kenya."
    >
      {categories.length > 1 && !limit && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                filter === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading work…</p>}
      {!isLoading && visible.length === 0 && (
        <p className="text-sm text-muted-foreground">
          New work is being added here shortly. Message us to see recent projects.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, i) => (
          <Reveal key={item.id} delay={i * 45}>
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-4/3 w-full bg-muted object-contain"
                />
              ) : (
                <div className="gradient-brand grid aspect-4/3 w-full place-items-center px-6 text-center">
                  <span className="font-display text-lg text-primary-foreground/90">
                    {item.title}
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] uppercase tracking-widest text-accent">{item.category}</p>
                <h3 className="mt-2 font-sans text-base font-semibold">{item.title}</h3>
                {item.caption && (
                  <p className="mt-2 text-sm text-muted-foreground">{item.caption}</p>
                )}
                {item.tags.length > 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">{item.tags.join(" · ")}</p>
                )}
                <Button asChild size="sm" variant="outline" className="mt-5 w-full rounded-full">
                  <a href={waLink(portfolioMessage(item))} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> Request something similar
                  </a>
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
