import { ApiClient } from "@sheepparter/api-client";
import { AppShell, Button, MetricCard, StatusPill } from "@sheepparter/ui";
import { useEffect, useMemo, useState } from "react";

const reviewRows = [
  { id: "USR-1024", type: "Profile", risk: "Low" },
  { id: "USR-1088", type: "Match", risk: "Medium" },
  { id: "USR-1132", type: "Report", risk: "High" }
];

export function App() {
  const api = useMemo(() => new ApiClient(import.meta.env.VITE_API_BASE_URL), []);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    api
      .health()
      .then((health) => setApiStatus(health.status))
      .catch(() => setApiStatus("offline"));
  }, [api]);

  return (
    <AppShell
      eyebrow="Admin Console"
      title="Operations"
      description="Review queues, service status, and moderation signals in one dense view."
      aside={<StatusPill label="API" value={apiStatus} tone={apiStatus === "ok" ? "good" : "warn"} />}
    >
      <section className="admin-layout">
        <aside className="admin-nav" aria-label="Admin navigation">
          <a href="#">Overview</a>
          <a href="#">Users</a>
          <a href="#">Reviews</a>
          <a href="#">Settings</a>
        </aside>

        <div className="admin-main">
          <div className="metrics-grid" aria-label="Admin metrics">
            <MetricCard label="Open reviews" value="27" detail="6 urgent" />
            <MetricCard label="Active users" value="1.8k" detail="+4.2%" />
            <MetricCard label="SLA" value="96%" detail="last 24h" />
          </div>

          <section className="review-panel" aria-label="Review queue">
            <div className="panel-head">
              <div>
                <p className="section-kicker">Review queue</p>
                <h2>Items needing operator attention</h2>
              </div>
              <Button>Export</Button>
            </div>
            <div className="review-table">
              {reviewRows.map((row) => (
                <div className="review-row" key={row.id}>
                  <strong>{row.id}</strong>
                  <span>{row.type}</span>
                  <StatusPill label="Risk" value={row.risk} tone={row.risk === "High" ? "warn" : "neutral"} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
