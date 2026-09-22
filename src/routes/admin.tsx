import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader, Section } from "@/components/Section";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { claimAdmin } from "@/lib/admin.functions";
import { PORTFOLIO_CATEGORIES } from "@/lib/content";
import {
  adminPortfolioQuery,
  deletePortfolioImage,
  uploadPortfolioImage,
} from "@/lib/portfolio";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Portfolio manager — S&S Business Solutions" },
      { name: "description", content: "Private area for uploading and organising portfolio work." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin"
        title="Portfolio manager"
        description="Upload new work, add a caption, category and tags, and control what appears on the public showcase."
      />
      <Section eyebrow="Your work" title={session ? "Manage portfolio" : "Sign in"}>
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : session ? (
          <PortfolioManager />
        ) : (
          <SignIn />
        )}
      </Section>
      {ready && session ? (
        <Section
          eyebrow="Enquiries"
          title="Quote requests & contact leads"
          description="Everything visitors send through the quote builder and contact form."
        >
          <Leads />
        </Section>
      ) : null}
    </SiteLayout>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(mode: "in" | "up") {
    setBusy(true);
    const fn =
      mode === "in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    const { error } = await fn;
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (mode === "up") toast.success("Account created — check your email if confirmation is required.");
    try {
      await claimAdmin();
    } catch {
      // first-user promotion is best-effort; existing admins keep their role
    }
  }

  return (
    <div className="max-w-md space-y-4 rounded-2xl surface-card p-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <Button disabled={busy} onClick={() => run("in")} className="rounded-full">
          Sign in
        </Button>
        <Button
          disabled={busy}
          variant="outline"
          onClick={() => run("up")}
          className="rounded-full"
        >
          Create account
        </Button>
      </div>
    </div>
  );
}

function PortfolioManager() {
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
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={save} className="space-y-4 rounded-2xl surface-card p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {PORTFOLIO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="caption">Caption</Label>
          <Textarea
            id="caption"
            rows={3}
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="poster, church, event"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
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
        <Button
          type="button"
          variant="ghost"
          className="w-full rounded-full"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </Button>
      </form>

      <div className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading work…</p>}
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-2xl surface-card p-4">
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
              {item.caption && (
                <p className="mt-1 text-xs text-muted-foreground">{item.caption}</p>
              )}
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
                onClick={() => remove(item.id, item.image_path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
