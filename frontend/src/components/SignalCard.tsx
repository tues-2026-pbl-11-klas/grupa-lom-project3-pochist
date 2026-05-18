import DataIcon from "./DataIcon.tsx";
import type { T, Lang } from "../i18n.ts";
import { translateReport } from "../i18n.ts";
import "../styles/SignalCard.css";

interface Report {
  id: string | number;
  title: string;
  location: string;
  severity: string;
  status: string;
  img: string;
  time: string;
  points: number;
}

interface SignalCardProps {
  report: Report;
  isSelected: boolean;
  onClick: () => void;
  i: T;
  lang: Lang;
}

const SEV_COLORS: Record<string, string> = {
  critical: "#f43f5e",
  high: "#fb923c",
  medium: "#f59e0b",
  low: "#34d399",
};

export default function SignalCard({ report, isSelected, onClick, lang }: SignalCardProps) {
  const sevColor = SEV_COLORS[report.severity] ?? "#888";
  const tr = translateReport(lang, report);

  return (
    <button
      onClick={onClick}
      className={`signal-card ${isSelected ? "signal-card--selected" : ""}`}
    >
      <div className="signal-card__accent" style={{ backgroundColor: sevColor }} />

      <div className="signal-card__body">
        <div className="signal-card__icon"><DataIcon name={report.img} size={16} /></div>
        <h4 className="signal-card__title">{tr.title}</h4>
      </div>
    </button>
  );
}
