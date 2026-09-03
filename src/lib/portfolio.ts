import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  caption: string | null;
  tags: string[];
  image_path: string | null;
  published: boolean;
  sort_order: number;
  imageUrl: string | null;
};

const BUCKET = "portfolio";

async function withSignedUrls<T extends { image_path: string | null }>(rows: T[]) {
  const paths = rows.map((r) => r.image_path).filter((p): p is string => Boolean(p));
  const signed = new Map<string, string>();

  if (paths.length) {
    const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60);
    data?.forEach((entry) => {
      if (entry.path && entry.signedUrl) signed.set(entry.path, entry.signedUrl);
    });
  }

  return rows.map((row) => ({
    ...row,
    imageUrl: row.image_path ? (signed.get(row.image_path) ?? null) : null,
  }));
}

export const publishedPortfolioQuery = queryOptions({
  queryKey: ["portfolio", "published"],
  queryFn: async (): Promise<PortfolioItem[]> => {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("id, title, category, caption, tags, image_path, published, sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return withSignedUrls(data ?? []);
  },
});

export const adminPortfolioQuery = queryOptions({
  queryKey: ["portfolio", "admin"],
  queryFn: async (): Promise<PortfolioItem[]> => {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("id, title, category, caption, tags, image_path, published, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return withSignedUrls(data ?? []);
  },
});

export async function uploadPortfolioImage(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `items/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function deletePortfolioImage(path: string | null) {
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
