import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ActivityPanel } from "@/components/admin/ActivityPanel";
import { CustomersPanel } from "@/components/admin/CustomersPanel";
import { DashboardPanel } from "@/components/admin/DashboardPanel";
import { EnquiriesPanel, QuotesPanel } from "@/components/admin/LeadsPanels";
import { PortfolioPanel } from "@/components/admin/PortfolioPanel";
import { ProjectsPanel } from "@/components/admin/ProjectsPanel";
import { ServicesPanel } from "@/components/admin/ServicesPanel";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { claimAdmin } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Business dashboard — S&S Business Solutions" },
      { name: "description", content: "Private S&S workspace for enquiries, quotes, customers, projects and portfolio." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "enquiries", label: "Enquiries" },
  { id: "quotes", label: "Quotes" },
  { id: "customers", label: "Customers" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "activity", label: "Activity" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AdminPage() {
  const [session, setSession] = useState<{ user: { id: string; email?: string } } | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<TabId>("dashboard");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Keep a staff directory entry so leads, quotes and projects can be assigned.
  useEffect(() => {
    if (!session?.user) return;
    supabase
      .from("staff_profiles")
      .upsert(
        {
          user_id: session.user.id,
          email: session.user.email ?? null,
          display_name: session.user.email?.split("@")[0] ?? null,
        },
        { onConflict: "user_id" },
      )
      .then(() => undefined);
  }, [session]);

  if (!ready) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-24 text-sm text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (!session) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-24">
          <h1 className="mb-6 font-display text-3xl">S&amp;S team sign in</h1>
          <SignIn />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl">S&amp;S Business Operations</h1>
            <p className="text-xs text-muted-foreground">
              Signed in as {session.user.email ?? "staff member"}
            </p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => supabase.auth.signOut()}>
            Sign out
          </Button>
        </div>

        <nav className="mb-6 flex flex-wrap gap-2 border-b border-border pb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                tab === t.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "dashboard" && <DashboardPanel />}
        {tab === "enquiries" && <EnquiriesPanel />}
        {tab === "quotes" && <QuotesPanel />}
        {tab === "customers" && <CustomersPanel />}
        {tab === "projects" && <ProjectsPanel />}
        {tab === "services" && <ServicesPanel />}
        {tab === "portfolio" && <PortfolioPanel />}
        {tab === "activity" && <ActivityPanel />}
      </div>
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
    if (mode === "up") {
      toast.success("Account created — check your email if confirmation is required.");
    }
    try {
      await claimAdmin();
    } catch {
      // first-user promotion is best-effort; existing admins keep their role
    }
  }

  return (
    <div className="space-y-4 rounded-2xl surface-card p-6">
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
        <Button disabled={busy} variant="outline" onClick={() => run("up")} className="rounded-full">
          Create account
        </Button>
      </div>
    </div>
  );
}
