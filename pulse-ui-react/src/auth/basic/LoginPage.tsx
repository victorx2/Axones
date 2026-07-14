import { Navigate } from "react-router-dom"

import { AuthPageShell } from "@/components/auth/AuthPageShell"
import { LoginForm } from "@/components/login-form"
import { PwaInstallGuide } from "@/components/pwa-install-guide"
import { isDemoNoAuthEnabled } from "@/lib/demo-auth-flag"

export default function LoginPage() {
  // Demo público: sin pantalla de login → directo a la app.
  if (isDemoNoAuthEnabled()) {
    return <Navigate to="/resumen" replace />
  }

  return (
    <AuthPageShell footer={<PwaInstallGuide />}>
      <LoginForm />
    </AuthPageShell>
  )
}
