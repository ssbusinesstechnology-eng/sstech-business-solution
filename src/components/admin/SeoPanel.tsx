import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, Lightbulb, RefreshCw, Zap } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";

import { AdminCard, EmptyState } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  seoRecommendationsQuery,
  toggleRecommendationStatus,
  generateAiRecommendations,
} from "@/lib/seo.functions";

export function SeoPanel() {
  const qc = useQueryClient();
  const { data: recs = [], isLoading } = useQuery(seoRecommendationsQuery);
  const toggleStatus = useServerFn(toggleRecommendationStatus);
  const generateRecs = useServerFn(generateAiRecommendations);

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await toggleStatus({ data: { id, is_implemented: !current } });
      toast.success("Status updated.");
      qc.invalidateQueries({ queryKey: ["admin", "seo_recommendations"] });
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleGenerate = async () => {
    try {
      await generateRecs();
      toast.success("AI is analyzing... recommendations refreshed.");
      qc.invalidateQueries({ queryKey: ["admin", "seo_recommendations"] });
    } catch (err) {
      toast.error("AI generation failed.");
    }
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            GSC AI Recommendations
          </h2>
          <p className="text-sm text-muted-foreground">
            Actionable SEO insights generated from Google Search Console data and site analysis.
          </p>
        </div>
        <Button onClick={handleGenerate} variant="outline" size="sm" className="rounded-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh with AI
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground italic">Analyzing Search Console data...</p>
        )}
        {!isLoading && recs.length === 0 && <EmptyState>No recommendations found.</EmptyState>}
        {recs.map((rec) => (
          <AdminCard key={rec.id} className={rec.is_implemented ? "opacity-60" : ""}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={priorityColor(rec.priority)}>
                    {rec.priority.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {rec.category}
                  </span>
                </div>
                <h3 className="font-semibold">{rec.title}</h3>
                <p className="text-sm text-muted-foreground">{rec.advice}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Zap className="h-3 w-3 text-accent" />
                  <span className="text-xs text-accent font-medium">Impact: {rec.impact_area}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full shrink-0"
                onClick={() => handleToggle(rec.id, rec.is_implemented)}
                title={rec.is_implemented ? "Mark as pending" : "Mark as implemented"}
              >
                {rec.is_implemented ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
