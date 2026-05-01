import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import KhavdaDashboard from "./Dashboards/KhavdaDashboard";
import AvaadaDashboard from "./Dashboards/AvaadaREintelligence";
import { resolveApiBaseUrl } from "./apiBase";
import logoUrl from "./assets/logo.png";

const API_BASE = resolveApiBaseUrl();

async function apiFetch(path, options = {}) {
  if (!API_BASE) {
    throw new Error("API base URL is not configured");
  }
  const headers = { ...options.headers };
  if (options.body && typeof options.body === "string" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });
}

function LoginForm({ onSubmit, error }) {
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(password);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        padding: 16,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h1 style={{ margin: 0, marginBottom: 8, fontSize: 22 }}>Access Dashboard</h1>
        <p style={{ margin: 0, marginBottom: 16, color: "#4b5563", fontSize: 14 }}>
          Sign in with the shared password.
          {import.meta.env.DEV ? (
            <span style={{ display: "block", marginTop: 6, fontSize: 12, color: "#6b7280" }}>
              Dev API: {API_BASE}
            </span>
          ) : null}
        </p>

        <label
          htmlFor="password"
          style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />

        {error ? (
          <p style={{ marginTop: 0, marginBottom: 12, color: "#dc2626", fontSize: 13 }}>
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "none",
            borderRadius: 8,
            background: "#111827",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Unlock
        </button>
      </form>
    </main>
  );
}

const UI = {
  font: "'Inter', system-ui, sans-serif",
  text: "#1a1f36",
  muted: "#64748b",
  border: "#dde1ee",
  overlay: "rgba(15,23,42,0.45)",
  primary: "#0077b6",
};

export default function App() {
  const [gate, setGate] = useState(() => (API_BASE ? "loading" : "config"));
  const [loginError, setLoginError] = useState("");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    if (!API_BASE) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/api/auth/me");
        if (!res.ok) {
          if (!cancelled) {
            setGate("out");
            setLoginError(
              `API responded with HTTP ${res.status} at ${API_BASE}. Check the server and reverse proxy. If the browser console shows a CORS error, add your app origin (${typeof window !== "undefined" ? window.location.origin : "this site"}) to the API’s FRONTEND_URL_* env and restart the API.`
            );
          }
          return;
        }
        let data;
        try {
          data = await res.json();
        } catch {
          if (!cancelled) {
            setGate("out");
            setLoginError(`API at ${API_BASE} returned a non-JSON response. Check the server and proxy configuration.`);
          }
          return;
        }
        if (cancelled) return;
        setGate(data.authenticated ? "in" : "out");
      } catch (e) {
        if (!cancelled) {
          setGate("out");
          const origin =
            typeof window !== "undefined" ? window.location.origin : "your app origin";
          const isNetwork =
            e instanceof TypeError ||
            (typeof e?.message === "string" && e.message.toLowerCase().includes("fetch"));
          setLoginError(
            isNetwork
              ? `Could not reach API at ${API_BASE}. Usually: CORS (allow ${origin} on the API), wrong URL, or offline. After changing root \`.env\`, restart Vite (\`npm run dev\`).`
              : `Could not reach API at ${API_BASE}: ${e?.message || "Unknown error"}.`
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!logoutConfirmOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLogoutConfirmOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [logoutConfirmOpen]);

  async function handleLogin(password) {
    setLoginError("");
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setGate("in");
      return;
    }
    setLoginError("Incorrect password. Please try again.");
  }

  async function confirmLogout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setLogoutConfirmOpen(false);
    setGate("out");
  }

  if (gate === "loading") {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>Loading…</div>
    );
  }

  if (gate === "config") {
    return (
      <div style={{ padding: 24, maxWidth: 560, fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 18, marginTop: 0 }}>API URL not configured</h1>
        <p style={{ marginBottom: 12 }}>
          Add these to the repository root <code>.env</code> (no hard-coded URLs in code):
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <code>VITE_LOCAL_API_URL</code> — backend when you open the app on{" "}
            <code>localhost</code> / <code>127.0.0.1</code>
          </li>
          <li>
            <code>VITE_PRODUCTION_API_URL</code> — backend when deployed (HTTPS)
          </li>
          <li>
            Optional (deployed app only): <code>VITE_API_BASE_URL</code> overrides production API; localhost always uses{" "}
            <code>VITE_LOCAL_API_URL</code>
          </li>
        </ul>
      </div>
    );
  }

  if (gate === "out") {
    return <LoginForm onSubmit={handleLogin} error={loginError} />;
  }

  return (
    <BrowserRouter>
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: 4,
            flexShrink: 0,
            textDecoration: "none",
          }}
          title="RE-Intelligence"
        >
          <img
            src={logoUrl}
            alt="Avaada"
            style={{
              height: 36,
              width: "auto",
              maxWidth: 160,
              objectFit: "contain",
              display: "block",
            }}
          />
        </Link>
        <Link to="/">Khavda Transmission</Link>
        <Link to="/avaada">Avaada Intelligence</Link>
        <button
          type="button"
          onClick={() => setLogoutConfirmOpen(true)}
          style={{
            marginLeft: "auto",
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: UI.font,
          }}
        >
          Log out
        </button>
      </div>

      <Routes>
        <Route path="/" element={<KhavdaDashboard />} />
        <Route path="/avaada" element={<AvaadaDashboard />} />
      </Routes>

      {logoutConfirmOpen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: UI.overlay,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            fontFamily: UI.font,
          }}
          onClick={() => setLogoutConfirmOpen(false)}
          role="presentation"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              maxWidth: 400,
              width: "100%",
              padding: "22px 24px",
              boxShadow: "0 12px 40px rgba(0,0,0,.15)",
              border: `1px solid ${UI.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
          >
            <h2
              id="logout-confirm-title"
              style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: UI.text }}
            >
              Log out?
            </h2>
            <p style={{ margin: 0, color: UI.muted, fontSize: 14, lineHeight: 1.55 }}>
              You will need the password to sign in again.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid #c7cbe0",
                  background: "#fff",
                  color: "#1f2a44",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: UI.font,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmLogout()}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  background: UI.primary,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: UI.font,
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </BrowserRouter>
  );
}
