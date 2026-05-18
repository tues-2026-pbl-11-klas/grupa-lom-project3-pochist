import { useState, useCallback } from "react";
import Toast from "./components/Toast.tsx";
import MapDashboard from "./components/MapDashboard.tsx";
import Navbar from "./components/Navbar.tsx";
import ReportsView from "./pages/ReportsView.tsx";
import LeaderboardView from "./pages/LeaderboardView.tsx";
import ProfileView from "./pages/ProfileView.tsx";
import RewardsView from "./pages/RewardsView.tsx";
import ReportModal from "./components/ReportModal.tsx";
import NotificationsPanel from "./components/NotificationsPanel.tsx";
import type { Lang } from "./i18n.ts";

export default function Main() {
  const [tab, setTab] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [lang, setLang] = useState<Lang>("bg");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "bg" ? "en" : "bg"));
  }, []);

  const isHome = tab === "home";

  const renderPage = () => {
    switch (tab) {
      case "home":
        return <MapDashboard onNavigate={setTab} currentTab={tab} lang={lang} onToggleLang={toggleLang} />;
      case "reports":
        return <ReportsView onNewReport={() => setShowModal(true)} lang={lang} />;
      case "board":
        return <LeaderboardView lang={lang} />;
      case "rewards":
        return <RewardsView lang={lang} />;
      case "profile":
        return <ProfileView lang={lang} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        position: "relative",
      }}
    >
      {!isHome && (
        <>
          <div className="ambient-orb-tl" aria-hidden="true" />
          <div className="ambient-orb-br" aria-hidden="true" />
        </>
      )}

      {!isHome && (
        <Navbar
          lang={lang}
          onToggleLang={toggleLang}
          currentTab={tab}
          onNavigate={setTab}
        />
      )}

      {isHome ? (
        renderPage()
      ) : (
        <main className="page-content" style={{ paddingTop: 80 }}>
          {renderPage()}
        </main>
      )}

      <Toast />

      {showModal && <ReportModal onClose={() => setShowModal(false)} />}
      {showNotifs && (
        <NotificationsPanel onClose={() => setShowNotifs(false)} />
      )}
    </div>
  );
}
