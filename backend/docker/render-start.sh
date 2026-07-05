#!/bin/sh
set -e

cd /app

if [ -z "$APP_URL" ] && [ -n "$RENDER_EXTERNAL_URL" ]; then
  export APP_URL="$RENDER_EXTERNAL_URL"
fi

if [ -z "$APP_KEY" ]; then
  echo "render-start: generando APP_KEY (configura APP_KEY en Render para persistir sesiones)."
  php artisan key:generate --force --no-interaction
fi

mkdir -p database storage/framework/{cache,sessions,views} storage/logs bootstrap/cache
touch database/database.sqlite
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

php artisan migrate --force --no-interaction

USER_COUNT="$(php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
echo Illuminate\Support\Facades\Schema::hasTable('users')
  ? (string) Illuminate\Support\Facades\DB::table('users')->count()
  : '0';
" 2>/dev/null || echo 0)"

if [ "$USER_COUNT" = "0" ]; then
  echo "render-start: base vacía, cargando datos demo…"
  php artisan db:seed --force --no-interaction
fi

php artisan config:cache --no-interaction

echo "render-start: API en puerto ${PORT:-8080}"
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
