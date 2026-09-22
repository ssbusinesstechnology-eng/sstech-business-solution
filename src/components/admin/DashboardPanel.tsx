import { useQuery } from "@tanstack/react-query";

import { AdminCard } from "@/components/admin/ui";
import {
  activityQuery,
  contactLeadsQuery,
  customersQuery,
  label,
  OPEN_STATUSES,
  projectsQuery,
  quoteRequestsQuery,
} from "@/lib/crm";
import { adminPortfolioQuery } from "@/lib/portfolio";

function Stat({ title, value, hint }: { title: string; value: number; hint?: string }) {
  return (
    <AdminCard>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-1 text-3xl font-semibold text-accent">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </AdminCard>
  );
}

export function DashboardPanel() {
  const leads = useQuery(contactLeadsQuery);
  const quotes = useQuery(quoteRequestsQuery);
  const projects = useQuery(projectsQuery);
  const customers = useQuery(customersQuery);
  const portfolio = useQuery(adminPortfolioQuery);
  const activity = useQuery(activityQuery);

  const leadRows = leads.data ?? [];
  const quoteRows = quotes.data ?? [];
  const projectRows = projects.data ?? [];

  const newEnquiries = leadRows.filter((l) => l.status === "new").length;
  const newQuotes = quoteRows.filter((q) => q.status === "new").length;
  const active =
    leadRows.filter((l) => OPEN_STATUSES.includes(l.status)).length +
    quoteRows.filter((q) => OPEN_STATUSES.includes(q.status)).length;
  const inProgress = projectRows.filter((p) =>
    ["planning", "in_progress", "review"].includes(p.status),
  ).length;
  const completed = projectRows.filter((p) => p.status === "completed").length;
  const published = (portfolio.data ?? []).filter((p) => p.published).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat title="New enquiries" value={newEnquiries} hint={`${leadRows.length} in total`} />
        <Stat title="New quote requests" value={newQuotes} hint={`${quoteRows.length} in total`} />
        <Stat title="Active leads" value={active} hint="Not yet won or lost" />
        <Stat title="Projects in progress" value={inProgress} />
        <Stat title="Completed projects" value={completed} />
        <Stat title="Published portfolio work" value={published} />
      </div>

      <AdminCard>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Customers on record</p>
        <p className="mt-1 text-2xl font-semibold">{(customers.data ?? []).length}</p>
      </AdminCard>

      <AdminCard>
        <p className="mb-3 text-sm font-semibold">Recent activity</p>
        {(activity.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing recorded yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {(activity.data ?? []).slice(0, 8).map((a) => (
              <li key={a.id} className="flex flex-wrap justify-between gap-2">
                <span>
                  {label(a.action)}
                  {a.detail ? ` — ${a.detail}` : ""}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(a.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
