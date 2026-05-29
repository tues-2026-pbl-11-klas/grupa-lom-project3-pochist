export interface Reward {
  id: number;
  icon: string;
  name: string;
  desc: string;
  partner: string;
  cost: number;
  category: "food" | "eco" | "transport" | "experience" | "status";
  featured?: boolean;
  hot?: boolean;
  newBadge?: boolean;
}

export const REWARDS: Reward[] = [
  { id: 1, icon: "coffee",    name: "Безплатно кафе",        desc: "Една безплатна напитка в партньорски кафенета в София.",   partner: "COSTA COFFEE · STARBUCKS",                cost: 500,  category: "food",       featured: true, hot: true },
  { id: 2, icon: "tree-pine", name: "Засади дърво",          desc: "Организираме засаждане на дърво в твое име в парк в София.", partner: "SOFIA GREEN INITIATIVE",                cost: 800,  category: "eco" },
  { id: 3, icon: "ticket",    name: "Безплатен транспорт",   desc: "Карта за градски транспорт за 1 месец.",                    partner: "ЦЕНТЪРА ЗА ГРАДСКА МОБИЛНОСТ",          cost: 1200, category: "transport",  newBadge: true },
  { id: 4, icon: "utensils",  name: "Отстъпка 20% храна",    desc: "20% намаление в партньорски ресторанти.",                   partner: "HAPPY · HAPPY BAR & GRILL",             cost: 350,  category: "food" },
  { id: 5, icon: "recycle",   name: "Еко продуктов пакет",   desc: "Комплект от биоразградими продукти от SofiaEco.",           partner: "SOFIAECO STORE",                        cost: 600,  category: "eco" },
  { id: 6, icon: "medal",     name: "Verified User статус",  desc: "Получи официалния VRF badge и 2x точки за всяка задача.",   partner: "CHIST PLATFORM",                        cost: 3000, category: "status" },
  { id: 7, icon: "ticket",    name: "Концерт / Събитие",     desc: "2 безплатни билета за партньорско събитие в София.",        partner: "SOFIA LIVE",                            cost: 2000, category: "experience", newBadge: true },
  { id: 8, icon: "droplets",  name: "Почистващ комплект",    desc: "Професионален еко комплект за почистване.",                 partner: "ECO TOOLS BG",                          cost: 400,  category: "eco" },
];

export const CATEGORIES = ["all", "food", "eco", "transport", "experience", "status"] as const;
export type Category = (typeof CATEGORIES)[number];
