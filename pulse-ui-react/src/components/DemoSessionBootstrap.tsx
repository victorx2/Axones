import { useEffect, useState, type ReactNode } from "react"

import { AxonesBrandMark } from "@/components/axones/AxonesBrandMark"
import {
  ensureDemoSession,
  hasDemoSession,
  isDemoNoAuthEnabled,
} from "@/lib/demo-auth"

/**
 * En demos públicos (VITE_DEMO_NO_AUTH) entra con sesión automática
 * y evita mostrar el formulario de login.
 */
export function DemoSessionBootstrap({ children }: { children: ReactNode }) {
  const demo = isDemoNoAuthEnabled()
  const [ready, setReady] = useState(() => !demo || hasDemoSession())
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!demo || hasDemoSession()) {
      setReady(true)
      return
    }

    let cancelled = false
    void (async () => {
      const result = await ensureDemoSession()
      if (cancelled) return
      if (result === "ok") {
        setReady(true)
        setFailed(false)
      } else {
        setFailed(true)
        setReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [demo])

  if (!ready) {
    return (
      <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-primary/[0.06] via-muted/40 to-background p-6">
        <AxonesBrandMark fill variant="icon" className="max-w-xs" />
        <p className="text-center text-sm text-muted-foreground">
          Entrando al demo de Axones…
          <span className="mt-1 block text-xs opacity-80">
            Si el API estaba dormido, puede tardar unos segundos.
          </span>
        </p>
      </div>
    )
  }

  if (failed && demo && !hasDemoSession()) {
    return (
      <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-primary/[0.06] via-muted/40 to-background p-6">
        <AxonesBrandMark fill variant="icon" className="max-w-xs" />
        <p className="max-w-md text-center text-sm text-muted-foreground">
          El API demo está despertando o no responde. Recarga la página en unos segundos.
        </p>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return children
}
