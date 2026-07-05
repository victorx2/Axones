/**
 * Cloudflare Pages (raíz): SPA en `/` con fallback estático.
 * Ejecutar después de `npm run build` (base `/`, no `/axones/`).
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist")
const redirects = path.join(dist, "_redirects")

if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("prep-pages-root: falta dist/index.html. Ejecuta antes: npm run build")
  process.exit(1)
}

fs.writeFileSync(redirects, "/* /index.html 200\n", "utf8")
console.log("prep-pages-root: _redirects listo para Cloudflare Pages (raíz /)")
