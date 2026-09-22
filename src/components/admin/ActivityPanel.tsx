import { useQuery } from "@tanstack/react-query";

import { AdminCard, EmptyState } from "@/components/admin/ui";
import { activityQuery, label } from "@/lib/crm";

export function ActivityPanel() {
  const { data = [], isLoading } = useQuery(activityQuery);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading activity…</p>;
  if (data.length === 0) return <EmptyState>No administrative actions recorded yet.</EmptyState>;

  return (
    <AdminCard>
      <ul className="divide-y divide-border text-sm">
        {data.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
            <span className="font-medium">{label(a.action)}</span>
            <span className="text-muted-foreground">{a.detail ?? a.entity_type}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(a.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}
