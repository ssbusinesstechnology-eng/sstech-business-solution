import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SITE_TARGET = "https://sstech-business-solution.lovable.app/";
const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

type SearchRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type SiteEntry = { siteUrl: string; permissionLevel?: string };

export type SeoSnapshot = {
  id: string;
  site_url: string;
  period_start: string;
  period_end: string;
  previous_start: string;
  previous_end: string;
  query_rows: SearchRow[];
  page_rows: SearchRow[];
  totals: Record<string, number>;
  created_at: string;
};

export type SeoRecommendation = {
  id: string;
  snapshot_id: string;
  priority: "high" | "medium" | "low";
  title: string;
  evidence: string;
  target: string;
  action: string;
  created_at: string;
};

export const seoSnapshotQuery = queryOptions({
  queryKey: ["admin", "seo-snapshot"],
  queryFn: async (): Promise<SeoSnapshot | null> => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("seo_search_snapshots")
      .select("id, site_url, period_start, period_end, previous_start, previous_end, query_rows, page_rows, totals, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as SeoSnapshot | null;
  },
});

export const seoRecommendationsQuery = queryOptions({
  queryKey: ["admin", "seo-ai-recommendations"],
  queryFn: async (): Promise<SeoRecommendation[]> => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("seo_ai_recommendations")
      .select("id, snapshot_id, priority, title, evidence, target, action, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as SeoRecommendation[];
  },
});

function coversTarget(siteUrl: string, target: URL) {
  if (siteUrl.startsWith("sc-domain:")) {
    const domain = siteUrl.slice("sc-domain:".length).toLowerCase();
    const host = target.hostname.toLowerCase();
    return host === domain || host.endsWith(`.${domain}`);
  }
  try {
    return target.href.startsWith(new URL(siteUrl).href);
  } catch {
    return false;
  }
}

async function gscRequest(path: string, init?: RequestInit) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SEARCH_CONSOLE_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error("Google Search Console is not connected to this project.");
  }
  const response = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`Search Console request failed [${response.status}]: ${body}`);
    throw new Error(`Google Search Console request failed [${response.status}]: ${body}`);
  }
  return response.json();
}

async function resolveSiteUrl() {
  const listing = (await gscRequest("/webmasters/v3/sites")) as { siteEntry?: SiteEntry[] };
  const target = new URL(SITE_TARGET);
  const verified = (listing.siteEntry ?? []).filter(
    (entry) => entry.permissionLevel !== "siteUnverifiedUser" && coversTarget(entry.siteUrl, target),
  );
  const exact = verified.find((entry) => entry.siteUrl === SITE_TARGET);
  if (exact) return exact.siteUrl;
  if (verified.length === 1) {
    const onlySite = verified[0];
    if (onlySite) return onlySite.siteUrl;
  }
  if (verified.length === 0) {
    throw new Error("No verified Search Console property covers the published website.");
  }
  throw new Error("More than one Search Console property covers this website. Connect the exact published property.");
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function totalRows(rows: SearchRow[]) {
  return rows.reduce(
    (total, row) => ({
      clicks: total.clicks + (row.clicks ?? 0),
      impressions: total.impressions + (row.impressions ?? 0),
    }),
    { clicks: 0, impressions: 0 },
  );
}

async function queryPerformance(siteUrl: string, dimension: "query" | "page", startDate: string, endDate: string) {
  const data = (await gscRequest(
    `/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: [dimension],
        rowLimit: 25,
        dataState: "final",
      }),
    },
  )) as { rows?: SearchRow[] };
  return data.rows ?? [];
}

export const refreshSeoSnapshot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await context.supabase.rpc("has_role", { _role: "admin", _user_id: context.userId });
    if (role.error || !role.data) throw new Error("Admin access is required.");

    const end = new Date();
    end.setUTCDate(end.getUTCDate() - 3);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 27);
    const previousEnd = new Date(start);
    previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
    const previousStart = new Date(previousEnd);
    previousStart.setUTCDate(previousStart.getUTCDate() - 27);
    const dates = {
      start: dateOnly(start),
      end: dateOnly(end),
      previousStart: dateOnly(previousStart),
      previousEnd: dateOnly(previousEnd),
    };

    const siteUrl = await resolveSiteUrl();
    const [queryRows, pageRows, previousRows] = await Promise.all([
      queryPerformance(siteUrl, "query", dates.start, dates.end),
      queryPerformance(siteUrl, "page", dates.start, dates.end),
      queryPerformance(siteUrl, "query", dates.previousStart, dates.previousEnd),
    ]);
    const current = totalRows(queryRows);
    const previous = totalRows(previousRows);
    const { data, error } = await context.supabase
      .from("seo_search_snapshots")
      .insert({
        site_url: siteUrl,
        period_start: dates.start,
        period_end: dates.end,
        previous_start: dates.previousStart,
        previous_end: dates.previousEnd,
        query_rows: queryRows,
        page_rows: pageRows,
        totals: {
          clicks: current.clicks,
          impressions: current.impressions,
          ctr: current.impressions ? current.clicks / current.impressions : 0,
          previous_clicks: previous.clicks,
          previous_impressions: previous.impressions,
        },
        refreshed_by: context.userId,
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: data.id };
  });

const recommendationSchema = z.object({
  recommendations: z
    .array(
      z.object({
        priority: z.enum(["high", "medium", "low"]),
        title: z.string().min(3).max(100),
        evidence: z.string().min(5).max(400),
        target: z.string().min(1).max(300),
        action: z.string().min(5).max(500),
      }),
    )
    .min(1)
    .max(5),
});

export const generateAiRecommendations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await context.supabase.rpc("has_role", { _role: "admin", _user_id: context.userId });
    if (role.error || !role.data) throw new Error("Admin access is required.");
    const { data: snapshot, error } = await context.supabase
      .from("seo_search_snapshots")
      .select("id, site_url, period_start, period_end, query_rows, page_rows, totals")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!snapshot) throw new Error("Refresh Search Console data before running an analysis.");

    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI analysis is not configured.");
    const [{ createOpenAI }, { streamText }] = await Promise.all([
      import("@ai-sdk/openai"),
      import("ai"),
    ]);
    const provider = createOpenAI({
      baseURL: AI_GATEWAY,
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const result = streamText({
      model: provider.responses(MODEL),
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
      messages: [
        {
          role: "system",
          content:
            "You are an SEO strategist for a Nairobi technology and business solutions agency. Use only the supplied Search Console evidence. Return JSON only with 3-5 prioritized recommendations. Never invent rankings, traffic, clients, services, prices, or locations. Each recommendation needs priority, title, evidence, target, and a concrete action. Keep actions practical for the existing agency website.",
        },
        {
          role: "user",
          content: JSON.stringify({
            website: snapshot.site_url,
            period: [snapshot.period_start, snapshot.period_end],
            totals: snapshot.totals,
            topQueries: snapshot.query_rows,
            topPages: snapshot.page_rows,
          }),
        },
      ],
    });

    let text: string;
    try {
      text = await result.text;
    } catch (gatewayError) {
      const message = gatewayError instanceof Error ? gatewayError.message : "AI analysis failed.";
      throw new Error(message);
    }
    const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
    const parsed = recommendationSchema.parse(JSON.parse(cleaned));
    const { error: deleteError } = await context.supabase
      .from("seo_ai_recommendations")
      .delete()
      .eq("snapshot_id", snapshot.id);
    if (deleteError) throw deleteError;
    const { error: insertError } = await context.supabase.from("seo_ai_recommendations").insert(
      parsed.recommendations.map((recommendation) => ({
        ...recommendation,
        snapshot_id: snapshot.id,
        generated_by: context.userId,
      })),
    );
    if (insertError) throw insertError;
    return { count: parsed.recommendations.length };
  });