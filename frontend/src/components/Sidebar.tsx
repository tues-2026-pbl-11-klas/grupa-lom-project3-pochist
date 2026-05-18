import { Flame } from "lucide-react";
import FilterChips from "./FilterChips.tsx";
import SignalCard from "./SignalCard.tsx";
import type { T, Lang } from "../i18n.ts";
import { useApp } from "../context/AppContext.tsx";
import "../styles/MapSidebar.css";

interface Report {
  id: string | number;
  title: string;
  location: string;
  severity: string;
  status: string;
  img: string;
  time: string;
  points: number;
  [key: string]: unknown;
}

interface SidebarProps {
  reports: Report[];
  allReports: Report[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedId: string | number | null;
  onSelectReport: (id: string | number) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  i: T;
  lang: Lang;
}

export default function Sidebar({
  reports,
  allReports,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedId,
  onSelectReport,
  mobileOpen,
  onMobileClose,
  i,
  lang,
}: SidebarProps) {
  const { user } = useApp();
  const totalSignals = allReports.length;

  const legend = [
    { label: i.legendCritical, color: "#EF4444" },
    { label: i.legendSerious, color: "#F97316" },
    { label: i.legendMedium, color: "#EAB308" },
    { label: i.legendLowDone, color: "#22C55E" },
  ];

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={onMobileClose} />
      )}

      <aside className={`sidebar ${!mobileOpen ? "sidebar--hidden" : ""}`}>
        <div className="sidebar__stats">
          <div className="sidebar__stats-left">
            <div className="sidebar__stats-row">
              <span className="sidebar__stats-count">
                {totalSignals.toLocaleString()}
              </span>
              <span className="sidebar__stats-label">{i.signals}</span>
            </div>
          </div>
          <div className="sidebar__streak">
            <span className="sidebar__streak-icon"><Flame size={16} strokeWidth={2} /></span>
            <span className="sidebar__streak-val">
              {user.streak} {i.days}
            </span>
          </div>
        </div>

        <div className="sidebar__search">
          <div className="sidebar__search-wrap">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={i.searchPlaceholder}
              className="sidebar__search-input"
            />
          </div>
        </div>

        <div className="sidebar__filters">
          <div className="sidebar__section-label">{i.filterLabel}</div>
          <FilterChips active={activeFilter} onChange={onFilterChange} i={i} />
        </div>

        <div className="sidebar__legend">
          <div className="sidebar__section-label">{i.legendLabel}</div>
          <div className="sidebar__legend-items">
            {legend.map((item) => (
              <div key={item.label} className="sidebar__legend-item">
                <span
                  className="sidebar__legend-dot"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}70`,
                  }}
                />
                <span className="sidebar__legend-text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar__cards">
          <div className="sidebar__cards-header">
            {i.recentSignals} ({reports.length})
          </div>
          {reports.map((report) => (
            <SignalCard
              key={report.id}
              report={report}
              isSelected={selectedId === report.id}
              onClick={() => onSelectReport(report.id)}
              i={i}
              lang={lang}
            />
          ))}
          {reports.length === 0 && (
            <div className="sidebar__empty">{i.noResults}</div>
          )}
        </div>

      </aside>
    </>
  );
}
