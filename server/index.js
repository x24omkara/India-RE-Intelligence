import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { createDashboardDataRouter } from "./dashboardDataRoutes.js";
import { isAppPasswordHashFormat, verifyPassword } from "./passwordHash.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();

const PORT = Number(process.env.PORT);
/** Argon2id PHC string from: npm run hash-password -- "your-password" */
const APP_PASSWORD_HASH =
  typeof process.env.APP_PASSWORD_HASH === "string" ? process.env.APP_PASSWORD_HASH.trim() : "";
const SESSION_SECRET = process.env.SESSION_SECRET;
const isProd = process.env.NODE_ENV === "production";

function trimOrigin(url) {
  if (typeof url !== "string") return "";
  return url.trim().replace(/\/$/, "");
}

function collectAllowedOrigins() {
  const chunks = [
    process.env.FRONTEND_URL_LOCAL,
    process.env.FRONTEND_URL_PRODUCTION,
    process.env.FRONTEND_URL,
    process.env.FRONTEND_ORIGIN,
  ]
    .flatMap((v) => (v ? v.split(",") : []))
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set(chunks)];
}

const allowedOrigins = collectAllowedOrigins();

const backendDisplay =
  trimOrigin(process.env.BACKEND_URL) ||
  (isProd ? trimOrigin(process.env.BACKEND_URL_PRODUCTION) : trimOrigin(process.env.BACKEND_URL_LOCAL));

const cookieSameSite = process.env.SESSION_COOKIE_SAME_SITE || "lax";
const cookieSecure =
  process.env.SESSION_COOKIE_SECURE === "true" ||
  (process.env.SESSION_COOKIE_SECURE !== "false" && isProd);

const sessionCookie = {
  httpOnly: true,
  sameSite: cookieSameSite,
  secure: cookieSecure,
  maxAge: 1000 * 60 * 60 * 8,
};

if (!Number.isFinite(PORT) || PORT <= 0) {
  console.error("PORT must be set to a positive number in .env.");
  process.exit(1);
}

if (!APP_PASSWORD_HASH) {
  console.error(
    "APP_PASSWORD_HASH is missing. Generate one with: npm run hash-password -- \"your-password\"\n" +
      "Then set APP_PASSWORD_HASH in .env to the printed value (scrypt1$...)."
  );
  process.exit(1);
}

if (/^\$2[aby]\$/.test(APP_PASSWORD_HASH)) {
  console.error(
    "APP_PASSWORD_HASH looks like bcrypt. This app now uses Node.js scrypt only.\n" +
      "Regenerate with: npm run hash-password -- \"your-password\" and update .env."
  );
  process.exit(1);
}

if (!isAppPasswordHashFormat(APP_PASSWORD_HASH)) {
  console.error(
    "APP_PASSWORD_HASH must be a scrypt1$ hash from: npm run hash-password -- \"your-password\""
  );
  process.exit(1);
}

if (!SESSION_SECRET) {
  console.error("SESSION_SECRET is missing in environment variables.");
  process.exit(1);
}

if (allowedOrigins.length === 0) {
  console.error(
    "Set at least one frontend origin: FRONTEND_URL_LOCAL, FRONTEND_URL_PRODUCTION, and/or FRONTEND_URL (comma-separated)."
  );
  process.exit(1);
}

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    exposedHeaders: ["Last-Modified", "X-Dashboard-File-Updated-At"],
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    name: "dashboard.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: sessionCookie,
  })
);

app.post("/api/auth/login", async (req, res) => {
  const { password } = req.body || {};

  if (typeof password !== "string" || !password.trim()) {
    return res.status(400).json({ ok: false, message: "Password is required." });
  }

  try {
    const match = await verifyPassword(password, APP_PASSWORD_HASH);
    if (!match) {
      return res.status(401).json({ ok: false, message: "Incorrect password." });
    }
  } catch (e) {
    console.error("login verifyPassword", e);
    return res.status(500).json({ ok: false, message: "Login could not be verified." });
  }

  req.session.isAuthenticated = true;
  return res.json({ ok: true });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("dashboard.sid", {
      path: "/",
      httpOnly: true,
      sameSite: cookieSameSite,
      secure: cookieSecure,
    });
    res.json({ ok: true });
  });
});

app.get("/api/auth/me", (req, res) => {
  const authenticated = Boolean(req.session?.isAuthenticated);
  res.json({ ok: true, authenticated });
});

app.use((req, res, next) => {
  const publicPaths = ["/api/auth/login"];
  const isPublic = publicPaths.includes(req.path);

  if (isPublic || req.session?.isAuthenticated) {
    return next();
  }

  if (req.path.startsWith("/api/")) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  return res.status(404).json({ ok: false, message: "Not found" });
});

app.use("/api/dashboard-data", createDashboardDataRouter());

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Not found" });
});

app.listen(PORT, () => {
  if (backendDisplay) {
    console.log(`API public URL (from env): ${backendDisplay} (listening on port ${PORT})`);
  } else {
    console.log(
      `API listening on port ${PORT} (set BACKEND_URL, BACKEND_URL_LOCAL, or BACKEND_URL_PRODUCTION for log label)`
    );
  }
  console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
});
