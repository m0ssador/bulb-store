# Bulb Store

Учебный интернет-магазин лампочек на React, TypeScript и Vite. 

Проект представляет собой базовую маршрутизацию, каталог товаров, корзину и оформление заказа через FastAPI-бэкенд.

## Что реализовано

- Каталог товаров с поиском, фильтром по категории и сортировкой.
- Страница товара с характеристиками и добавлением в корзину.
- Корзина с изменением количества товаров и итоговой суммой.
- Оформление заказа через API сервиса заказов.
- Страница подтверждения заказа.
- Корзина на React Context с сохранением в `localStorage`.
- Моковые товары для демонстрации интерфейса без запущенного бэкенда.

## Стек

- React
- TypeScript
- Vite
- React Router DOM
- CSS Modules
- FastAPI-бэкенд из проекта [fast-api-sample](https://github.com/m0ssador/fast-api-sample)

## Структура проекта

```text
bulb-store/
  .env.example           # шаблон переменных (прокси к API); скопируйте в .env
  index.html              # HTML-оболочка для Vite
  public/                 # статика (favicon, др.)
  vite.config.ts          # прокси к API, настройки сборки
  src/
    assets/               # изображения для моков (импорт в Vite)
    components/
      icons/              # SVG-иконки (корзина, логотип)
      pages/              # страницы маршрутов + *.module.css
      Layout.tsx
      Layout.module.css
      ProductCard.tsx
      ProductCard.module.css
      Page.module.css     # общие классы страниц (шапка блока, уведомления, ссылки)
    mocks/
      fallbackProducts.ts # демо-товары и категории
    services/
      api.ts              # клиент каталога и заказов
      cart.tsx            # CartProvider
      cartContext.ts
      useCart.ts
    types/
      index.ts            # модели
    App.tsx               # объявление маршрутов
    main.tsx              # точка входа, провайдеры
    global.css            # глобальные стили (reset, кнопки, поля)
```

## Маршруты

- `/` — каталог товаров.
- `/products/:id` — карточка товара.
- `/cart` — корзина.
- `/checkout` — оформление заказа.
- `/confirmation/:id` — подтверждение заказа.

## Запуск фронтенда

```bash
npm install
copy .env.example .env   # Windows; на macOS/Linux: cp .env.example .env
npm run dev
```

Файл `.env` не коммитится (см. `.gitignore`). Если его нет, для прокси используются адреса по умолчанию `localhost:8000` и `localhost:8001`.

Сборка:

```bash
npm run build
```

Проверка ESLint:

```bash
npm run lint
```

## Бэкенд

Фронтенд ожидает запущенный проект `fast-api-sample`.

Vite проксирует запросы (целевые URL задаются в `.env`: `PROXY_CATALOG_TARGET`, `PROXY_ORDERS_TARGET`):

- `/api/catalog` → `{PROXY_CATALOG_TARGET}/catalog` (по умолчанию `http://localhost:8000/catalog`)
- `/api/orders` → `{PROXY_ORDERS_TARGET}/orders` (по умолчанию `http://localhost:8001/orders`)

Пример запуска бэкенда из папки `fast-api-sample`:

```bash
docker compose up
```

## Учебные данные

Моковые товары лежат в `src/mocks/fallbackProducts.ts`. Они используются, если API каталога недоступен.

## Примечание

Это учебный проект, поэтому код намеренно простой: без сложных библиотек состояния, авторизации и административной панели.