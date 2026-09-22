import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminCard, EmptyState, MiniSelect } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { PORTFOLIO_CATEGORIES } from "@/lib/content";
import {
  adminPortfolioQuery,
  deletePortfolioImage,
  uploadPortfolioImage,
} from "@/lib/portfolio";

export function PortfolioPanel() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery(adminPortfolioQuery);
  const [form, setForm] = useState({
    title: "",
    category: PORTFOLIO_CATEGORIES[0] ?? "",
    caption: "",
    tags: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Add a title.");
      return;
    }
    setBusy(true);
    try {
      const image_path = file ? await uploadPortfolioImage(file) : null;
      const { error } = await supabase.from("portfolio_items").insert({
        title: form.title,
        category: form.category,
        caption: form.caption || null,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        image_path,
        published: true,
      });
      if (error) throw error;
      toast.success("Added to the portfolio.");
      setForm({ title: "", category: PORTFOLIO_CATEGORIES[0] ?? "", caption: "", tags: "" });
      setFile(null);
      qc.invalidateQueries({ queryKey: ["portfolio"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, path: string | null) {
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await deletePortfolioImage(path);
    toast.success("Removed.");
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  }

  async function togglePublished(id: string, published: boolean) {
    const { error } = await supabase
      .from("portfolio_items")
      .update({ published: !published })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form onSubmit={save} className="space-y-3 rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">Add work</p>
        <div className="space-y-1">
          <Label htmlFor="title" className="text-xs">
            Title
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Category</Label>
          <MiniSelect
            ariaLabel="Category"
            className="h-10 w-full text-sm"
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
            options={PORTFOLIO_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="caption" className="text-xs">
            Caption
          </Label>
          <Textarea
            id="caption"
            rows={3}
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="tags" className="text-xs">
            Tags (comma separated)
          </Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="poster, church, event"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="image" className="text-xs">
            Image (JPG, PNG, WebP — max 10MB)
          </Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full rounded-full">
          <Upload className="mr-2 h-4 w-4" /> {busy ? "Saving…" : "Add to portfolio"}
        </Button>
      </form>

      <div className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading work…</p>}
        {!isLoading && items.length === 0 && <EmptyState>No portfolio work yet.</EmptyState>}
        {items.map((item) => (
          <AdminCard key={item.id} className="flex gap-4">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-20 w-20 rounded-lg object-cover"
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-xs text-accent">{item.category}</p>
              {item.caption && <p className="mt-1 text-xs text-muted-foreground">{item.caption}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{item.tags.join(" · ")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => togglePublished(item.id, item.published)}
              >
                {item.published ? "Hide" : "Publish"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full"
                aria-label={`Delete ${item.title}`}
                onClick={() => remove(item.id, item.image_path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
