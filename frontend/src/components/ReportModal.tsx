import { useState, useRef, useEffect, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/ReportModal.css";
import { SEVERITY_META } from "../data/constants.ts";
import { useApp } from "../context/AppContext.tsx";
import { reportsApi, aiApi } from "../services/api.ts";
import { Camera, Loader2, CheckCircle, CircleX, MapPinned, MapPin, X, PartyPopper, Check, Bot } from "lucide-react";
import DataIcon from "./DataIcon.tsx";

const ICON_CHOICES = [
  "tree-pine", "trash", "alert-triangle", "sparkles", "armchair",
  "cigarette", "hard-hat", "waves", "palette", "battery-warning",
] as const;

interface FormData {
  photoFile: File | null;
  photoUrl: string | null;
  aiVerified: boolean;
  latitude: number | null;
  longitude: number | null;
  description: string;
  severity: string;
  img: string;
}

/* --- Step progress bar --- */
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="step-bar">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`step-bar__segment ${
            i < current ? "step-bar__segment--done" : "step-bar__segment--pending"
          }`}
        />
      ))}
    </div>
  );
}

/* --- Step 1: Photo Upload + AI Verification --- */
interface Step1Props {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onNext: () => void;
}

function Step1Photo({ data, onChange, onNext }: Step1Props) {
  const [dragging, setDragging] = useState(false);
  const [aiState, setAiState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [aiMessage, setAiMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (f: File | undefined) => {
      if (!f?.type.startsWith("image/")) return;

      const previewUrl = URL.createObjectURL(f);
      onChange({ photoFile: f, photoUrl: previewUrl });

      setAiState("loading");
      setAiMessage("");

      try {
        const fd = new FormData();
        fd.append("image", f);
        const result = await aiApi.verifyImage(fd);

        if (result && (result.status === "APPROVED" || result.isTrash === true || result.verified === true)) {
          setAiState("success");
          setAiMessage(result.confidence ? `${Math.round(result.confidence * 100)}%` : "");
          onChange({ aiVerified: true });
        } else {
          setAiState("error");
          setAiMessage("");
          onChange({ aiVerified: false });
        }
      } catch {
        setAiState("error");
        setAiMessage("Verification failed — try again.");
        onChange({ aiVerified: false });
      }
    },
    [onChange],
  );

  const canProceed = data.photoFile && (aiState === "success" || aiState === "error");

  return (
    <div className="anim-fade-up">
      <label className="label-caps" style={{ marginBottom: 8, display: "block" }}>
        Upload photo
      </label>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-muted)",
          marginBottom: 12,
        }}
      >
        AI will verify if the image contains trash.
      </p>

      <div
        className={`drop-zone ${dragging ? "drop-zone--dragging" : ""} ${
          data.photoUrl ? "drop-zone--has-file" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
      >
        {data.photoUrl ? (
          <img
            src={data.photoUrl}
            alt="Preview"
            style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
          />
        ) : (
          <>
            <span className="drop-zone__icon"><Camera size={32} strokeWidth={1.5} /></span>
            <span className="drop-zone__label">Tap or drag a photo</span>
            <span className="drop-zone__hint">JPEG, PNG, HEIC — max. 20MB</span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* AI verification widget */}
      {aiState !== "idle" && (
        <div
          className={`report-modal__ai-check report-modal__ai-check--${aiState}`}
          style={{ marginTop: 14 }}
        >
          <span style={{ display: "inline-flex" }}>
            {aiState === "loading" ? <Loader2 size={20} strokeWidth={2} className="spinner" /> : aiState === "success" ? <CheckCircle size={20} strokeWidth={2} /> : <CircleX size={20} strokeWidth={2} />}
          </span>
          <div>
            <div className="report-modal__ai-title">
              {aiState === "loading" && "Azure Computer Vision"}
              {aiState === "success" && "Trash detected"}
              {aiState === "error" && "No trash detected"}
            </div>
            <div className="report-modal__ai-status">
              {aiState === "loading" && (
                <span className="ai-pulse">Analyzing image...</span>
              )}
              {aiState === "success" && "Image verified — trash confirmed"}
              {aiState === "error" &&
                "AI did not detect trash. Please upload a different photo."}
            </div>
          </div>
          {aiState === "success" && aiMessage && (
            <div className="report-modal__ai-score">{aiMessage}</div>
          )}
        </div>
      )}

      <button
        className="btn-primary"
        disabled={!canProceed}
        style={{
          marginTop: 20,
          width: "100%",
          padding: 13,
          fontSize: 13,
          opacity: canProceed ? 1 : 0.38,
        }}
        onClick={onNext}
      >
        NEXT →
      </button>
    </div>
  );
}

/* --- Step 2: Full-screen Map Picker --- */
interface Step2Props {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function Step2MapPicker({ data, onChange, onConfirm, onCancel }: Step2Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(
    data.latitude ? { lat: data.latitude, lng: data.longitude! } : null,
  );

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
      "bottom-right",
    );

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setPin({ lat, lng });

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        const el = document.createElement("div");
        el.style.cursor = "pointer";
        el.style.width = "44px";
        el.style.height = "56px";
        el.style.filter = "drop-shadow(0 0 12px rgba(255,77,148,0.7))";
        el.innerHTML = `
          <svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 0C9.85 0 0 9.85 0 22c0 16.5 22 34 22 34s22-17.5 22-34C44 9.85 34.15 0 22 0z"
              fill="#FF4D94"/>
            <circle cx="22" cy="20" r="10" fill="white" fill-opacity="0.95"/>
            <circle cx="22" cy="20" r="6" fill="#FF4D94"/>
          </svg>
        `;

        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([lng, lat])
          .addTo(map);
        markerRef.current = marker;
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const handleConfirm = () => {
    if (!pin) return;
    onChange({ latitude: pin.lat, longitude: pin.lng });
    onConfirm();
  };

  return (
    <div className="map-picker-overlay">
      <div ref={containerRef} className="map-picker-overlay__map" />

      {/* Floating instruction */}
      <div className="map-picker-overlay__instruction">
        <span className="map-picker-overlay__instruction-icon"><MapPinned size={16} strokeWidth={2} /></span>
        <span className="map-picker-overlay__instruction-text">
          Tap on the map to place your report
        </span>
      </div>

      {/* Floating bottom card */}
      <div className="map-picker-overlay__bottom">
        <div className="map-picker-overlay__coords-label">Coordinates</div>
        {pin ? (
          <div className="map-picker-overlay__coords">
            {pin.lat.toFixed(6)}° N, {pin.lng.toFixed(6)}° E
          </div>
        ) : (
          <div className="map-picker-overlay__coords-empty">
            No location selected
          </div>
        )}
        <div className="map-picker-overlay__actions">
          <button
            className="btn-ghost"
            style={{ flex: 1, padding: 12, fontSize: 13 }}
            onClick={onCancel}
          >
            CANCEL
          </button>
          <button
            className="btn-primary"
            disabled={!pin}
            style={{
              flex: 2,
              padding: 12,
              fontSize: 13,
              opacity: pin ? 1 : 0.38,
            }}
            onClick={handleConfirm}
          >
            CONFIRM LOCATION
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- Step 3: Details + Review + Submit --- */
interface Step3Props {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

function Step3Details({ data, onChange, onBack, onSubmit, loading, error }: Step3Props) {
  const ok = data.description.trim().length > 5;

  return (
    <div className="anim-fade-up">
      {/* Preview strip: photo + coords + AI */}
      <div className="report-modal__preview-strip">
        {data.photoUrl && (
          <img
            src={data.photoUrl}
            alt="Report"
            className="report-modal__preview-strip-img"
          />
        )}
        <div className="report-modal__preview-strip-info">
          <div className="report-modal__preview-strip-coords">
            <MapPin size={12} strokeWidth={2} /> {data.latitude?.toFixed(4)}°N, {data.longitude?.toFixed(4)}°E
          </div>
          <div className="report-modal__preview-strip-ai"><CheckCircle size={12} strokeWidth={2} /> AI verified</div>
        </div>
      </div>

      <label className="label-caps" style={{ marginBottom: 8, display: "block" }}>
        Description
      </label>
      <textarea
        className="input-field"
        rows={3}
        value={data.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Describe the pollution — type, amount, hazard..."
      />

      <label
        className="label-caps"
        style={{ marginTop: 16, marginBottom: 0, display: "block" }}
      >
        Severity
      </label>
      <div className="report-modal__severity-grid">
        {Object.entries(SEVERITY_META).map(([k, v]) => (
          <button
            key={k}
            className={`report-modal__severity-btn ${
              data.severity === k ? "report-modal__severity-btn--active" : ""
            }`}
            style={{
              border: `1px solid ${data.severity === k ? v.color : v.border}`,
              background: data.severity === k ? v.bg : "transparent",
              color: v.color,
            }}
            onClick={() => onChange({ severity: k })}
          >
            {v.label}
          </button>
        ))}
      </div>

      <label
        className="label-caps"
        style={{ marginTop: 16, marginBottom: 8, display: "block" }}
      >
        Icon
      </label>
      <div className="report-modal__icon-grid">
        {ICON_CHOICES.map((name) => (
          <button
            key={name}
            className={`report-modal__icon-btn ${
              data.img === name ? "report-modal__icon-btn--active" : ""
            }`}
            onClick={() => onChange({ img: name })}
          >
            <DataIcon name={name} size={20} />
          </button>
        ))}
      </div>

      {error && (
        <div className="error-box" style={{ marginTop: 14 }}>
          {error}
        </div>
      )}

      <div className="report-modal__btn-row">
        <button
          className="btn-ghost"
          style={{ flex: 1, padding: 12, fontSize: 13 }}
          onClick={onBack}
        >
          ← BACK
        </button>
        <button
          className="btn-primary"
          style={{ flex: 2, padding: 12, fontSize: 13, opacity: ok && !loading ? 1 : 0.38 }}
          onClick={onSubmit}
          disabled={!ok || loading}
        >
          {loading ? (
            <>
              <Loader2 size={14} strokeWidth={2} className="spinner" /> Submitting...
            </>
          ) : (
            "SEND REPORT"
          )}
        </button>
      </div>
    </div>
  );
}

/* --- Main Modal --- */
interface ReportModalProps {
  onClose: () => void;
}

export default function ReportModal({ onClose }: ReportModalProps) {
  const { addReport } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    photoFile: null,
    photoUrl: null,
    aiVerified: false,
    latitude: null,
    longitude: null,
    description: "",
    severity: "medium",
    img: "map-pin",
  });

  const update = (patch: Partial<FormData>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError(null);

    try {
      const fd = new globalThis.FormData();
      if (form.photoFile) fd.append("image", form.photoFile);
      fd.append("latitude", String(form.latitude));
      fd.append("longitude", String(form.longitude));
      fd.append("description", form.description);
      fd.append("severity", form.severity);

      const result = await reportsApi.create(fd);

      // Add to local state so it appears on the map immediately
      addReport({
        reportId: result?.reportId,
        latitude: form.latitude,
        longitude: form.longitude,
        description: form.description,
        severity: form.severity,
        img: form.img,
        photoUrl: result?.photoUrl ?? form.photoUrl,
      });

      setLoading(false);
      setDone(true);
    } catch (err: unknown) {
      setLoading(false);
      setSubmitError((err as Error).message || "Submission failed. Please try again.");
    }
  };

  /* ── Swipe-to-close on mobile handle ── */
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragY = useRef(0);
  const dragging = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragY.current = e.touches[0].clientY;
    dragging.current = true;
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging.current || !sheetRef.current) return;
    const dy = e.touches[0].clientY - dragY.current;
    if (dy > 0) sheetRef.current.style.transform = `translateY(${dy}px)`;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!dragging.current || !sheetRef.current) return;
    dragging.current = false;
    const dy = e.changedTouches[0].clientY - dragY.current;
    sheetRef.current.style.transition = "transform 0.25s ease";
    if (dy > 100) {
      sheetRef.current.style.transform = `translateY(100%)`;
      setTimeout(onClose, 250);
    } else {
      sheetRef.current.style.transform = "";
    }
  }, [onClose]);

  // Step 2 is rendered as a full-screen overlay, outside the modal
  if (step === 2) {
    return (
      <Step2MapPicker
        data={form}
        onChange={update}
        onConfirm={() => setStep(3)}
        onCancel={() => setStep(1)}
      />
    );
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-sheet" ref={sheetRef}>
        <div
          className="modal-handle"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
        {done ? (
          <div className="success-screen">
            <div className="success-screen__emoji"><PartyPopper size={52} strokeWidth={1.5} /></div>
            <div className="success-screen__title">REPORT SENT!</div>
            <div className="success-screen__body">
              +15 points added.
              <br />
              Thanks for keeping Sofia clean!
            </div>
            <button
              className="btn-primary"
              style={{ marginTop: 28, padding: "12px 40px", fontSize: 13 }}
              onClick={onClose}
            >
              CLOSE
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <div className="modal-title">NEW REPORT</div>
                <div className="label-caps" style={{ marginTop: 3 }}>
                  STEP {step} OF 3
                </div>
              </div>
              <button className="modal-close" onClick={onClose}>
                <X size={14} strokeWidth={2} />
              </button>
            </div>
            <StepBar current={step} total={3} />
            {step === 1 && (
              <Step1Photo
                data={form}
                onChange={update}
                onNext={() => setStep(2)}
              />
            )}
            {step === 3 && (
              <Step3Details
                data={form}
                onChange={update}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                loading={loading}
                error={submitError}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
