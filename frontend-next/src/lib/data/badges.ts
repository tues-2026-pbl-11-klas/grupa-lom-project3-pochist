export interface Badge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  pts: number;
}

export const BADGES: Badge[] = [
  { id: "first_report",  icon: "sprout",      name: "Първи сигнал",     desc: "Докладва първото замърсяване",   pts: 15 },
  { id: "first_clean",   icon: "paintbrush",  name: "Първо почистване", desc: "Почисти първото замърсяване",    pts: 40 },
  { id: "streak_7",      icon: "flame",       name: "7-дневен стрийк",  desc: "Активен 7 последователни дни",   pts: 100 },
  { id: "clean_10",      icon: "zap",         name: "10 почиствания",   desc: "Завърши 10 успешни почиствания", pts: 200 },
  { id: "verified",      icon: "badge-check", name: "Verified User",    desc: "Доказана активност и надеждност", pts: 500 },
  { id: "eco_legend",    icon: "globe",       name: "Еко легенда",      desc: "Достигни 5000 точки",            pts: 1000 },
  { id: "district_hero", icon: "building",    name: "Герой на района",  desc: "Почисти 5 места в един район",   pts: 300 },
  { id: "team_player",   icon: "users",       name: "Екипен играч",     desc: "Потвърди 20 задачи на другите",  pts: 250 },
];
