# Demo Axones 100% gratis (Cloudflare Pages + Render)

Guía para publicar un demo en internet **sin pagar**, usando tu repo [victorx2/Axones](https://github.com/victorx2/Axones).

| Parte | Servicio | Costo | URL ejemplo |
|-------|----------|-------|-------------|
| Frontend React | [Cloudflare Pages](https://pages.cloudflare.com) | Gratis | `https://axones-ui.pages.dev` |
| API Laravel | [Render](https://render.com) | Gratis* | `https://axones-api.onrender.com` |

\* El plan free de Render **se duerme** tras ~15 min sin visitas. La primera carga puede tardar **1–2 minutos** mientras despierta.

---

## Parte 1 — API en Render (backend)

### 1. Crear cuenta

Entra a [render.com](https://render.com) e inicia sesión con GitHub.

### 2. Desplegar con Blueprint (recomendado)

1. **New** → **Blueprint**
2. Conecta el repo **victorx2/Axones**
3. Render detectará `render.yaml` y creará el servicio **axones-api**
4. Confirma y espera el deploy (5–10 min la primera vez)

### 3. Alternativa manual (sin Blueprint)

1. **New** → **Web Service**
2. Repo: **victorx2/Axones**
3. **Root Directory:** `backend`
4. **Runtime:** Docker
5. **Instance type:** Free
6. Variables de entorno (Environment):

| Variable | Valor |
|----------|--------|
| `APP_ENV` | `local` |
| `APP_DEBUG` | `false` |
| `APP_LOCALE` | `es` |
| `LOG_CHANNEL` | `stderr` |
| `DB_CONNECTION` | `sqlite` |
| `DB_DATABASE` | `/app/database/database.sqlite` |
| `SESSION_DRIVER` | `file` |
| `CACHE_STORE` | `file` |
| `QUEUE_CONNECTION` | `sync` |
| `AXONES_ASSISTANT_ENABLED` | `false` |
| `AXONES_PRUEBA_SEED` | `1` |
| `APP_KEY` | *(Generate)* |

7. **Health Check Path:** `/up`
8. Crea el servicio

### 4. Probar la API

Cuando el deploy termine en verde, abre:

```text
https://TU-SERVICIO.onrender.com/up
```

Debe responder `200 OK`. Guarda la URL base (sin `/up`), por ejemplo:

```text
https://axones-api.onrender.com
```

---

## Parte 2 — Frontend en Cloudflare Pages

### 1. Crear cuenta

Entra a [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.

### 2. Conectar GitHub

- Repo: **victorx2/Axones**
- **Project name:** `axones-ui` (o el que prefieras)

### 3. Configuración de build

| Campo | Valor |
|-------|--------|
| **Production branch** | `main` |
| **Root directory** | `pulse-ui-react` |
| **Build command** | `npm ci && npm run build:pages` |
| **Build output directory** | `dist` |

### 4. Variable de entorno (obligatoria)

En **Settings → Environment variables** (Production):

| Nombre | Valor |
|--------|--------|
| `VITE_API_BASE_URL` | `https://TU-SERVICIO.onrender.com/api` |

*(Sustituye por la URL real de Render del paso anterior.)*

### 5. Deploy

Guarda y espera el build. La URL será algo como:

```text
https://axones-ui.pages.dev
```

### 6. Probar el demo

Abre en el navegador:

```text
https://axones-ui.pages.dev/auth/basic/login
```

**Usuarios demo** (contraseña: `password`):

| Rol | Email |
|-----|--------|
| Jefe | `boss@axones.local` |
| Inventario | `inventario@axones.local` |
| Impresión | `impresion@axones.local` |

---

## Compartir en tu portafolio

En GitHub, README o LinkedIn puedes poner:

- **Código:** https://github.com/victorx2/Axones  
- **Demo en vivo:** https://axones-ui.pages.dev/auth/basic/login  

*(Actualiza con tus URLs reales.)*

---

## Limitaciones del plan gratis

1. **Render se duerme:** la primera visita tras inactividad tarda ~1–2 min.
2. **SQLite efímero:** en Render free los datos demo se recrean al redeploy; no uses datos reales de fábrica.
3. **Sin cola en background:** jobs en cola no corren (no afecta el recorrido básico del demo).
4. **Asistente IA desactivado** en demo (`AXONES_ASSISTANT_ENABLED=false`).

---

## Solución de problemas

| Problema | Qué revisar |
|----------|-------------|
| Login falla / “Network error” | `VITE_API_BASE_URL` debe terminar en `/api` y apuntar a Render despierto |
| Pantalla en blanco | Rebuild en Cloudflare tras cambiar `VITE_API_BASE_URL` |
| API 502 / timeout | Espera a que Render termine de despertar; prueba `/up` |
| CORS | El backend ya permite orígenes amplios; no debería bloquear Pages |

---

## Actualizar el demo

Cada `git push` a `main`:

- **Cloudflare Pages** redeploya el front automáticamente.
- **Render** redeploya el API si tienes auto-deploy activado (por defecto sí).
