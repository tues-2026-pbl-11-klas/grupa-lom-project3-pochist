import { MapPin, Bot, Check, CheckCircle, Users } from "lucide-react";
import DataIcon from "./DataIcon.tsx";
import "../styles/ReportCard.css";
import { SEVERITY_META, STATUS_META } from "../data/constants.ts";
import { useApp } from "../context/AppContext.tsx";
import { t, translateReport } from "../i18n.ts";
import type { Lang } from "../i18n.ts";

interface ReportData {
  id: string | number;
  title: string;
  location: string;
  description?: string;
  severity: string;
  status: string;
  img: string;
  points: number;
  reporter: string;
  reporterAvatar: string;
  time: string;
  volunteers: number;
  district?: string;
  aiVerified?: boolean;
  claimedBy?: string;
}

interface ReportCardProps {
  report: ReportData;
  expanded?: boolean;
  onClick?: () => void;
  lang?: Lang;
}

export default function ReportCard({ report, expanded = false, onClick, lang = "bg" }: ReportCardProps) {
  const { claimReport, completeReport, user } = useApp();
  const i = t(lang);
  const meta = SEVERITY_META[report.severity as keyof typeof SEVERITY_META] ?? SEVERITY_META.medium;
  const sMeta = STATUS_META[report.status as keyof typeof STATUS_META] ?? STATUS_META.open;
  const isOwn = report.claimedBy === user.name;
  const tr = translateReport(lang, report);

  const sevLabel: Record<string, string> = {
    critical: i.sevCritical,
    high: i.sevHigh,
    medium: i.sevMedium,
    low: i.sevLow,
  };
  const statLabel: Record<string, string> = {
    open: i.statusOpen,
    "in-progress": i.statusInProgress,
    done: i.statusDone,
  };

  return (
    <article
      className={`card report-card ${onClick ? "report-card--clickable" : ""}`}
      style={{ borderColor: `${meta.color}33` }}
      onClick={onClick}
    >
      <div
        className="report-card__strip"
        style={{
          background: `linear-gradient(180deg,${meta.color},${meta.color}44)`,
        }}
      />
      {report.aiVerified && (
        <div className="report-card__ai-badge"><Bot size={12} strokeWidth={2} /> AI <Check size={10} strokeWidth={3} /></div>
      )}

      <div className="report-card__top">
        <div
          className="report-card__icon-box"
          style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
        >
          <DataIcon name={report.img} size={18} />
        </div>
        <div className="report-card__info">
          <div
            className="report-card__title"
            style={{ paddingRight: report.aiVerified ? 68 : 0 }}
          >
            {tr.title}
          </div>
          <div className="report-card__loc">
            <span><MapPin size={12} strokeWidth={2} /></span>
            <span>{tr.location}</span>
          </div>
        </div>
      </div>

      {expanded && tr.description && (
        <p className="report-card__desc">{tr.description}</p>
      )}

      <div className="report-card__bottom">
        <div className="report-card__tags">
          <div className="report-card__status">
            <div
              className="report-card__status-dot"
              style={{
                background: sMeta.color,
                boxShadow: `0 0 6px ${sMeta.color}`,
              }}
            />
            <span
              className="report-card__status-label"
              style={{ color: sMeta.color }}
            >
              {statLabel[report.status] ?? sMeta.label}
            </span>
          </div>
          <span
            className="tag"
            style={{
              background: meta.bg,
              color: meta.color,
              border: `1px solid ${meta.border}`,
            }}
          >
            {sevLabel[report.severity] ?? meta.label}
          </span>
          <span className="report-card__time">· {report.time}</span>
        </div>
        <div className="report-card__actions">
          <span className="report-card__pts">+{report.points}</span>
          {report.status === "open" && (
            <button
              className="btn-primary report-card__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                claimReport(report.id);
              }}
            >
              {i.claimTask}
            </button>
          )}
          {report.status === "in-progress" && isOwn && (
            <button
              className="btn-primary report-card__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                completeReport(report.id);
              }}
            >
              {i.completeTask}
            </button>
          )}
          {report.status === "done" && (
            <span className="report-card__done-label"><CheckCircle size={12} strokeWidth={2} /> {i.completed}</span>
          )}
        </div>
      </div>

      <div className="report-card__footer">
        <span>{report.reporterAvatar}</span>
        <span>{report.reporter}</span>
        {report.district && (
          <>
            <span className="report-card__footer-sep">·</span>
            <span>{report.district}</span>
          </>
        )}
        {report.volunteers > 0 && (
          <>
            <span className="report-card__footer-sep">·</span>
            <span><Users size={12} strokeWidth={2} /> {report.volunteers}</span>
          </>
        )}
      </div>
    </article>
  );
}
