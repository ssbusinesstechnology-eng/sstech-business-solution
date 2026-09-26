import { cn } from "@/lib/utils";

export function FacetedForm({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 240"
      className={cn("faceted-form", className)}
      fill="none"
    >
      <path d="M120 12 212 72v96l-92 60-92-60V72z" className="fill-ink" />
      <path d="m120 12 92 60-92 48z" className="fill-primary" />
      <path d="m212 72-92 48 92 48z" className="fill-foreground/85" />
      <path d="m120 228-92-60 92-48z" className="fill-ink" />
      <path d="m28 72 92-60v108z" className="fill-primary/80" />
      <path d="m28 168 92-48L28 72z" className="fill-foreground/70" />
      <path d="m120 12 28 76-28 32-30-44z" className="fill-accent/35" />
    </svg>
  );
}