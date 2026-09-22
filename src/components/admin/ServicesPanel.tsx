import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { AdminCard, EmptyState, MiniSelect } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { SERVICE_CATEGORIES, servicesQuery } from "@/lib/crm";

const emptyForm = {
  name: "",
  category: SERVICE_CATEGORIES[0],
  short_description: "",
  description: "",
  display_order: "",
};

export function ServicesPanel() {
  const qc = useQueryClient();
  const { data = [], isLoading, error } = useQuery(servicesQuery);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Add a service name.");
      return;
    }
    setBusy(true);
    const { error: insertError } = await supabase.from("services").insert({
      name: form.name.trim(),
      category: form.category,
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      display_order: Number(form.display_order) || data.length + 1,
    });
    setBusy(false);
    if (insertError) {
      toast.error(insertError.message);
      return;
    }
    toast.success("Service added.");
    setForm(emptyForm);
    await qc.invalidateQueries({ queryKey: ["admin", "services"] });
  }

  async function patch(id: string, values: { active?: boolean; display_order?: number }) {
    const { error: updateError } = await supabase.from("services").update(values).eq("id", id);
    if (updateError) {
      toast.error(updateError.message);
      return;
    }
    await qc.invalidateQueries({ queryKey: ["admin", "services"] });
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading services…</p>;
  if (error) return <EmptyState>You need a staff account to manage services.</EmptyState>;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form onSubmit={create} className="space-y-3 rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">New service</p>
        <div className="space-y-1">
          <Label htmlFor="svc-name" className="text-xs">
            Name
          </Label>
          <Input
            id="svc-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Category</Label>
          <MiniSelect
            ariaLabel="Category"
            className="h-10 w-full text-sm"
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v as typeof form.category })}
            options={SERVICE_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="svc-short" className="text-xs">
            Short description
          </Label>
          <Input
            id="svc-short"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="svc-desc" className="text-xs">
            Description
          </Label>
          <Textarea
            id="svc-desc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="svc-order" className="text-xs">
            Display order
          </Label>
          <Input
            id="svc-order"
            type="number"
            min={0}
            value={form.display_order}
            onChange={(e) => setForm({ ...form, display_order: e.target.value })}
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full rounded-full">
          {busy ? "Saving…" : "Add service"}
        </Button>
      </form>

      <div className="space-y-3">
        {data.length === 0 ? (
          <EmptyState>No services yet.</EmptyState>
        ) : (
          data.map((s) => (
            <AdminCard key={s.id} className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex-1">
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-accent">{s.category}</p>
                {s.short_description && (
                  <p className="text-xs text-muted-foreground">{s.short_description}</p>
                )}
              </div>
              <Input
                type="number"
                aria-label={`Display order for ${s.name}`}
                defaultValue={s.display_order}
                onBlur={(e) => patch(s.id, { display_order: Number(e.target.value) || 0 })}
                className="h-9 w-20"
              />
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => patch(s.id, { active: !s.active })}
              >
                {s.active ? "Deactivate" : "Activate"}
              </Button>
            </AdminCard>
          ))
        )}
      </div>
    </div>
  );
}
