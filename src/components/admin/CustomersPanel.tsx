import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminCard, EmptyState } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { contactLeadsQuery, customersQuery, formatDate, projectsQuery, quoteRequestsQuery } from "@/lib/crm";

const emptyForm = { name: "", business_name: "", email: "", phone: "", notes: "" };

export function CustomersPanel() {
  const qc = useQueryClient();
  const { data = [], isLoading, error } = useQuery(customersQuery);
  const { data: leads = [] } = useQuery(contactLeadsQuery);
  const { data: quotes = [] } = useQuery(quoteRequestsQuery);
  const { data: projects = [] } = useQuery(projectsQuery);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((c) =>
      [c.name, c.business_name, c.email, c.phone].filter(Boolean).join(" ").toLowerCase().includes(q),
    );
  }, [data, search]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Add a customer name.");
      return;
    }
    setBusy(true);
    const { error: insertError } = await supabase.from("customers").insert({
      name: form.name.trim(),
      business_name: form.business_name.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      notes: form.notes.trim() || null,
    });
    setBusy(false);
    if (insertError) {
      toast.error(
        insertError.code === "23505"
          ? "A customer with those contact details already exists."
          : insertError.message,
      );
      return;
    }
    toast.success("Customer saved.");
    setForm(emptyForm);
    await qc.invalidateQueries({ queryKey: ["admin", "customers"] });
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading customers…</p>;
  if (error) return <EmptyState>You need a staff account to view customers.</EmptyState>;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form onSubmit={create} className="space-y-3 rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">New customer</p>
        {(
          [
            ["name", "Name"],
            ["business_name", "Business"],
            ["email", "Email"],
            ["phone", "Phone / WhatsApp"],
          ] as const
        ).map(([key, labelText]) => (
          <div key={key} className="space-y-1">
            <Label htmlFor={`cust-${key}`} className="text-xs">
              {labelText}
            </Label>
            <Input
              id={`cust-${key}`}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <div className="space-y-1">
          <Label htmlFor="cust-notes" className="text-xs">
            Notes
          </Label>
          <Textarea
            id="cust-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full rounded-full">
          {busy ? "Saving…" : "Add customer"}
        </Button>
      </form>

      <div className="space-y-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="h-9 max-w-xs"
        />
        {rows.length === 0 ? (
          <EmptyState>No customers yet.</EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {rows.map((c) => {
              const cEnquiries = leads.filter((l) => l.customer_id === c.id).length;
              const cQuotes = quotes.filter((q) => q.customer_id === c.id).length;
              const cProjects = projects.filter((p) => p.customer_id === c.id).length;
              return (
                <AdminCard key={c.id} className="space-y-1 text-sm">
                  <p className="font-semibold">{c.name}</p>
                  {c.business_name && (
                    <p className="text-xs text-muted-foreground">{c.business_name}</p>
                  )}
                  <p className="text-muted-foreground">
                    {[c.phone, c.email].filter(Boolean).join(" · ") || "No contact details"}
                  </p>
                  {c.notes && <p className="text-muted-foreground">{c.notes}</p>}
                  <p className="text-xs text-muted-foreground">
                    {cEnquiries} enquiries · {cQuotes} quotes · {cProjects} projects · added{" "}
                    {formatDate(c.created_at)}
                  </p>
                </AdminCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
