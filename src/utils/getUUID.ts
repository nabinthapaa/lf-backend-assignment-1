import crypto from "crypto";

export function getUUID() {
  return crypto.randomUUID();
}
