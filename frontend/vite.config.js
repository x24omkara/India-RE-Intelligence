import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function portFromPublicUrl(urlString) {
  if (!urlString || typeof urlString !== "string") return undefined;
  try {
    const u = new URL(urlString);
    if (u.port) return Number(u.port);
    return u.protocol === "https:" ? 443 : 80;
  } catch {
    return undefined;
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const devPort = portFromPublicUrl(env.FRONTEND_URL_LOCAL);

  return {
    plugins: [react()],
    envDir: rootDir,
    ...(devPort ? { server: { port: devPort } } : {}),
  };
});
