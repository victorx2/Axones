import { loginRequest } from "@/lib/api"
import { getStoredToken, getStoredUser, setAuthSession } from "@/lib/auth-storage"
import { isDemoNoAuthEnabled } from "@/lib/demo-auth-flag"

export { isDemoNoAuthEnabled } from "@/lib/demo-auth-flag"

function demoLogin(): string {
  return (import.meta.env.VITE_DEMO_LOGIN ?? "boss").toString().trim() || "boss"
}

function demoPassword(): string {
  return (import.meta.env.VITE_DEMO_PASSWORD ?? "password").toString().trim() || "password"
}

export function hasDemoSession(): boolean {
  return Boolean(getStoredToken() && getStoredUser())
}

/**
 * Inicia sesión silenciosa como usuario demo (boss) para mostrar la app sin pantalla de login.
 * Reintenta por el cold start de Render.
 */
export async function ensureDemoSession(options?: {
  retries?: number
  delayMs?: number
}): Promise<"ok" | "failed"> {
  if (!isDemoNoAuthEnabled()) return "ok"
  if (hasDemoSession()) return "ok"

  const retries = options?.retries ?? 10
  const delayMs = options?.delayMs ?? 2000
  const login = demoLogin()
  const password = demoPassword()

  let lastMessage = ""
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const data = await loginRequest(login, password)
      setAuthSession(data.token, data.user)
      return "ok"
    } catch (e) {
      lastMessage = e instanceof Error ? e.message : "Error de login demo"
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, delayMs))
      }
    }
  }

  console.warn("[demo-auth] no se pudo auto-iniciar sesión:", lastMessage)
  return "failed"
}
