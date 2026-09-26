import { createServerFn } from "@tanstack/react-start";

const BUCKET = "portfolio";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export const getPublishedPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: rows, error } = await supabaseAdmin
    .from("portfolio_items")
    .select("id, title, category, caption, tags, image_path, published, sort_order")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getPublishedPortfolio]", error);
    throw new Error("The portfolio could not be loaded. Please try again.");
  }

  const paths = rows.map((row) => row.image_path).filter((path): path is string => Boolean(path));
  const signedUrls = new Map<string, string>();

  if (paths.length > 0) {
    const { data, error: signingError } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);

    if (signingError) {
      console.error("[getPublishedPortfolio:sign]", signingError);
    } else {
      data.forEach((entry) => {
        if (entry.path && entry.signedUrl) signedUrls.set(entry.path, entry.signedUrl);
      });
    }
  }

  return rows.map((row) => ({
    ...row,
    imageUrl: row.image_path ? (signedUrls.get(row.image_path) ?? null) : null,
  }));
});