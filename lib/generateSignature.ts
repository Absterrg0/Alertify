
import crypto from "crypto";

export function generateSignature(payload: any, apiKey: string): string {
  const hmac = crypto.createHmac("sha256", apiKey);
  hmac.update(JSON.stringify(payload));
  return hmac.digest("hex");
}