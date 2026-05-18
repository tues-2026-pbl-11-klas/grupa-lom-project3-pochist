import type { T } from "../i18n.ts";
import "../styles/FilterChips.css";

interface FilterChipsProps {
  active: string;
  onChange: (id: string) => void;
  i: T;
}

export default function FilterChips({ active, onChange, i }: FilterChipsProps) {
  const filters = [
    { id: "all", label: i.filterAll, dot: "#FFFFFF" },
    { id: "critical", label: i.filterCritical, dot: "#EF4444" },
    { id: "high", label: i.filterSerious, dot: "#F97316" },
    { id: "open", label: i.filterOpen, dot: "#60A5FA" },
    { id: "done", label: i.filterDone, dot: "#22C55E" },
  ];

  return (
    <div className="filter-chips">
      {filters.map((f) => {
        const isActive = active === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`filter-chip ${isActive ? "filter-chip--active" : ""}`}
          >
            <span
              className="filter-chip__dot"
              style={{
                backgroundColor: f.dot,
                boxShadow: isActive ? `0 0 8px ${f.dot}` : "none",
              }}
            />
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
