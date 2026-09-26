import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminCard, EmptyState, PanelHeading } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import {
  generateAiRecommendations,
  refreshSeoSnapshot,
  seoRecommendationsQuery,
  seoSnapshotQuery,
} from "@/lib/seo.functions";

const priorityClasses = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-accent/20 text-accent-foreground",
  low: "bg-muted text-muted-foreground",
};

function number(value: unknown) {
  return typeof value === "number" ? value.toLocaleString() : "0";
}

export function SeoInsightsPanel() {
  const qc = useQueryClient();
  const { data: snapshot, isLoading } = useQuery(seoSnapshotQuery);
  const { data: recommendations = [] } = useQuery(seoRecommendationsQuery);
  const refresh = useServerFn(refreshSeoSnapshot);
  const analyze = useServerFn(generateAiRecommendations);
  const [refreshing, setRefreshing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  async function refreshData() {
    setRefreshing(true);
    try {
      await refresh();
      await qc.invalidateQueries({ queryKey: ["admin", "seo-snapshot"] });
      toast.success("Search Console data refreshed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not refresh Search Console data.");
    } finally {
      setRefreshing(false);
    }
  }

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      const result = await analyze();
      await qc.invalidateQueries({ queryKey: ["admin", "seo-ai-recommendations"] });
      toast.success(`${result.count} prioritized improvements generated.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate recommendations.");
    } finally {
      setAnalyzing(false);
    }
  }

  const totals = snapshot?.totals ?? {
    clicks: 0,
    impressions: 0,
    ctr: 0,
    previous_clicks: 0,
    previous_impressions: 0,
  };
  const queries = snapshot?.query_rows ?? [];
  const pages = snapshot?.page_rows ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">SEO Insights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search performance is saved here. AI runs only when you request it.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full" disabled={refreshing} onClick={refreshData}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing…" : "Refresh Google data"}
          </Button>
          <Button className="rounded-full" disabled={!snapshot || analyzing} onClick={runAnalysis}>
            <Sparkles className="mr-2 h-4 w-4" />
            {analyzing ? "Analyzing…" : "Generate improvements"}
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading SEO data…</p>}
      {!isLoading && !snapshot && (
        <EmptyState>Refresh Google data to create the first performance snapshot.</EmptyState>
      )}

      {snapshot && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <AdminCard>
              <p className="text-xs text-muted-foreground">Clicks</p>
              <p className="mt-1 text-2xl font-semibold">{number(totals.clicks)}</p>
            </AdminCard>
            <AdminCard>
              <p className="text-xs text-muted-foreground">Impressions</p>
              <p className="mt-1 text-2xl font-semibold">{number(totals.impressions)}</p>
            </AdminCard>
            <AdminCard>
              <p className="text-xs text-muted-foreground">Click-through rate</p>
              <p className="mt-1 text-2xl font-semibold">
                {`${(totals.ctr * 100).toFixed(1)}%`}
              </p>
            </AdminCard>
          </div>
          <p className="text-xs text-muted-foreground">
            {snapshot.period_start} to {snapshot.period_end} · {snapshot.site_url}
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <AdminCard>
              <PanelHeading title="Top search queries" count={queries.length} />
              {queries.length === 0 ? (
                <div className="mt-4"><EmptyState>No query data reported for this period.</EmptyState></div>
              ) : (
                <div className="mt-4 space-y-3">
                  {queries.slice(0, 10).map((row, index) => (
                    <div key={`${row.keys?.[0] ?? "query"}-${index}`} className="flex items-start justify-between gap-4 border-b border-border pb-3 text-sm last:border-0">
                      <span className="min-w-0 break-words">{row.keys?.[0] ?? "Unknown query"}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{number(row.clicks)} clicks · {number(row.impressions)} views</span>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>
            <AdminCard>
              <PanelHeading title="Top pages" count={pages.length} />
              {pages.length === 0 ? (
                <div className="mt-4"><EmptyState>No page data reported for this period.</EmptyState></div>
              ) : (
                <div className="mt-4 space-y-3">
                  {pages.slice(0, 10).map((row, index) => (
                    <div key={`${row.keys?.[0] ?? "page"}-${index}`} className="flex items-start justify-between gap-4 border-b border-border pb-3 text-sm last:border-0">
                      <span className="min-w-0 break-all">{row.keys?.[0] ?? "Unknown page"}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{number(row.clicks)} clicks</span>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>
          </div>
        </>
      )}

      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          <PanelHeading title="Prioritized improvements" count={recommendations.length} />
        </div>
        {recommendations.length === 0 ? (
          <EmptyState>No AI recommendations yet. Refresh Google data, then request an analysis.</EmptyState>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {recommendations.map((recommendation) => (
              <AdminCard key={recommendation.id}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{recommendation.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${priorityClasses[recommendation.priority]}`}>
                    {recommendation.priority}
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Evidence</p>
                <p className="mt-1 text-sm">{recommendation.evidence}</p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Target</p>
                <p className="mt-1 break-all text-sm">{recommendation.target}</p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Recommended action</p>
                <p className="mt-1 text-sm">{recommendation.action}</p>
              </AdminCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}