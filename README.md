# Artisan AI

Artisan AI is a React marketplace for handcrafted products. Product listings and stock are shared through a small Node.js API; server-sent events push changes to open buyer and seller pages.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://127.0.0.1:5173`). The development command starts both the Vite frontend and the API. Product data is created in `server/data/products.json` and persists between restarts.

## Real-time behavior

- New seller listings appear in buyer and seller dashboards without refreshing.
- Successful orders reduce stock for all connected viewers.
- The server checks stock when placing an order, so concurrent buyers cannot purchase more than is available.
- Product images can be uploaded as PNG, JPG, WEBP, or GIF files up to 2 MB.

Orders update inventory only; this project does not process payments or provide user authentication. The API binds to localhost and is intended for local development. Do not expose it directly to the public internet; a deployed marketplace needs an authenticated, production-ready backend and payment integration.

## Production build

```sh
npm run build
npm start
```

The Node server serves the built app and API at `http://127.0.0.1:3001`.
