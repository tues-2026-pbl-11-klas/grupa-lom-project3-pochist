# TSX Migration & Dependency Cleanup

## Date: 2026-04-02

## Overview

Migrated all frontend source files from `.jsx`/`.js` to `.tsx`/`.ts` and removed unused dependencies (Tailwind CSS, `@vis.gl/react-maplibre`). The project uses pure CSS for all styling — no CSS framework.

## Changes

### Files Renamed (.jsx → .tsx)

| Old Path | New Path |
|----------|----------|
| `main.jsx` | `main.tsx` |
| `src/App.jsx` | `src/App.tsx` |
| `src/context/AppContext.jsx` | `src/context/AppContext.tsx` |
| `src/components/Header.jsx` | `src/components/Header.tsx` |
| `src/components/Toast.jsx` | `src/components/Toast.tsx` |
| `src/components/NotificationsPanel.jsx` | `src/components/NotificationsPanel.tsx` |
| `src/components/ReportCard.jsx` | `src/components/ReportCard.tsx` |
| `src/components/ReportModal.jsx` | `src/components/ReportModal.tsx` |
| `src/components/CleanModal.jsx` | `src/components/CleanModal.tsx` |
| `src/components/BottomNav.jsx` | `src/components/BottomNav.tsx` |
| `src/pages/AuthView.jsx` | `src/pages/AuthView.tsx` |

### Files Renamed (.js → .ts)

| Old Path | New Path |
|----------|----------|
| `src/services/api.js` | `src/services/api.ts` |
| `src/data/mockData.js` | `src/data/mockData.ts` |
| `src/components/api.test.js` | `src/services/api.test.ts` |

### Dependencies Removed

| Package | Type | Reason |
|---------|------|--------|
| `@tailwindcss/vite` | devDependency | Not used — all styling is pure CSS |
| `tailwindcss` | devDependency | Not used — all styling is pure CSS |
| `@vis.gl/react-maplibre` | dependency | Not used — MapContainer.tsx uses `maplibre-gl` directly |

### Other Changes

- `index.html`: updated `<script>` src from `./main.jsx` to `./main.tsx`
- All cross-file imports updated to reference `.tsx`/`.ts` extensions
- Test file `api.test.ts` relocated from `src/components/` to `src/services/` (correct location next to `api.ts`)

## Styling Approach

The project uses **pure CSS** with custom properties defined in `src/styles/global.css`. No Tailwind, no CSS-in-JS. Each component has a corresponding `.css` file in `src/styles/`.

## Current File Structure

```
frontend/
  index.html
  main.tsx
  vite.config.js
  tsconfig.json
  vitest.config.js
  src/
    App.tsx
    Main.tsx
    i18n.ts
    context/
      AppContext.tsx
    components/
      BottomNav.tsx
      CleanModal.tsx
      FilterChips.tsx
      Header.tsx
      MapContainer.tsx
      MapDashboard.tsx
      MarkerPopup.tsx
      Navbar.tsx
      NotificationsPanel.tsx
      ReportCard.tsx
      ReportModal.tsx
      Sidebar.tsx
      SignalCard.tsx
      Toast.tsx
    pages/
      AuthView.tsx
      LeaderboardView.tsx
      ProfileView.tsx
      ReportsView.tsx
      RewardsView.tsx
    services/
      api.ts
      api.test.ts
    data/
      mockData.ts
    styles/
      (pure CSS files — one per component)
```
