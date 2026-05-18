import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.tsx";
import type { Lang } from "../i18n.ts";
import { t } from "../i18n.ts";
import { Home, MapPin, Trophy, Gift, User, Star, LogOut } from "lucide-react";
import "../styles/MapNavbar.css";

interface NavbarProps {
  lang: Lang;
  onToggleLang: () => void;
  currentTab: string;
  onNavigate: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: "home", icon: Home, labelBg: "Начало", labelEn: "Home" },
  { id: "reports", icon: MapPin, labelBg: "Сигнали", labelEn: "Reports" },
  { id: "board", icon: Trophy, labelBg: "Класация", labelEn: "Leaderboard" },
  { id: "rewards", icon: Gift, labelBg: "Награди", labelEn: "Rewards" },
  { id: "profile", icon: User, labelBg: "Профил", labelEn: "Profile" },
];

export default function Navbar({ lang, onToggleLang, currentTab, onNavigate }: NavbarProps) {
  const { user, logout } = useApp();
  const i = t(lang);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <nav className="map-navbar">
      <div className="map-navbar__logo">
        <span className="map-navbar__wordmark">CHIST</span>
        <span className="map-navbar__subtitle">{i.sofiaBeta}</span>
      </div>

      <div className="map-navbar__right">
        <div className="map-navbar__stat">
          <span className="map-navbar__stat-icon--star"><Star size={14} strokeWidth={2} /></span>
          <span className="map-navbar__stat-val">{user.points.toLocaleString()}</span>
        </div>

        <button onClick={onToggleLang} className="map-navbar__lang-btn">
          {lang === "bg" ? "BG" : "EN"}
        </button>

        <div className="map-navbar__menu-wrap" ref={menuRef}>
          <button
            className={`map-navbar__menu-btn ${menuOpen ? "map-navbar__menu-btn--open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="map-navbar__dropdown">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={`map-navbar__dropdown-item ${currentTab === item.id ? "map-navbar__dropdown-item--active" : ""}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setMenuOpen(false);
                  }}
                >
                  <span className="map-navbar__dropdown-icon">{(() => { const Icon = item.icon; return <Icon size={16} strokeWidth={1.8} />; })()}</span>
                  {lang === "en" ? item.labelEn : item.labelBg}
                </button>
              ))}
              <div className="map-navbar__dropdown-divider" />
              <button
                className="map-navbar__dropdown-item map-navbar__dropdown-item--logout"
                onClick={() => { setMenuOpen(false); logout(); }}
              >
                <span className="map-navbar__dropdown-icon"><LogOut size={16} strokeWidth={1.8} /></span>
                {lang === "en" ? "Logout" : "Изход"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
