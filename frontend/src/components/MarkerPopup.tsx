import { MapPin, CheckCircle } from "lucide-react";
import DataIcon from "./DataIcon.tsx";
import type { T, Lang } from "../i18n.ts";
import { translateReport } from "../i18n.ts";
import "../styles/MarkerPopup.css";

interface Report {
  id: string | number;
  title: string;
  location: string;
  description: string;
  severity: string;
  status: string;
  img: string;
  points: number;
  reporter: string;
  reporterAvatar: string;
  time: string;
  volunteers: number;
}

interface MarkerPopupProps {
  report: Report;
  onClaim: (id: string | number) => void;
  onComplete: (id: string | number) => void;
  i: T;
  lang: Lang;
}

const SEV_COLORS: Record<string, string> = {
  critical: "#f43f5e",
  high: "#fb923c",
  medium: "#f59e0b",
  low: "#34d399",
};

const STATUS_COLORS: Record<string, string> = {
  open: "#60a5fa",
  "in-progress": "#f59e0b",
  done: "#34d399",
};

export default function MarkerPopup({ report, onClaim, onComplete, i, lang }: MarkerPopupProps) {
  const sevColor = SEV_COLORS[report.severity] ?? "#888";
  const statColor = STATUS_COLORS[report.status] ?? "#888";
  const tr = translateReport(lang, report);

  const sevLabels: Record<string, string> = {
    critical: i.sevCritical,
    high: i.sevHigh,
    medium: i.sevMedium,
    low: i.sevLow,
  };
  const statLabels: Record<string, string> = {
    open: i.statusOpen,
    "in-progress": i.statusInProgress,
    done: i.statusDone,
  };

  return (
    <div className="marker-popup">
      <div className="marker-popup__accent" />

      <div className="marker-popup__body">
        <div className="marker-popup__header">
          <div className="marker-popup__icon"><DataIcon name={report.img} size={20} /></div>
          <div className="marker-popup__info">
            <h3 className="marker-popup__title">{tr.title}</h3>
            <p className="marker-popup__location"><MapPin size={11} strokeWidth={2} /> {tr.location}</p>
          </div>
        </div>

        <p className="marker-popup__desc">{tr.description}</p>

        <div className="marker-popup__tags">
          <span
            className="marker-popup__tag"
            style={{
              color: sevColor,
              backgroundColor: sevColor + "18",
            }}
          >
            {sevLabels[report.severity] ?? report.severity}
          </span>
          <span
            className="marker-popup__tag"
            style={{
              color: statColor,
              backgroundColor: statColor + "18",
            }}
          >
            {statLabels[report.status] ?? report.status}
          </span>
          <span className="marker-popup__pts">+{report.points} pts</span>
        </div>

        <div className="marker-popup__reporter">
          <span className="marker-popup__reporter-avatar">{report.reporterAvatar}</span>
          <span className="marker-popup__reporter-name">{report.reporter}</span>
          <span className="marker-popup__reporter-time">{report.time}</span>
        </div>

        {report.status === "open" && (
          <button
            onClick={() => onClaim(report.id)}
            className="marker-popup__action-btn marker-popup__action-btn--claim"
          >
            {i.claimTask}
          </button>
        )}
        {report.status === "in-progress" && (
          <button
            onClick={() => onComplete(report.id)}
            className="marker-popup__action-btn marker-popup__action-btn--complete"
          >
            {i.completeTask}
          </button>
        )}
        {report.status === "done" && (
          <div className="marker-popup__done-label"><CheckCircle size={12} strokeWidth={2} /> {i.completed}</div>
        )}
      </div>
    </div>
  );
}
