import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SeoRecommendation = {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high";
  advice: string;
  impact_area: string;
  is_implemented: boolean;
  created_at: string;
};

export const seoRecommendationsQuery = queryOptions({
  queryKey: ["admin", "seo_recommendations"],
  queryFn: async (): Promise<SeoRecommendation[]> => {
    const { data, error } = await supabase
      .from("seo_recommendations")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as SeoRecommendation[];
  },
});

export const toggleRecommendationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data }: { data: { id: string; is_implemented: boolean } }) => {
    const { error } = await supabase
      .from("seo_recommendations")
      .update({ is_implemented: data.is_implemented })
      .eq("id", data.id);
    if (error) throw error;
    return { success: true };
  });

/**
 * Placeholder for Lovable AI Gateway integration.
 * This function could be expanded to fetch data from GSC and use LLMs to generate advice.
 */
export const generateAiRecommendations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    // In a real implementation, this would call the Lovable AI Gateway
    // to analyze the site's sitemap and GSC data.
    const newRecs = [
      {
        title: "Create Case Study Content",
        category: "Content Strategy",
        priority: "medium",
        advice:
          "Turn your 'Apex Consulting Portfolio' item into a full case study to rank for 'Financial Web Solutions'.",
        impact_area: "Organic Traffic",
      },
    ];

    for (const rec of newRecs) {
      await supabase.from("seo_recommendations").insert(rec);
    }

    return { success: true };
  });
