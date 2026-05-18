import { useState } from "react";
import { Star, Medal, MapPin, CheckCircle, Flame, Bell, X } from "lucide-react";
import "../styles/NotificationsPanel.css";

import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = { star: Star, medal: Medal, "map-pin": MapPin, "check-circle": CheckCircle, flame: Flame };

const INITIAL = [
  {
    id: 1,
    type: "points",
    icon: "star",
    title: "+120 точки!",
    message: "Задачата 'Борисова градина' беше потвърдена.",
    time: "преди 5мин",
    read: false,
  },
  {
    id: 2,
    type: "badge",
    icon: "medal",
    title: "Нова значка!",
    message: "Получи: 7-дневен стрийк",
    time: "преди 1ч",
    read: false,
  },
  {
    id: 3,
    type: "report",
    icon: "map-pin",
    title: "Нов сигнал в района ти",
    message: "Борисова градина — критично замърсяване.",
    time: "преди 2ч",
    read: true,
  },
  {
    id: 4,
    type: "confirm",
    icon: "check-circle",
    title: "Задачата ти беше потвърдена",
    message: "EcoHero99 потвърди: 'Студентски град'",
    time: "преди 1д",
    read: true,
  },
  {
    id: 5,
    type: "streak",
    icon: "flame",
    title: "Не прекъсвай стрийка!",
    message: "Имаш 7 дни поред. Влез и продължи!",
    time: "преди 2д",
    read: true,
  },
  {
    id: 6,
    type: "points",
    icon: "star",
    title: "+80 точки!",
    message: "Задачата 'Люлин 5' беше потвърдена.",
    time: "преди 3д",
    read: true,
  },
];

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  points: { color: "var(--text-1)", bg: "rgba(255,255,255,0.06)" },
  badge: { color: "var(--text-2)", bg: "rgba(255,255,255,0.04)" },
  report: { color: "var(--text-2)", bg: "rgba(255,255,255,0.04)" },
  confirm: { color: "var(--text-1)", bg: "rgba(255,255,255,0.06)" },
  streak: { color: "var(--text-2)", bg: "rgba(255,255,255,0.04)" },
};

interface NotificationsPanelProps {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const [notifs, setNotifs] = useState(INITIAL);
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div
      className="notif-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="notif-panel">
        <div className="notif-panel__header">
          <div>
            <div className="notif-panel__title">ИЗВЕСТИЯ</div>
            {unread > 0 && (
              <div className="notif-panel__unread">{unread} непрочетени</div>
            )}
          </div>
          <div className="notif-panel__header-btns">
            {unread > 0 && (
              <button
                className="notif-panel__mark-all"
                onClick={() =>
                  setNotifs((n) => n.map((x) => ({ ...x, read: true })))
                }
              >
                ПРОЧЕТИ ВСИЧКИ
              </button>
            )}
            <button
              className="notif-panel__close"
              onClick={onClose}
              aria-label="Затвори"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        <hr className="divider" />

        {notifs.length === 0 ? (
          <div className="notif-panel__empty">
            <div className="notif-panel__empty-icon"><Bell size={24} strokeWidth={1.5} /></div>
            Няма известия
          </div>
        ) : (
          notifs.map((n, i) => {
            const c = TYPE_COLORS[n.type] || TYPE_COLORS.confirm;
            const IconComp = ICON_MAP[n.icon] || Star;
            return (
              <div
                key={n.id}
                className={`notif-item ${
                  n.read ? "notif-item--read" : "notif-item--unread"
                } anim-fade-up`}
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {!n.read && <div className="notif-item__unread-dot" />}
                <div
                  className="notif-item__icon-box"
                  style={{ background: c.bg, border: `1px solid rgba(255,255,255,0.12)` }}
                >
                  <IconComp size={16} strokeWidth={1.8} />
                </div>
                <div className="notif-item__body">
                  <div
                    className="notif-item__title"
                    style={{
                      color: n.read
                        ? "var(--text-2)"
                        : "var(--text-1)",
                    }}
                  >
                    {n.title}
                  </div>
                  <div className="notif-item__message">{n.message}</div>
                  <div className="notif-item__time">{n.time}</div>
                </div>
                <button
                  className="notif-item__dismiss"
                  onClick={() =>
                    setNotifs((ns) => ns.filter((x) => x.id !== n.id))
                  }
                  aria-label="Изтрий"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
