/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  /** Demo público (Cloudflare Pages): auto-login y sin pantalla de login. */
  readonly VITE_DEMO_NO_AUTH?: string
  readonly VITE_DEMO_LOGIN?: string
  readonly VITE_DEMO_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
