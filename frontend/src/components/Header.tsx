import { Leaf, Star, Flame, Bell } from "lucide-react";
import "../styles/Header.css";
import { useApp } from "../context/AppContext.tsx";

interface HeaderProps {
  onNotifications: () => void;
}

export default function Header({ onNotifications }: HeaderProps) {
  const { user } = useApp();
  return (
    <header className="header">
      <div className="header__logo">
        <div className="header__logo-icon"><Leaf size={20} strokeWidth={1.8} /></div>
        <div>
          <div className="header__logo-wordmark">CHIST</div>
          <div className="header__logo-sub">SOFIA · BETA</div>
        </div>
      </div>
      <div className="header__right">
        <div className="header__user-pts">
          <div className="header__user-pts-val">
            <Star size={14} strokeWidth={2} /> {user.points.toLocaleString()}
          </div>
          {user.streak > 0 && (
            <div className="header__user-pts-streak"><Flame size={12} strokeWidth={2} /> {user.streak} дни</div>
          )}
        </div>
        <button
          className="header__bell"
          aria-label="Известия"
          onClick={onNotifications}
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className="header__bell-dot" aria-hidden="true" />
        </button>
        <button className="header__avatar" aria-label="Профил">
          {user.avatar}
        </button>
      </div>
    </header>
  );
}
