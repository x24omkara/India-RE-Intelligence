/**
 * Generate APP_PASSWORD_HASH for .env (Argon2id via `argon2` package).
 *
 * Usage (from repo root):
 *   npm run hash-password -- "your-plain-password"
 *
 * In .env (quote the value so $ is not mangled):
 *   APP_PASSWORD_HASH="$argon2id$v=19$m=65536,t=3,p=4$..."
 */
import { hashPassword } from "./passwordHash.js";

const plain = process.argv[2];
if (typeof plain !== "string" || !plain.length) {
  console.error('Usage: npm run hash-password -- "your-password"');
  process.exit(1);
}

console.log(await hashPassword(plain));
