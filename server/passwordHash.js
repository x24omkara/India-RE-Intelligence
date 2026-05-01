import argon2 from "argon2";

/**
 * Argon2id (OWASP-aligned defaults). Output is a PHC string for APP_PASSWORD_HASH, e.g.
 * $argon2id$v=19$m=65536,t=3,p=4$...
 */
const HASH_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
};

/**
 * @param {string} plain
 * @returns {Promise<string>}
 */
export async function hashPassword(plain) {
  if (typeof plain !== "string" || !plain.length) {
    throw new Error("Password must be a non-empty string.");
  }
  return argon2.hash(plain, HASH_OPTIONS);
}

/**
 * @param {string} plain
 * @param {string} stored — full PHC string from hashPassword()
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plain, stored) {
  if (typeof plain !== "string" || typeof stored !== "string" || !stored.length) {
    return false;
  }
  try {
    return await argon2.verify(stored, plain);
  } catch {
    return false;
  }
}

export function isAppPasswordHashFormat(value) {
  return typeof value === "string" && value.startsWith("$argon2id$");
}
