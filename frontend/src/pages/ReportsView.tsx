import { useState, useMemo } from "react";
import { AlertCircle, Leaf, Search } from "lucide-react";
import "../styles/ReportsView.css";
import { useApp } from "../context/AppContext.tsx";
import ReportCard from "../components/ReportCard.tsx";
import { t } from "../i18n.ts";
import type { Lang } from "../i18n.ts";

interface ReportsViewProps {
  onNewReport: () => void;
  lang: Lang;
}

export default function ReportsView({ onNewReport, lang }: ReportsViewProps) {
  const i = t(lang);
  const { reports } = useApp();
  const [search, setSearch] = useState("");
  const [activeFilter, setFilter] = useState("all");
  const [expandedId, setExpanded] = useState<number | null>(null);

  const FILTERS = [
    { id: "all", label: i.reportsFilterAll },
    { id: "open", label: i.reportsFilterOpen },
    { id: "in-progress", label: i.reportsFilterInProgress },
    { id: "done", label: i.reportsFilterDone },
    { id: "critical", label: i.reportsFilterCritical },
    { id: "high", label: i.reportsFilterHigh },
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reports.filter((r: any) => {
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.reporter.toLowerCase().includes(q) ||
        (r.district || "").toLowerCase().includes(q);
      const matchFilter =
        activeFilter === "all" ||
        r.status === activeFilter ||
        r.severity === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [reports, search, activeFilter]);

  const openCount = reports.filter((r: any) => r.status === "open").length;
  const criticalCount = reports.filter(
    (r: any) => r.severity === "critical" && r.status === "open",
  ).length;

  return (
    <div className="reports-view">
      <div className="reports-view__header">
        <div>
          <div className="label-caps">{i.reportsActive}</div>
          <div className="reports-view__header-meta">
            <span className="reports-view__header-meta--open">
              {openCount} {i.reportsOpen}
            </span>
            {criticalCount > 0 && (
              <span className="reports-view__header-meta--critical">
                · <AlertCircle size={12} strokeWidth={2} /> {criticalCount} {i.reportsCritical}
              </span>
            )}
          </div>
        </div>
        <button
          className="btn-primary reports-view__new-btn"
          onClick={onNewReport}
        >
          {i.reportsNew}
        </button>
      </div>

      <div className="reports-view__search-wrap">
        <input
          className="input-field reports-view__search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={i.reportsSearchPlaceholder}
        />
        {search && (
          <button
            className="reports-view__search-clear"
            onClick={() => setSearch("")}
          >
            ✕
          </button>
        )}
      </div>

      <div className="reports-view__filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`reports-view__filter-pill ${
              activeFilter === f.id
                ? "reports-view__filter-pill--active"
                : "reports-view__filter-pill--inactive"
            }`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="reports-view__sort-bar">
        <span className="reports-view__count">
          <span>{filtered.length}</span> {i.reportsResults}
        </span>
        <span className="reports-view__sort-label">{i.reportsByDate}</span>
      </div>

      <div className="reports-view__list">
        {filtered.length === 0 ? (
          <div className="reports-view__empty">
            <div className="reports-view__empty-icon">
              {search ? <Search size={24} strokeWidth={1.5} /> : <Leaf size={24} strokeWidth={1.5} />}
            </div>
            <div className="reports-view__empty-text">
              {search ? `${i.reportsNoResults} „${search}"` : i.reportsNoSignals}
            </div>
            {search && (
              <button
                className="btn-ghost reports-view__empty-clear"
                onClick={() => setSearch("")}
              >
                {i.reportsClearSearch}
              </button>
            )}
          </div>
        ) : (
          filtered.map((r: any) => (
            <ReportCard
              key={r.id}
              report={r}
              expanded={expandedId === r.id}
              onClick={() => setExpanded(expandedId === r.id ? null : r.id)}
              lang={lang}
            />
          ))
        )}
      </div>
    </div>
  );
}
