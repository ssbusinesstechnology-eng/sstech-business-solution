import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminCard, EmptyState, MiniSelect, StatPill } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  customersQuery,
  formatDate,
  label,
  PROJECT_STATUSES,
  projectsQuery,
  servicesQuery,
  staffQuery,
  type ProjectStatus,
} from "@/lib/crm";

const emptyForm = {
  name: "",
  customer_id: "",
  service_type: "",
  description: "",
  assigned_to: "",
  start_date: "",
  due_date: "",
};

export function ProjectsPanel() {
  const qc = useQueryClient();
  const { data = [], isLoading, error } = useQuery(projectsQuery);
  const { data: customers = [] } = useQuery(customersQuery);
  const { data: staff = [] } = useQuery(staffQuery);
  const { data: services = [] } = useQuery(servicesQuery);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [assignee, setAssignee] = useState("");

  const staffOptions = staff.map((s) => ({
    value: s.user_id,
    label: s.display_name || s.email || "Staff member",
  }));

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((p) => {
      if (status && p.status !== status) return false;
      if (assignee && p.assigned_to !== assignee) return false;
      if (!q) return true;
      return [p.name, p.service_type, p.customers?.name, p.customers?.business_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [data, search, status, assignee]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Add a project name.");
      return;
    }
    setBusy(true);
    const { error: insertError } = await supabase.from("projects").insert({
      name: form.name.trim(),
      customer_id: form.customer_id || null,
      service_type: form.service_type || null,
      description: form.description.trim() || null,
      assigned_to: form.assigned_to || null,
      start_date: form.start_date || null,
      due_date: form.due_date || null,
    });
    setBusy(false);
    if (insertError) {
      toast.error(insertError.message);
      return;
    }
    toast.success("Project created.");
    setForm(emptyForm);
    await qc.invalidateQueries({ queryKey: ["admin"] });
  }

  async function patch(id: string, values: Record<string, string | null>, message: string) {
    const { error: updateError } = await supabase.from("projects").update(values).eq("id", id);
    if (updateError) {
      toast.error(updateError.message);
      return;
    }
    toast.success(message);
    await qc.invalidateQueries({ queryKey: ["admin"] });
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading projects…</p>;
  if (error) return <EmptyState>You need a staff account to view projects.</EmptyState>;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form onSubmit={create} className="space-y-3 rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">New project</p>
        <div className="space-y-1">
          <Label htmlFor="proj-name" className="text-xs">
            Project name
          </Label>
          <Input
            id="proj-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Client</Label>
          <MiniSelect
            ariaLabel="Client"
            className="h-10 w-full text-sm"
            value={form.customer_id}
            onChange={(v) => setForm({ ...form, customer_id: v })}
            placeholder="No client linked"
            options={customers.map((c) => ({
              value: c.id,
              label: c.business_name ? `${c.name} — ${c.business_name}` : c.name,
            }))}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Service type</Label>
          <MiniSelect
            ariaLabel="Service type"
            className="h-10 w-full text-sm"
            value={form.service_type}
            onChange={(v) => setForm({ ...form, service_type: v })}
            placeholder="Not set"
            options={services.map((s) => ({ value: s.name, label: s.name }))}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Assigned staff</Label>
          <MiniSelect
            ariaLabel="Assigned staff"
            className="h-10 w-full text-sm"
            value={form.assigned_to}
            onChange={(v) => setForm({ ...form, assigned_to: v })}
            placeholder="Unassigned"
            options={staffOptions}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="proj-start" className="text-xs">
              Start
            </Label>
            <Input
              id="proj-start"
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="proj-due" className="text-xs">
              Due
            </Label>
            <Input
              id="proj-due"
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="proj-desc" className="text-xs">
            Description
          </Label>
          <Textarea
            id="proj-desc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full rounded-full">
          {busy ? "Creating…" : "Create project"}
        </Button>
      </form>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client, project, service…"
            className="h-9 max-w-xs"
          />
          <MiniSelect
            ariaLabel="Filter by status"
            value={status}
            onChange={setStatus}
            placeholder="All statuses"
            options={PROJECT_STATUSES.map((s) => ({ value: s, label: label(s) }))}
          />
          <MiniSelect
            ariaLabel="Filter by staff"
            value={assignee}
            onChange={setAssignee}
            placeholder="All staff"
            options={staffOptions}
          />
        </div>

        {rows.length === 0 ? (
          <EmptyState>No projects match this view.</EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {rows.map((p) => (
              <AdminCard key={p.id} className="space-y-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{p.name}</p>
                  <StatPill>{label(p.status)}</StatPill>
                </div>
                <p className="text-xs text-muted-foreground">
                  {p.customers?.business_name || p.customers?.name || "No client linked"}
                  {p.service_type ? ` · ${p.service_type}` : ""}
                </p>
                {p.description && <p className="text-muted-foreground">{p.description}</p>}
                <p className="text-xs text-muted-foreground">
                  Start {formatDate(p.start_date)} · Due {formatDate(p.due_date)}
                  {p.completed_date ? ` · Completed ${formatDate(p.completed_date)}` : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  <MiniSelect
                    ariaLabel="Project status"
                    value={p.status}
                    onChange={(v) =>
                      patch(
                        p.id,
                        {
                          status: v as ProjectStatus,
                          completed_date:
                            v === "completed"
                              ? (p.completed_date ?? new Date().toISOString().slice(0, 10))
                              : null,
                        },
                        "Project updated.",
                      )
                    }
                    options={PROJECT_STATUSES.map((s) => ({ value: s, label: label(s) }))}
                  />
                  <MiniSelect
                    ariaLabel="Assigned staff"
                    value={p.assigned_to ?? ""}
                    onChange={(v) => patch(p.id, { assigned_to: v || null }, "Assignment updated.")}
                    placeholder="Unassigned"
                    options={staffOptions}
                  />
                </div>
              </AdminCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
