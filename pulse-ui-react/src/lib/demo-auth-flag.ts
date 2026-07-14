/** Hosts públicos de demo (Cloudflare Pages). En planta/local no aplican. */
function isPublicDemoHost(): boolean {
  if (typeof window === "undefined") return false
  const host = window.location.hostname.toLowerCase()
  return (
    host === "axones.pages.dev" ||
    host.endsWith(".axones.pages.dev") ||
    host === "axones-ui.pages.dev" ||
    host.endsWith(".axones-ui.pages.dev")
  )
}

/**
 * Demo público sin login.
 * Activo si VITE_DEMO_NO_AUTH=1 en el build, o si el visitante está en axones.pages.dev.
 * En planta/local (sin esa flag y sin ese host) el login sigue normal.
 */
export function isDemoNoAuthEnabled(): boolean {
  const v = (import.meta.env.VITE_DEMO_NO_AUTH ?? "").toString().trim().toLowerCase()
  if (v === "1" || v === "true" || v === "yes" || v === "on") return true
  if (v === "0" || v === "false" || v === "no" || v === "off") return false
  return isPublicDemoHost()
}
