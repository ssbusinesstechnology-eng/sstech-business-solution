import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminCard, EmptyState, MiniSelect, StatPill } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  contactLeadsQuery,
  CRM_STATUSES,
  formatDate,
  label,
  money,
  quoteRequestsQuery,
  staffQuery,
  type CrmStatus,
  type StaffProfile,
} from "@/lib/crm";

type Table = "contact_leads" | "quote_requests";

type BaseRow = {
  id: string;
  name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  status: CrmStatus;
  assigned_to: string | null;
  internal_notes: string | null;
  customer_id: string | null;
  created_at: string;
};

function staffOptions(staff: StaffProfile[]) {
  return staff.map((s) => ({
    value: s.user_id,
    label: s.display_name || s.email || "Staff member",
  }));
}

function useRowActions(table: Table) {
  const qc = useQueryClient();

  async function patch(id: string, values: PatchValues, message: string) {
    const query =
      table === "contact_leads"
        ? supabase.from("contact_leads").update(values)
        : supabase.from("quote_requests").update(values);
    const { error } = await query.eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(message);
    await qc.invalidateQueries({ queryKey: ["admin"] });
  }

  /** Creates a customer record, re-using an existing one when the details match. */
  async function saveAsCustomer(row: BaseRow) {
    let existingId: string | null = null;
    if (row.email) {
      const { data } = await supabase
        .from("customers")
        .select("id")
        .ilike("email", row.email)
        .maybeSingle();
      existingId = data?.id ?? null;
    }
    if (!existingId && row.phone) {
      const { data } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", row.phone)
        .maybeSingle();
      existingId = data?.id ?? null;
    }
    if (!existingId) {
      const { data, error } = await supabase
        .from("customers")
        .insert({
          name: row.name,
          business_name: row.business_name,
          email: row.email,
          phone: row.phone,
        })
        .select("id")
        .single();
      if (error) {
        toast.error(error.message);
        return;
      }
      existingId = data.id;
    }
    await patch(row.id, { customer_id: existingId }, "Linked to a customer record.");
  }

  return { patch, saveAsCustomer };
}

function Filters({
  search,
  setSearch,
  status,
  setStatus,
}: {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, business, service…"
        className="h-9 max-w-xs"
      />
      <MiniSelect
        ariaLabel="Filter by status"
        value={status}
        onChange={setStatus}
        placeholder="All statuses"
        options={CRM_STATUSES.map((s) => ({ value: s, label: label(s) }))}
      />
    </div>
  );
}

function NotesBox({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (v: string) => Promise<void> | void;
}) {
  const [text, setText] = useState(value ?? "");
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-left text-xs text-accent underline-offset-2 hover:underline"
      >
        {value ? `Notes: ${value}` : "Add internal note"}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <Textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex gap-2">
        <Button
          size="sm"
          className="rounded-full"
          onClick={async () => {
            await onSave(text);
            setOpen(false);
          }}
        >
          Save note
        </Button>
        <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function RowShell({
  row,
  table,
  staff,
  children,
}: {
  row: BaseRow;
  table: Table;
  staff: StaffProfile[];
  children?: React.ReactNode;
}) {
  const { patch, saveAsCustomer } = useRowActions(table);

  return (
    <AdminCard className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold">{row.name}</p>
          {row.business_name && <p className="text-xs text-muted-foreground">{row.business_name}</p>}
        </div>
        <div className="flex items-center gap-2">
          <StatPill>{label(row.status)}</StatPill>
          <span className="text-xs text-muted-foreground">{formatDate(row.created_at)}</span>
        </div>
      </div>

      <p className="text-muted-foreground">
        {[row.phone, row.email].filter(Boolean).join(" · ") || "No contact details given"}
      </p>

      {children}

      <div className="flex flex-wrap items-center gap-2">
        <MiniSelect
          ariaLabel="Status"
          value={row.status}
          onChange={(v) => patch(row.id, { status: v }, "Status updated.")}
          options={CRM_STATUSES.map((s) => ({ value: s, label: label(s) }))}
        />
        <MiniSelect
          ariaLabel="Assigned staff"
          value={row.assigned_to ?? ""}
          onChange={(v) => patch(row.id, { assigned_to: v || null }, "Assignment updated.")}
          placeholder="Unassigned"
          options={staffOptions(staff)}
        />
        {row.customer_id ? (
          <span className="text-xs text-muted-foreground">Customer record linked</span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => saveAsCustomer(row)}
          >
            Save as customer
          </Button>
        )}
      </div>

      <NotesBox
        value={row.internal_notes}
        onSave={(v) => patch(row.id, { internal_notes: v || null }, "Note saved.")}
      />
    </AdminCard>
  );
}

function useFiltered<T extends BaseRow>(rows: T[], search: string, status: string, extra?: (r: T) => string) {
  return useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (!q) return true;
      const haystack = [r.name, r.business_name, r.email, r.phone, extra?.(r)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, search, status, extra]);
}

export function EnquiriesPanel() {
  const { data = [], isLoading, error } = useQuery(contactLeadsQuery);
  const { data: staff = [] } = useQuery(staffQuery);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const rows = useFiltered(data as BaseRow[] & typeof data, search, status, (r) => r.service ?? "");

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading enquiries…</p>;
  if (error) return <EmptyState>You need a staff account to view enquiries.</EmptyState>;

  return (
    <div className="space-y-4">
      <Filters search={search} setSearch={setSearch} status={status} setStatus={setStatus} />
      {rows.length === 0 ? (
        <EmptyState>No enquiries match this view.</EmptyState>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((lead) => (
            <RowShell key={lead.id} row={lead} table="contact_leads" staff={staff}>
              {lead.service && <p className="text-muted-foreground">Service: {lead.service}</p>}
              {lead.message && <p className="text-muted-foreground">{lead.message}</p>}
            </RowShell>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuotesPanel() {
  const { data = [], isLoading, error } = useQuery(quoteRequestsQuery);
  const { data: staff = [] } = useQuery(staffQuery);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const rows = useFiltered(
    data as BaseRow[] & typeof data,
    search,
    status,
    (r) => r.package_name ?? "",
  );

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading quotes…</p>;
  if (error) return <EmptyState>You need a staff account to view quotes.</EmptyState>;

  return (
    <div className="space-y-4">
      <Filters search={search} setSearch={setSearch} status={status} setStatus={setStatus} />
      {rows.length === 0 ? (
        <EmptyState>No quote requests match this view.</EmptyState>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((quote) => {
            const addons = Array.isArray(quote.addons)
              ? (quote.addons as { label?: string; qty?: number }[])
              : [];
            return (
              <RowShell key={quote.id} row={quote} table="quote_requests" staff={staff}>
                <p className="font-medium">
                  {quote.package_name} — {money(quote.currency, quote.estimated_total)}
                  {Number(quote.recurring_total) > 0
                    ? ` + ${money(quote.currency, quote.recurring_total)} / month`
                    : ""}
                </p>
                {addons.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add-ons:{" "}
                    {addons
                      .map((a) => `${a.label ?? ""}${a.qty && a.qty > 1 ? ` ×${a.qty}` : ""}`)
                      .join(", ")}
                  </p>
                )}
                {quote.requirements && (
                  <p className="text-muted-foreground">{quote.requirements}</p>
                )}
              </RowShell>
            );
          })}
        </div>
      )}
    </div>
  );
}
