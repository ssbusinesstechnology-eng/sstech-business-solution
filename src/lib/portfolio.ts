import { queryOptions } from "@tanstack/react-query";

import artExhibition from "@/assets/portfolio/art-exhibition-day.jpg.asset.json";
import creativeVibes from "@/assets/portfolio/creative-vibes-event.jpg.asset.json";
import pizzaTime from "@/assets/portfolio/pizza-time-poster.jpg.asset.json";
import recruitmentCampaign from "@/assets/portfolio/recruitment-campaign.jpg.asset.json";
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

/** Selected real work supplied in the S&S design portfolio. */
export const featuredPortfolioItems: PortfolioItem[] = [
  {
    id: "featured-creative-vibes",
    title: "Creative Vibes Event Poster",
    category: "Marketing & Graphic Design",
    caption: "Art, music, food and fun event campaign artwork.",
    tags: ["event poster", "creative campaign", "social media"],
    image_path: null,
    published: true,
    sort_order: -40,
    imageUrl: creativeVibes.url,
  },
  {
    id: "featured-art-exhibition",
    title: "Art Exhibition Day",
    category: "Marketing & Graphic Design",
    caption: "School art exhibition invitation with an expressive editorial style.",
    tags: ["invitation", "school event", "poster"],
    image_path: null,
    published: true,
    sort_order: -30,
    imageUrl: artExhibition.url,
  },
  {
    id: "featured-pizza-time",
    title: "Pizza Time Product Poster",
    category: "Marketing & Graphic Design",
    caption: "Food product promotion created for digital campaign use.",
    tags: ["product poster", "food", "promotion"],
    image_path: null,
    published: true,
    sort_order: -20,
    imageUrl: pizzaTime.url,
  },
  {
    id: "featured-recruitment",
    title: "Recruitment Campaign Design",
    category: "Marketing & Graphic Design",
    caption: "Professional recruitment advert for a modern marketing role.",
    tags: ["recruitment", "business campaign", "social media"],
    image_path: null,
    published: true,
    sort_order: -10,
    imageUrl: recruitmentCampaign.url,
  },
];

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

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadPortfolioImage(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, WebP, AVIF or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("That image is larger than 10MB. Please upload a smaller file.");
  }
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `items/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function deletePortfolioImage(path: string | null) {
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
