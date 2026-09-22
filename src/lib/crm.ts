import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export const CRM_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "in_discussion",
  "won",
  "lost",
] as const;
export type CrmStatus = (typeof CRM_STATUSES)[number];

export const PROJECT_STATUSES = [
  "planning",
  "in_progress",
  "review",
  "completed",
  "on_hold",
  "cancelled",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Categories that match the S&S business model. New ones can still be typed in. */
export const SERVICE_CATEGORIES = [
  "Digital & Web Solutions",
  "Branding & Online Presence",
  "Business Technology",
  "Digital Marketing & Growth",
  "Professional & Corporate Solutions",
] as const;

export const OPEN_STATUSES: CrmStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "in_discussion",
];

export const label = (value: string) =>
  value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const money = (currency: string, amount: number | string) =>
  `${currency} ${Number(amount).toLocaleString()}`;

/* ---------------------------------------------------------------- queries */

export const staffQuery = queryOptions({
  queryKey: ["admin", "staff_profiles"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("staff_profiles")
      .select("user_id, display_name, email")
      .order("display_name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const contactLeadsQuery = queryOptions({
  queryKey: ["admin", "contact_leads"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("contact_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const quoteRequestsQuery = queryOptions({
  queryKey: ["admin", "quote_requests"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const customersQuery = queryOptions({
  queryKey: ["admin", "customers"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const projectsQuery = queryOptions({
  queryKey: ["admin", "projects"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*, customers(name, business_name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const servicesQuery = queryOptions({
  queryKey: ["admin", "services"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const activityQuery = queryOptions({
  queryKey: ["admin", "activity_log"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data ?? [];
  },
});

export type ContactLead = Awaited<ReturnType<typeof contactLeadsQuery.queryFn>>[number];
export type QuoteRequest = Awaited<ReturnType<typeof quoteRequestsQuery.queryFn>>[number];
export type Customer = Awaited<ReturnType<typeof customersQuery.queryFn>>[number];
export type Project = Awaited<ReturnType<typeof projectsQuery.queryFn>>[number];
export type ServiceRow = Awaited<ReturnType<typeof servicesQuery.queryFn>>[number];
export type StaffProfile = Awaited<ReturnType<typeof staffQuery.queryFn>>[number];
