/**
 * Cloudflare Pages (raíz): SPA en `/`.
 * Cloudflare rechaza `/* /index.html 200` (bucle infinito); usamos 404.html = index.html.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist")
const index = path.join(dist, "index.html")
const notFound = path.join(dist, "404.html")
const redirects = path.join(dist, "_redirects")

if (!fs.existsSync(index)) {
  console.error("prep-pages-root: falta dist/index.html. Ejecuta antes: npm run build")
  process.exit(1)
}

fs.copyFileSync(index, notFound)
if (fs.existsSync(redirects)) {
  fs.unlinkSync(redirects)
}

console.log("prep-pages-root: 404.html listo para Cloudflare Pages (SPA en /)")
