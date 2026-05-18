// src/services/api.ts  —  REST API layer for Spring Boot backend
const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

function getToken() { return localStorage.getItem("cw_token"); }

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function request(path: string, options: RequestOptions = {}): Promise<any> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res   = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (res.status === 401) { localStorage.removeItem("cw_token"); window.location.href = "/"; return; }
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message ?? `HTTP ${res.status}`); }
  if (res.status === 204) return null;
  return res.json();
}

export const authApi = {
  register: (p: Record<string, string>)    => request("/auth/register", { method:"POST", body: JSON.stringify(p) }),
  login:    (e: string, p: string)         => request("/auth/login",    { method:"POST", body: JSON.stringify({ email:e, password:p }) }),
  refresh:  (tok: string)                  => request("/auth/refresh",  { method:"POST", body: JSON.stringify({ refreshToken:tok }) }),
  logout:   ()                             => request("/auth/logout",   { method:"POST" }),
};

export const reportsApi = {
  list:     (params: Record<string, string> = {}) => { const qs=new URLSearchParams(Object.entries(params).filter(([,v])=>v!=null)).toString(); return request(`/reports${qs?`?${qs}`:""}`); },
  getById:  (id: number)            => request(`/reports/${id}`),
  create:   (formData: FormData)    => request("/reports",               { method:"POST",  headers:{}, body: formData }),
  claim:    (id: number)            => request(`/reports/${id}/claim`,   { method:"PATCH" }),
  complete: (id: number, formData: FormData) => request(`/reports/${id}/complete`,{ method:"POST",  headers:{}, body: formData }),
  confirm:  (id: number)            => request(`/reports/${id}/confirm`, { method:"POST" }),
  flag:     (id: number, reason: string) => request(`/reports/${id}/flag`,    { method:"POST",  body: JSON.stringify({ reason }) }),
  mapPins:  (bounds: string)        => request(`/reports/map?bounds=${bounds}`),
};

export const usersApi = {
  getMe:          ()                    => request("/users/me"),
  updateMe:       (p: Record<string, unknown>) => request("/users/me",           { method:"PATCH", body: JSON.stringify(p) }),
  getById:        (id: string)          => request(`/users/${id}`),
  getBadges:      ()                    => request("/users/me/badges"),
  getActivity:    (pg=0)                => request(`/users/me/activity?page=${pg}&size=20`),
  getStats:       ()                    => request("/users/me/stats"),
  getLeaderboard: ()                    => request("/users/leaderboard"),
};

export const leaderboardApi = {
  get: (period="week", page=0) => request(`/leaderboard?period=${period}&page=${page}&size=20`),
};

export const aiApi = {
  verifyImage:   (fd: FormData) => request("/verifications/check-image", { method:"POST", headers:{}, body:fd }),
  compareImages: (fd: FormData) => request("/verifications",             { method:"POST", headers:{}, body:fd }),
};

export const verificationsApi = {
  verify: (body: Record<string, unknown>) => request("/verifications", { method:"POST", body: JSON.stringify(body) }),
  getById: (id: number)  => request(`/verifications/${id}`),
  getByTaskId: (taskId: number) => request(`/verifications/task/${taskId}`),
};

export const statsApi = {
  getGlobal:     () => request("/stats/global"),
  getByDistrict: () => request("/stats/districts"),
};

export const notificationsApi = {
  list:       (unread=false) => request(`/notifications${unread?"?unread=true":""}`),
  markRead:   (id: number)   => request(`/notifications/${id}/read`, { method:"PATCH" }),
  markAllRead:()             => request("/notifications/read-all",   { method:"PATCH" }),
};

export default { auth:authApi, reports:reportsApi, users:usersApi, leaderboard:leaderboardApi, ai:aiApi, verifications:verificationsApi, stats:statsApi, notifications:notificationsApi };
