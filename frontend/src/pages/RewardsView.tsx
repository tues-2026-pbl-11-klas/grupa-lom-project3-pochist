import { useState, useEffect } from "react";
import { Flame, Sparkles, Star, Lock } from "lucide-react";
import DataIcon from "../components/DataIcon.tsx";
import "../styles/RewardsView.css";
import { useApp } from "../context/AppContext.tsx";
import { t, translateReward, translateRewardHistory } from "../i18n.ts";
import type { Lang } from "../i18n.ts";

interface Reward {
  id: number;
  icon: string;
  name: string;
  desc: string;
  partner: string;
  cost: number;
  category: string;
  featured?: boolean;
  hot?: boolean;
  newBadge?: boolean;
}

const REWARDS: Reward[] = [
  { id: 1, icon: "coffee", name: "Безплатно кафе", desc: "Една безплатна напитка в партньорски кафенета в Sofia.", partner: "COSTA COFFEE · STARBUCKS", cost: 500, category: "food", featured: true, hot: true },
  { id: 2, icon: "tree-pine", name: "Засади дърво", desc: "Организираме засаждане на дърво в твое име в парк в Sofia.", partner: "SOFIA GREEN INITIATIVE", cost: 800, category: "eco" },
  { id: 3, icon: "ticket", name: "Безплатен транспорт", desc: "Карта за градски транспорт за 1 месец.", partner: "ЦЕНТЪРА ЗА ГРАДСКА МОБИЛНОСТ", cost: 1200, category: "transport", newBadge: true },
  { id: 4, icon: "utensils", name: "Отстъпка 20% храна", desc: "20% намаление в партньорски ресторанти.", partner: "HAPPY · HAPPY BAR & GRILL", cost: 350, category: "food" },
  { id: 5, icon: "recycle", name: "Еко продуктов пакет", desc: "Комплект от биоразградими продукти от SofiaEco.", partner: "SOFIAECO STORE", cost: 600, category: "eco" },
  { id: 6, icon: "medal", name: "Verified User статус", desc: "Получи официалния VRF badge и 2x точки за всяка задача.", partner: "CHIST PLATFORM", cost: 3000, category: "status" },
  { id: 7, icon: "ticket", name: "Концерт / Събитие", desc: "2 безплатни билета за партньорско събитие в Sofia.", partner: "SOFIA LIVE", cost: 2000, category: "experience", newBadge: true },
  { id: 8, icon: "droplets", name: "Почистващ комплект", desc: "Професионален еко комплект за почистване — ръкавици, торби, инструменти.", partner: "ECO TOOLS BG", cost: 400, category: "eco" },
];

interface HistoryItem {
  id: number;
  icon: string;
  name: string;
  date: string;
  dateEn: string;
  pts: number;
}

function loadHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem("cw_reward_history") || "[]");
  } catch { return []; }
}

function saveHistory(items: HistoryItem[]) {
  localStorage.setItem("cw_reward_history", JSON.stringify(items));
}

const CATS = ["all", "food", "eco", "transport", "experience", "status"];

function ClaimConfirm({ reward, lang, onConfirm, onCancel }: { reward: Reward; lang: Lang; onConfirm: () => void; onCancel: () => void }) {
  const i = t(lang);
  const tr = translateReward(lang, reward);
  return (
    <div className="rewards__claim-confirm" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="rewards__claim-card">
        <span className="rewards__claim-emoji"><DataIcon name={reward.icon} size={32} /></span>
        <div className="rewards__claim-title">{i.rewardsConfirmTitle}</div>
        <div className="rewards__claim-desc">
          <strong style={{ color: "var(--text-1)" }}>{tr.name}</strong>
          <br />{tr.desc}<br /><br />
          <span style={{ color: "var(--text-3)" }}>{i.rewardsPartner}: {tr.partner}</span>
        </div>
        <div className="rewards__claim-cost"><Star size={14} strokeWidth={2} /> {reward.cost.toLocaleString()} {i.rewardsCost}</div>
        <div className="rewards__claim-btns">
          <button className="btn-ghost rewards__claim-cancel" onClick={onCancel}>{i.rewardsCancel}</button>
          <button className="btn-primary rewards__claim-ok" onClick={onConfirm}>{i.rewardsRedeem}</button>
        </div>
      </div>
    </div>
  );
}

function RewardCard({ reward, userPoints, claimed, onClaim, lang }: { reward: Reward; userPoints: number; claimed: boolean; onClaim: (r: Reward) => void; lang: Lang }) {
  const i = t(lang);
  const tr = translateReward(lang, reward);
  const canAfford = userPoints >= reward.cost;
  const isLocked = !canAfford && !claimed;
  const progress = Math.min((userPoints / reward.cost) * 100, 100);
  const needMore = reward.cost - userPoints;

  let cardClass = "reward-card";
  if (claimed) cardClass += " reward-card--claimed";
  else if (isLocked) cardClass += " reward-card--locked";
  else cardClass += " reward-card--available";
  if (reward.featured) cardClass += " reward-card--featured";

  return (
    <div className={cardClass} onClick={() => !isLocked && !claimed && onClaim(reward)}>
      {reward.hot && <span className="reward-card__hot"><Flame size={12} strokeWidth={2} /> HOT</span>}
      {reward.newBadge && <span className="reward-card__new"><Sparkles size={12} strokeWidth={2} /> NEW</span>}
      <span className="reward-card__emoji"><DataIcon name={reward.icon} size={28} /></span>
      <div className="reward-card__body">
        <div className="reward-card__name">{tr.name}</div>
        <div className="reward-card__desc">{tr.desc}</div>
        <div className="reward-card__partner">{tr.partner}</div>
        {isLocked && (
          <div className="reward-card__progress">
            <div className="reward-card__progress-bar">
              <div className="reward-card__progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="reward-card__progress-label">{i.rewardsNeedMore} {needMore.toLocaleString()} {i.rewardsPts}</div>
          </div>
        )}
      </div>
      <div className="reward-card__footer">
        <span className={`reward-card__cost ${isLocked ? "reward-card__cost--locked" : ""}`}>
          <Star size={12} strokeWidth={2} /> {reward.cost.toLocaleString()}
        </span>
        {claimed && <span className="reward-card__claimed-tag">{i.rewardsClaimed}</span>}
        {isLocked && <span className="reward-card__lock-icon"><Lock size={14} strokeWidth={2} /></span>}
        {!claimed && !isLocked && (
          <button className="btn-primary reward-card__claim-btn" onClick={(e) => { e.stopPropagation(); onClaim(reward); }}>
            {i.rewardsRedeem.replace(" →", "")}
          </button>
        )}
      </div>
    </div>
  );
}

interface RewardsViewProps {
  lang: Lang;
}

export default function RewardsView({ lang }: RewardsViewProps) {
  const { user, dispatch } = useApp();
  const i = t(lang);
  const [cat, setCat] = useState("all");
  const [tab, setTab] = useState("shop");
  const [claimed, setClaimed] = useState<Set<number>>(new Set());
  const [pending, setPending] = useState<Reward | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = loadHistory();
    setHistory(stored);
    setClaimed(new Set(stored.filter((h) => h.pts < 0).map((_, idx) => idx + 1)));
  }, []);

  const filtered = REWARDS.filter((r) => cat === "all" || r.category === cat);
  const featured = filtered.find((r) => r.featured);
  const rest = filtered.filter((r) => !r.featured);

  const handleClaim = (reward: Reward) => {
    if (user.points < reward.cost || claimed.has(reward.id)) return;
    setPending(reward);
  };

  const confirmClaim = () => {
    if (!pending) return;
    dispatch({ type: "SPEND_POINTS", payload: pending.cost });
    dispatch({ type: "ADD_NOTIFICATION", payload: { type: "success", message: `${pending.name} — ${lang === "en" ? "claimed!" : "взето успешно!"}`, duration: 4000 } });
    setClaimed((prev) => new Set([...prev, pending.id]));
    const now = new Date();
    const newItem: HistoryItem = {
      id: Date.now(),
      icon: pending.icon,
      name: pending.name,
      date: now.toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" }),
      dateEn: now.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
      pts: -pending.cost,
    };
    const updated = [newItem, ...history];
    setHistory(updated);
    saveHistory(updated);
    setPending(null);
  };

  return (
    <div className="rewards">
      {pending && <ClaimConfirm reward={pending} lang={lang} onConfirm={confirmClaim} onCancel={() => setPending(null)} />}

      <div className="label-caps">{i.rewardsTitle}</div>

      <div className="rewards__points-hero">
        <div className="rewards__points-hero-glow" />
        <div className="rewards__balance-label">{i.rewardsAvailable}</div>
        <div className="rewards__balance-value">{user.points.toLocaleString()}</div>
        <div className="rewards__balance-sub">{i.rewardsChist}</div>
        <div className="rewards__quick-stats">
          {[
            { val: user.cleanings, key: i.profileCleanings },
            { val: user.reports, key: i.profileSignals },
            { val: user.streak, key: lang === "en" ? "STREAK" : "СТРИЙК" },
          ].map((s) => (
            <div key={s.key} className="rewards__qs-item">
              <div className="rewards__qs-val">{s.val}</div>
              <div className="rewards__qs-key">{s.key}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", background: "var(--bg-card)", borderRadius: "var(--r-md)", padding: 4, gap: 4 }}>
        {[{ id: "shop", label: i.rewardsShop }, { id: "history", label: i.rewardsHistory }].map((tItem) => (
          <button
            key={tItem.id}
            style={{
              flex: 1, padding: "9px 0", border: "none", borderRadius: 10,
              background: tab === tItem.id ? "var(--primary)" : "transparent",
              color: tab === tItem.id ? "var(--bg-base)" : "var(--text-3)",
              fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: 1, transition: "all .2s",
            }}
            onClick={() => setTab(tItem.id)}
          >
            {tItem.label}
          </button>
        ))}
      </div>

      {tab === "shop" && (
        <>
          <div className="rewards__section-header">
            <span className="label-caps">{i.rewardsCategories}</span>
            <div className="rewards__filter-tabs">
              {CATS.map((c) => (
                <button
                  key={c}
                  className={`rewards__filter-tab ${cat === c ? "rewards__filter-tab--active" : "rewards__filter-tab--inactive"}`}
                  onClick={() => setCat(c)}
                >
                  {c === "all" ? i.rewardsCatAll : c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="rewards__grid">
            {featured && <RewardCard key={featured.id} reward={featured} userPoints={user.points} claimed={claimed.has(featured.id)} onClaim={handleClaim} lang={lang} />}
            {rest.map((r) => <RewardCard key={r.id} reward={r} userPoints={user.points} claimed={claimed.has(r.id)} onClaim={handleClaim} lang={lang} />)}
          </div>
        </>
      )}

      {tab === "history" && (
        <div className="rewards__history stagger">
          {history.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--text-3)", padding: "24px 0", fontSize: 12, letterSpacing: 1 }}>
              {lang === "en" ? "No history yet" : "Няма история"}
            </div>
          )}
          {history.map((h) => (
            <div key={h.id} className="rewards__history-item anim-fade-up">
              <div className="rewards__history-icon" style={{
                background: h.pts > 0 ? "rgba(255,255,255,0.06)" : "rgba(255,68,68,0.08)",
                border: `1px solid ${h.pts > 0 ? "rgba(255,255,255,0.15)" : "rgba(255,68,68,0.2)"}`,
              }}>
                <DataIcon name={h.icon} size={18} />
              </div>
              <div className="rewards__history-body">
                <div className="rewards__history-name">{translateRewardHistory(lang, h)}</div>
                <div className="rewards__history-date">{lang === "en" ? h.dateEn : h.date}</div>
              </div>
              <div className="rewards__history-pts" style={{ color: h.pts > 0 ? "var(--text-1)" : "var(--red)" }}>
                {h.pts > 0 ? "+" : ""}{h.pts}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
