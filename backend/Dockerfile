FROM php:8.2-cli-alpine

RUN apk add --no-cache \
    sqlite-libs \
    libzip-dev \
    oniguruma-dev \
    libxml2-dev \
    && docker-php-ext-install \
    pdo \
    pdo_sqlite \
    mbstring \
    bcmath \
    xml \
    zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

COPY . .

RUN composer dump-autoload --optimize \
    && chmod +x docker/render-start.sh

ENV PORT=8080
EXPOSE 8080

CMD ["docker/render-start.sh"]
