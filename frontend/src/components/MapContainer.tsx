import { useState, useRef, useEffect, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createRoot } from "react-dom/client";
import MarkerPopup from "./MarkerPopup.tsx";
import type { T, Lang } from "../i18n.ts";
import "../styles/MapDashboard.css";

interface Report {
  id: string | number;
  title: string;
  location: string;
  description: string;
  severity: string;
  status: string;
  img: string;
  points: number;
  reporter: string;
  reporterAvatar: string;
  time: string;
  volunteers: number;
  gps: { lat: number; lng: number };
  [key: string]: unknown;
}

interface MapContainerProps {
  reports: Report[];
  selectedId: string | number | null;
  onSelectReport: (id: string | number) => void;
  onClaim: (id: string | number) => void;
  onComplete: (id: string | number) => void;
  i: T;
  lang: Lang;
}

/* Vibrant marker colors per severity + status */
const MARKER_COLORS: Record<string, { fill: string; glow: string }> = {
  critical: { fill: "#FF2D55", glow: "rgba(255,45,85,0.7)" },
  high:     { fill: "#FF9F0A", glow: "rgba(255,159,10,0.6)" },
  medium:   { fill: "#FFD60A", glow: "rgba(255,214,10,0.5)" },
  low:      { fill: "#30D158", glow: "rgba(48,209,88,0.5)" },
  done:     { fill: "#32D74B", glow: "rgba(50,215,75,0.6)" },
};

function getMarkerStyle(report: Report) {
  if (report.status === "done") return MARKER_COLORS.done;
  return MARKER_COLORS[report.severity] ?? { fill: "#FF4D94", glow: "rgba(255,77,148,0.6)" };
}

/* Build a large SVG marker pin with strong glow */
function createMarkerElement(color: string, glow: string): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cursor = "pointer";
  el.style.width = "44px";
  el.style.height = "56px";
  el.style.filter = `drop-shadow(0 0 12px ${glow})`;
  el.style.transition = "filter 0.25s ease";

  el.innerHTML = `
    <svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g-${color.replace('#','')}" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.75"/>
        </radialGradient>
        <filter id="glow-${color.replace('#','')}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M22 0C9.85 0 0 9.85 0 22c0 16.5 22 34 22 34s22-17.5 22-34C44 9.85 34.15 0 22 0z"
        fill="url(#g-${color.replace('#','')})"
        filter="url(#glow-${color.replace('#','')})"
      />
      <circle cx="22" cy="20" r="10" fill="white" fill-opacity="0.95"/>
      <circle cx="22" cy="20" r="6" fill="${color}"/>
    </svg>
  `;

  el.addEventListener("mouseenter", () => {
    el.style.filter = `drop-shadow(0 0 22px ${glow})`;
    el.style.zIndex = "10";
  });
  el.addEventListener("mouseleave", () => {
    el.style.filter = `drop-shadow(0 0 12px ${glow})`;
    el.style.zIndex = "auto";
  });

  return el;
}

export default function MapContainer({
  reports,
  selectedId,
  onSelectReport,
  onClaim,
  onComplete,
  i,
  lang,
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<number, maplibregl.Marker>>(new Map());
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  /* Keep a ref to the latest openPopup so marker click handlers never go stale */
  const openPopupRef = useRef<(report: Report) => void>(() => {});

  /* Initialize map */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [23.3219, 42.6977],
      zoom: 12,
      attributionControl: false,
    });

    // Suppress non-fatal MapLibre v5 projection error during style load
    map.on("error", (e) => {
      if (e?.error?.message?.includes("projection")) return;
      console.error(e);
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    mapRef.current = map;

    map.on("load", () => setMapLoaded(true));

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* Open a popup for a given report */
  const openPopup = useCallback(
    (report: Report) => {
      const map = mapRef.current;
      if (!map) return;

      popupRef.current?.remove();

      const popupNode = document.createElement("div");
      const root = createRoot(popupNode);
      root.render(
        <MarkerPopup report={report} onClaim={onClaim} onComplete={onComplete} i={i} lang={lang} />
      );

      const popup = new maplibregl.Popup({
        offset: [0, -58],
        closeButton: true,
        closeOnClick: false,
        maxWidth: "360px",
        className: "chist-popup",
      })
        .setLngLat([report.gps.lng, report.gps.lat])
        .setDOMContent(popupNode)
        .addTo(map);

      popup.on("close", () => {
        root.unmount();
      });

      popupRef.current = popup;
    },
    [onClaim, onComplete, i, lang]
  );

  openPopupRef.current = openPopup;

  /* Sync markers with reports */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const currentIds = new Set(reports.map((r) => r.id));

    // Remove markers no longer in filtered reports
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add or update markers
    reports.forEach((report) => {
      const existing = markersRef.current.get(report.id);

      if (existing) {
        existing.setLngLat([report.gps.lng, report.gps.lat]);
      } else {
        const style = getMarkerStyle(report);
        const el = createMarkerElement(style.fill, style.glow);

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectReport(report.id);
          openPopupRef.current(report);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([report.gps.lng, report.gps.lat])
          .addTo(map);

        markersRef.current.set(report.id, marker);
      }
    });
  }, [reports, onSelectReport, mapLoaded]);

  /* Fly to selected report */
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;

    const report = reports.find((r) => r.id === selectedId);
    if (!report) return;

    mapRef.current.flyTo({
      center: [report.gps.lng, report.gps.lat],
      zoom: 15,
      duration: 1200,
      essential: true,
    });

    openPopup(report);
  }, [selectedId, reports, openPopup]);

  return (
    <>
      <div ref={containerRef} className="map-container" />

      {/* Custom popup & control styling */}
      <style>{`
        .chist-popup .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          border-radius: 16px !important;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(255, 77, 148, 0.2) !important;
          overflow: hidden;
        }
        .chist-popup .maplibregl-popup-tip {
          border-top-color: #0F172A !important;
        }
        .chist-popup .maplibregl-popup-close-button {
          color: rgba(255,255,255,0.4) !important;
          font-size: 20px !important;
          right: 10px !important;
          top: 10px !important;
          z-index: 10 !important;
          width: 28px !important;
          height: 28px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .chist-popup .maplibregl-popup-close-button:hover {
          color: #FF4D94 !important;
          background: transparent !important;
        }
        .maplibregl-ctrl-attrib {
          background: rgba(15, 23, 42, 0.7) !important;
          color: rgba(255,255,255,0.3) !important;
          font-size: 10px !important;
        }
        .maplibregl-ctrl-attrib a {
          color: rgba(255,255,255,0.4) !important;
        }
        .maplibregl-ctrl-group {
          background: rgba(15, 23, 42, 0.85) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
        }
        .maplibregl-ctrl-group button {
          width: 42px !important;
          height: 42px !important;
        }
        .maplibregl-ctrl-group button + button {
          border-top: 1px solid rgba(255,255,255,0.08) !important;
        }
        .maplibregl-ctrl-group button span {
          filter: invert(1) !important;
        }
      `}</style>
    </>
  );
}
