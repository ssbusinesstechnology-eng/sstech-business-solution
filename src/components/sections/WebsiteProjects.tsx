import { ExternalLink } from "lucide-react";

import bactoai from "@/assets/portfolio/bactoai-site.jpg";
import limiel from "@/assets/portfolio/limiel-site.jpg";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

const PROJECTS = [
  {
    name: "BactoAI",
    url: "https://bactoai.co.ke",
    image: bactoai,
    category: "Website",
    description:
      "Website for an AI and genomics company that predicts antimicrobial resistance from bacterial genomes, with demo and pilot request pages.",
  },
  {
    name: "Limiel Insurance",
    url: "https://limielinsurance.co.ke",
    image: limiel,
    category: "Website",
    description:
      "Insurance website for comparing Motor, Health, Travel, Life and Business cover, with product pages and an online quote request.",
  },
];

export function WebsiteProjects() {
  return (
    <section className="pb-20">
      <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 60}>
            <article className="glass-panel flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-accent/60">
              <img
                src={p.image}
                alt={`${p.name} website homepage preview`}
                loading="lazy"
                width={960}
                height={540}
                className="aspect-video w-full bg-muted object-cover object-top"
              />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] uppercase tracking-widest text-accent">{p.category}</p>
                <h2 className="mt-2 font-sans text-xl font-semibold">{p.name}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
                <Button asChild className="mt-5 w-full rounded-none sm:w-auto sm:self-start">
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
