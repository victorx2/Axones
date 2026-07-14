/** Solo para build de demo (Cloudflare Pages). En planta/local debe quedar desactivado. */
export function isDemoNoAuthEnabled(): boolean {
  const v = (import.meta.env.VITE_DEMO_NO_AUTH ?? "").toString().trim().toLowerCase()
  return v === "1" || v === "true" || v === "yes" || v === "on"
}
