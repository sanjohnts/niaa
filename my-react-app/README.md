# NIAA Kids — playful daily wear

React storefront (Vite) with a small Node/Express API and a built-in SQLite database.

## Run it

```bash
npm install
npm run dev        # API on :3001 + website on :5173 (Vite proxies /api to the API)
```

- `/` — NIAA Kids store (`src/NiaaKids.jsx`, the whole page in one file)
- `/littlelune` — the earlier LittleLune page (`src/LittleLune.jsx`)

Production: `npm run build && npm start` serves the built site and the API together on port 3001
(`PORT=8080 npm start` to change it).

## Backend

| Area       | Endpoints |
| ---------- | --------- |
| Catalogue  | `GET /api/categories`, `GET /api/products?featured=1&category=dresses&q=dress`, `GET /api/products/:id` |
| Cart       | `GET /api/cart`, `POST /api/cart/items {productId, qty}`, `PATCH /api/cart/items/:id {qty}`, `DELETE /api/cart/items/:id` |
| Wishlist   | `GET /api/wishlist`, `PUT /api/wishlist/:id`, `DELETE /api/wishlist/:id` |
| Newsletter | `POST /api/newsletter {email}` |
| Orders     | `POST /api/orders {name, email}` — turns the shopper's cart into an order |
| Admin      | `GET /api/admin/orders`, `GET /api/admin/subscribers` |

- Shoppers are identified by an anonymous `nk_sid` cookie (no accounts yet).
- Free shipping from $50, otherwise $5.99 (`server/index.js`).
- Products and categories live in `server/seed.js`; edit and restart to update the shop.
- Data is stored in `server/data/niaa.db` (created on first run, ignored by git). Set `DB_PATH` to move it.
- Admin endpoints are off unless you start the API with `ADMIN_TOKEN=your-secret`, then call them with
  `Authorization: Bearer your-secret`, e.g.
  `curl -H "Authorization: Bearer your-secret" http://localhost:3001/api/admin/orders`.
- No payment provider is connected: "Place Order" records the order but does not take payment.
