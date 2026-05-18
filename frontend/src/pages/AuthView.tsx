import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import "../styles/AuthView.css";
import { authApi } from "../services/api.ts";
import { Mail, Lock, User, MapPin, Sparkles, Trophy, Leaf } from "lucide-react";

interface FieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon?: LucideIcon;
}

function Field({ label, type = "text", value, onChange, placeholder, icon: Icon }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="auth__field">
      <label className="label-caps auth__field-label">{label}</label>
      <div className="auth__field-wrap">
        {Icon && (
          <span className="auth__field-icon">
            <Icon size={15} strokeWidth={1.8} />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-field ${Icon ? "auth__field-input" : ""}`}
          style={{ borderColor: focused ? "var(--accent-pink)" : undefined }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

interface FormProps {
  onSuccess: () => void;
  onSwitch: () => void;
}

function LoginForm({ onSuccess, onSwitch }: FormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email || !password) {
      setError("Fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    // realno trqq se iztrie ama mai pak sh go polzvam
    //if (email === "test@chist.bg" && password === "test1234") {
    //  localStorage.setItem("cw_token", "mock-dev-token");
    //  setTimeout(() => onSuccess(), 400);
    //  return;
    //}

    try {
      const res = await authApi.login(email, password);
      if (res?.token) {
        localStorage.setItem("cw_token", res.token);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => e.key === "Enter" && submit();

  return (
    <>
      <Field
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon={Mail}
      />
      <div onKeyDown={handleKey}>
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          icon={Lock}
          type="password"
        />
      </div>
      {error && <div className="error-box">{error}</div>}
      <button
        className="btn-primary auth__submit"
        onClick={submit}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner">⟳</span> Logging in...
          </>
        ) : (
          "LOG IN"
        )}
      </button>
      <p className="auth__switch">
        <button className="auth__switch-btn" onClick={onSwitch}>
          Don't have an account? REGISTER →
        </button>
      </p>
    </>
  );
}

function RegisterForm({ onSuccess, onSwitch }: FormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!username || !email || !password) {
      setError("Fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");

    // Mock registration for local testing
    if (email === "test@chist.bg") {
      localStorage.setItem("cw_token", "mock-dev-token");
      setTimeout(() => onSuccess(), 400);
      return;
    }

    try {
      const res = await authApi.register({ email, username, password });
      if (res?.token) {
        localStorage.setItem("cw_token", res.token);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Field
        label="Username"
        value={username}
        onChange={setUsername}
        placeholder="GreenWarrior99"
        icon={User}
      />
      <Field
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon={Mail}
      />
      <Field
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="min. 8 characters"
        icon={Lock}
        type="password"
      />
      <Field
        label="Confirm password"
        value={confirm}
        onChange={setConfirm}
        placeholder="••••••••"
        icon={Lock}
        type="password"
      />
      {error && <div className="error-box">{error}</div>}
      <button
        className="btn-primary auth__submit"
        onClick={submit}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner">⟳</span> Registering...
          </>
        ) : (
          "CREATE ACCOUNT"
        )}
      </button>
      <p className="auth__switch">
        <button className="auth__switch-btn" onClick={onSwitch}>
          ← ALREADY HAVE AN ACCOUNT
        </button>
      </p>
    </>
  );
}

export default function AuthView({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__logo">
          <div className="auth__logo-icon anim-float">
            <Leaf size={32} strokeWidth={1.8} />
          </div>
          <div className="auth__logo-wordmark">CHIST</div>
          <div className="auth__logo-sub">SOFIA · CLEANER CITY</div>
        </div>

        <div className="auth__tabs">
          {[
            { id: "login", label: "LOGIN" },
            { id: "register", label: "REGISTER" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`auth__tab ${
                mode === tab.id ? "auth__tab--active" : "auth__tab--inactive"
              }`}
              onClick={() => setMode(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mode === "login" ? (
          <LoginForm
            onSuccess={onAuthenticated}
            onSwitch={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={onAuthenticated}
            onSwitch={() => setMode("login")}
          />
        )}

        <div className="auth__features">
          <div className="auth__feature-item">
            <MapPin size={14} strokeWidth={1.8} />
            Report pollution
          </div>
          <div className="auth__feature-item">
            <Sparkles size={14} strokeWidth={1.8} />
            Clean up & earn points
          </div>
          <div className="auth__feature-item">
            <Trophy size={14} strokeWidth={1.8} />
            Compete & win rewards
          </div>
        </div>
      </div>

      <div className="auth__footer">
        © 2025 CHIST · GRUPA LOM · SOFIA, BG
      </div>
    </div>
  );
}
