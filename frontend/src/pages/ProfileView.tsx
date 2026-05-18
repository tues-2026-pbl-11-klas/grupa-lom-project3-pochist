import { useState, useCallback } from "react";
import { Star, Paintbrush, MapPin, Flame } from "lucide-react";
import DataIcon from "../components/DataIcon.tsx";
import "../styles/ProfileView.css";
import { BADGES, LEVEL_THRESHOLDS } from "../data/constants.ts";
import { useApp } from "../context/AppContext.tsx";
import { t, translateLevel } from "../i18n.ts";
import type { Lang } from "../i18n.ts";

const WEEK_DATA = [
  [2, 5, 1, 3, 6, 4, 2],
  [4, 3, 7, 2, 5, 8, 3],
  [1, 6, 3, 5, 2, 4, 7],
  [5, 3, 6, 4, 7, 2, 5],
];
const DAYS_BG = ["П", "В", "С", "Ч", "П", "С", "Н"];
const DAYS_EN = ["M", "T", "W", "T", "F", "S", "S"];
const CHART_MAX = Math.max(...WEEK_DATA.flat());

function Toggle({ label, desc, value, onToggle }: { label: string; desc: string; value: boolean; onToggle: () => void }) {
  return (
    <div className="profile__toggle-row">
      <div>
        <div className="profile__toggle-label">{label}</div>
        <div className="profile__toggle-desc">{desc}</div>
      </div>
      <button
        className={`profile__toggle-btn ${value ? "profile__toggle-btn--on" : "profile__toggle-btn--off"}`}
        onClick={onToggle}
        aria-pressed={value}
      >
        <div className={`profile__toggle-knob ${value ? "profile__toggle-knob--on" : "profile__toggle-knob--off"}`} />
      </button>
    </div>
  );
}

const STAT_ICONS = { star: Star, paintbrush: Paintbrush, "map-pin": MapPin, flame: Flame };

interface ProfileViewProps {
  lang: Lang;
}

export default function ProfileView({ lang }: ProfileViewProps) {
  const { user, logout } = useApp();
  const i = t(lang);
  const [activeTab, setTab] = useState("stats");
  const [notifs, setNotifs] = useState(() => localStorage.getItem("cw_notifs") !== "false");
  const [gps, setGps] = useState(() => localStorage.getItem("cw_gps") !== "false");
  const [emails, setEmails] = useState(() => localStorage.getItem("cw_emails") === "true");

  const toggleNotifs = useCallback(() => {
    setNotifs((v) => {
      const next = !v;
      localStorage.setItem("cw_notifs", String(next));
      if (next && "Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
      return next;
    });
  }, []);

  const toggleGps = useCallback(() => {
    setGps((v) => {
      const next = !v;
      localStorage.setItem("cw_gps", String(next));
      return next;
    });
  }, []);

  const toggleEmails = useCallback(() => {
    setEmails((v) => {
      const next = !v;
      localStorage.setItem("cw_emails", String(next));
      return next;
    });
  }, []);


  const DAYS = lang === "en" ? DAYS_EN : DAYS_BG;

  const tabs = [
    { id: "stats", label: i.profileStats },
    { id: "badges", label: i.profileBadges },
    { id: "activity", label: i.profileActivity },
    { id: "settings", label: i.profileSettings },
  ];

  const currentLevel = LEVEL_THRESHOLDS.find(
    (l: any) => user.points >= l.min && user.points <= l.max,
  );
  const nextLevel = LEVEL_THRESHOLDS.find((l: any) => l.min > user.points);
  const xpPct = nextLevel ? Math.min((user.points / nextLevel.min) * 100, 100) : 100;

  return (
    <div className="profile">
      <div className="profile__hero-glow" />

      {/* Avatar + info */}
      <div className="profile__hero-layout">
        <div className="profile__avatar">{user.avatar}</div>
        <div className="profile__hero-info">
          <div className="profile__name">
            {user.name}
            {user.verified && <span className="profile__verified">VERIFIED</span>}
          </div>
          <div className="profile__level-badge">
            {currentLevel && <DataIcon name={currentLevel.icon} size={14} />} {currentLevel ? translateLevel(lang, currentLevel.level) : ""}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`profile__tab ${activeTab === tab.id ? "profile__tab--active" : "profile__tab--inactive"}`}
            onClick={() => setTab(tab.id)}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* XP bar */}
      <div className="profile__xp">
        <div className="profile__xp-header">
          <span className="profile__xp-label">{i.profileTowards} {nextLevel ? translateLevel(lang, nextLevel.level) : "MAX"}</span>
          <span className="profile__xp-val">
            {user.points.toLocaleString()} / {nextLevel?.min?.toLocaleString() || "∞"}
          </span>
        </div>
        <div className="profile__xp-track">
          <div className="profile__xp-fill" style={{ width: `${xpPct}%` }} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="profile__stats">
        {[
          { icon: "star", val: user.points.toLocaleString(), label: i.profilePoints },
          { icon: "paintbrush", val: user.cleanings, label: i.profileCleanings },
          { icon: "map-pin", val: user.reports, label: i.profileSignals },
        ].map((s) => (
          <div key={s.label} className="profile__stat">
            <div className="profile__stat-icon"><DataIcon name={s.icon} size={18} /></div>
            <div className="profile__stat-val">{s.val}</div>
            <div className="profile__stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* -- Tab content -- */}
      {activeTab === "stats" && (
        <div className="profile__stat-bars anim-fade-up">
          {[
            { icon: "star", key: i.profileTotalPoints, val: user.points.toLocaleString(), pct: user.points / 5000 },
            { icon: "paintbrush", key: i.profileCleaningsLabel, val: user.cleanings, pct: user.cleanings / 50 },
            { icon: "map-pin", key: i.profileReportsLabel, val: user.reports, pct: user.reports / 30 },
            { icon: "flame", key: i.profileStreakRecord, val: `${user.streak} ${i.profileDays}`, pct: user.streak / 30 },
          ].map((s) => (
            <div key={s.key} className="profile__stat-bar-card">
              <div className="profile__stat-bar-header">
                <span className="profile__stat-bar-key"><DataIcon name={s.icon} size={13} /> {s.key}</span>
                <span className="profile__stat-bar-val">{s.val}</span>
              </div>
              <div className="profile__stat-bar-track">
                <div className="profile__stat-bar-fill" style={{ width: `${Math.min(s.pct * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "badges" && (
        <div className="anim-fade-up">
          <div className="profile__badge-intro">
            {BADGES.filter((b: any) => b.earned).length} / {BADGES.length} {i.profileUnlocked}
          </div>
          <div className="profile__badge-grid">
            {BADGES.map((b: any) => (
              <div key={b.id} title={b.desc} className={`profile__badge-item ${b.earned ? "profile__badge-item--earned" : "profile__badge-item--locked"}`}>
                <div className="profile__badge-icon"><DataIcon name={b.icon} size={22} /></div>
                <div className="profile__badge-name" style={{ color: b.earned ? "var(--text-1)" : "var(--text-3)" }}>{b.name}</div>
                {b.earned && <div className="profile__badge-earned-dot" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="profile__activity-section anim-fade-up">
          <div className="label-caps profile__chart-label">{i.profileActivityLabel}</div>
          <div className="profile__chart">
            {WEEK_DATA.map((week, wi) => (
              <div key={wi} className="profile__chart-week">
                {week.map((val, di) => (
                  <div key={di} className="profile__chart-bar-wrap">
                    <div className="profile__chart-bar" style={{
                      height: Math.max(4, (val / CHART_MAX) * 44),
                      background: `rgba(255,255,255,${val > 0 ? 0.1 + (val / CHART_MAX) * 0.5 : 0.04})`,
                      border: `1px solid rgba(255,255,255,${val > 0 ? 0.2 : 0.07})`,
                    }} />
                    {wi === 3 && <span className="profile__chart-day">{DAYS[di]}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="profile__settings-section anim-fade-up">
          <Toggle label={i.profilePushNotifs} desc={i.profilePushDesc} value={notifs} onToggle={toggleNotifs} />
          <Toggle label={i.profileGps} desc={i.profileGpsDesc} value={gps} onToggle={toggleGps} />

          <Toggle label={i.profileEmails} desc={i.profileEmailsDesc} value={emails} onToggle={toggleEmails} />
          <button className="btn-danger profile__logout" onClick={logout}>{i.profileLogout}</button>
        </div>
      )}
    </div>
  );
}
