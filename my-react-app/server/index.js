import { randomUUID, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { db, transaction } from "./db.js";

/* ==========================================================================
   NIAA Kids API
   - Catalogue:   GET  /api/categories, /api/products, /api/products/:id
   - Cart:        GET  /api/cart, POST /api/cart/items,
                  PATCH/DELETE /api/cart/items/:productId
   - Wishlist:    GET  /api/wishlist, PUT/DELETE /api/wishlist/:productId
   - Newsletter:  POST /api/newsletter
   - Orders:      POST /api/orders           (turns the cart into an order)
   - Admin:       GET  /api/admin/orders, /api/admin/subscribers
                  (only when ADMIN_TOKEN is set; send "Authorization: Bearer <token>")
   Shoppers are identified by an anonymous, httpOnly session cookie.
   ========================================================================== */

const PORT = Number(process.env.PORT) || 3001;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const FREE_SHIPPING_CENTS = 5000;
const SHIPPING_CENTS = 599;
const MAX_QTY = 20;
const SESSION_COOKIE = "nk_sid";
const SESSION_DAYS = 30;

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, "..", "dist");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

/* ------------------------------- helpers -------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const cents = (n) => Math.round(n) / 100;

function readCookie(req, name) {
  for (const part of (req.headers.cookie || "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category_id,
    price: cents(row.price_cents),
    rating: row.rating,
    reviews: row.reviews,
    img: row.img,
    alt: row.alt,
    featured: Boolean(row.featured),
  };
}

function badRequest(res, error) {
  return res.status(400).json({ error });
}

function parseQty(value, { min }) {
  const qty = Number(value);
  return Number.isInteger(qty) && qty >= min && qty <= MAX_QTY ? qty : null;
}

const productExists = db.prepare("SELECT 1 FROM products WHERE id = ?");

function cartFor(sessionId) {
  const rows = db
    .prepare(
      `SELECT p.*, ci.qty AS qty
         FROM cart_items ci JOIN products p ON p.id = ci.product_id
        WHERE ci.session_id = ?
        ORDER BY ci.added_at, p.sort`
    )
    .all(sessionId);
  const subtotal = rows.reduce((sum, r) => sum + r.price_cents * r.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;
  return {
    items: rows.map((r) => ({ ...toProduct(r), qty: r.qty, lineTotal: cents(r.price_cents * r.qty) })),
    count: rows.reduce((sum, r) => sum + r.qty, 0),
    subtotal: cents(subtotal),
    shipping: cents(shipping),
    total: cents(subtotal + shipping),
    freeShippingThreshold: cents(FREE_SHIPPING_CENTS),
    remainingForFreeShipping: cents(Math.max(0, FREE_SHIPPING_CENTS - subtotal)),
    _cents: { subtotal, shipping, total: subtotal + shipping },
  };
}

const publicCart = ({ _cents, ...cart }) => cart; // eslint-disable-line no-unused-vars

const orderCode = (id) => `NK-${String(id).padStart(5, "0")}`;

/* ------------------------------ sessions -------------------------------- */

app.use("/api", (req, res, next) => {
  let sid = readCookie(req, SESSION_COOKIE);
  if (!sid || !UUID_RE.test(sid)) {
    sid = randomUUID();
    res.cookie(SESSION_COOKIE, sid, {
      httpOnly: true,
      sameSite: "lax",
      secure: req.secure,
      maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }
  req.sessionId = sid;
  next();
});

/* ------------------------------ catalogue ------------------------------- */

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/categories", (_req, res) => {
  const rows = db
    .prepare(
      `SELECT c.id, c.name, c.img, COUNT(p.id) AS productCount
         FROM categories c LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id ORDER BY c.sort`
    )
    .all();
  res.json({ categories: rows });
});

app.get("/api/products", (req, res) => {
  const { category, q, featured } = req.query;
  const where = [];
  const params = [];

  if (typeof category === "string" && category) {
    where.push("p.category_id = ?");
    params.push(category);
  }
  if (typeof q === "string" && q.trim()) {
    const like = `%${q.trim().slice(0, 60).replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    where.push("(p.name LIKE ? ESCAPE '\\' OR c.name LIKE ? ESCAPE '\\')");
    params.push(like, like);
  }
  if (featured === "1" || featured === "true") where.push("p.featured = 1");

  const rows = db
    .prepare(
      `SELECT p.* FROM products p JOIN categories c ON c.id = p.category_id
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY p.sort`
    )
    .all(...params);
  res.json({ products: rows.map(toProduct) });
});

app.get("/api/products/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Product not found" });
  res.json({ product: toProduct(row) });
});

/* --------------------------------- cart --------------------------------- */

app.get("/api/cart", (req, res) => res.json(publicCart(cartFor(req.sessionId))));

app.post("/api/cart/items", (req, res) => {
  const { productId } = req.body ?? {};
  const qty = req.body?.qty === undefined ? 1 : parseQty(req.body.qty, { min: 1 });
  if (typeof productId !== "string" || !productExists.get(productId)) return badRequest(res, "Unknown product");
  if (qty === null) return badRequest(res, `Quantity must be a whole number from 1 to ${MAX_QTY}`);

  db.prepare(
    `INSERT INTO cart_items (session_id, product_id, qty) VALUES (?, ?, ?)
     ON CONFLICT(session_id, product_id) DO UPDATE SET qty = MIN(cart_items.qty + excluded.qty, ${MAX_QTY})`
  ).run(req.sessionId, productId, qty);
  res.status(201).json(publicCart(cartFor(req.sessionId)));
});

app.patch("/api/cart/items/:productId", (req, res) => {
  const qty = parseQty(req.body?.qty, { min: 0 });
  if (qty === null) return badRequest(res, `Quantity must be a whole number from 0 to ${MAX_QTY}`);

  const result =
    qty === 0
      ? db.prepare("DELETE FROM cart_items WHERE session_id = ? AND product_id = ?").run(req.sessionId, req.params.productId)
      : db
          .prepare("UPDATE cart_items SET qty = ? WHERE session_id = ? AND product_id = ?")
          .run(qty, req.sessionId, req.params.productId);
  if (result.changes === 0) return res.status(404).json({ error: "That item is not in your bag" });
  res.json(publicCart(cartFor(req.sessionId)));
});

app.delete("/api/cart/items/:productId", (req, res) => {
  db.prepare("DELETE FROM cart_items WHERE session_id = ? AND product_id = ?").run(req.sessionId, req.params.productId);
  res.json(publicCart(cartFor(req.sessionId)));
});

/* ------------------------------- wishlist ------------------------------- */

const wishlistFor = (sid) =>
  db
    .prepare("SELECT product_id FROM wishlist_items WHERE session_id = ? ORDER BY added_at")
    .all(sid)
    .map((r) => r.product_id);

app.get("/api/wishlist", (req, res) => res.json({ productIds: wishlistFor(req.sessionId) }));

app.put("/api/wishlist/:productId", (req, res) => {
  if (!productExists.get(req.params.productId)) return res.status(404).json({ error: "Product not found" });
  db.prepare("INSERT OR IGNORE INTO wishlist_items (session_id, product_id) VALUES (?, ?)").run(
    req.sessionId,
    req.params.productId
  );
  res.json({ productIds: wishlistFor(req.sessionId) });
});

app.delete("/api/wishlist/:productId", (req, res) => {
  db.prepare("DELETE FROM wishlist_items WHERE session_id = ? AND product_id = ?").run(req.sessionId, req.params.productId);
  res.json({ productIds: wishlistFor(req.sessionId) });
});

/* ------------------------------ newsletter ------------------------------ */

app.post("/api/newsletter", (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) return badRequest(res, "Please enter a valid email address");

  const { changes } = db.prepare("INSERT OR IGNORE INTO subscribers (email) VALUES (?)").run(email);
  if (changes === 0) return res.json({ status: "already-subscribed" });
  res.status(201).json({ status: "subscribed" });
});

/* -------------------------------- orders -------------------------------- */

app.post("/api/orders", (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (!name || name.length > 80) return badRequest(res, "Please enter your name");
  if (email.length > 254 || !EMAIL_RE.test(email)) return badRequest(res, "Please enter a valid email address");

  const order = transaction(() => {
    const cart = cartFor(req.sessionId);
    if (cart.items.length === 0) return null;
    const items = cart.items.map(({ id, name: itemName, price, qty, lineTotal }) => ({ id, name: itemName, price, qty, lineTotal }));
    const { lastInsertRowid } = db
      .prepare(
        `INSERT INTO orders (session_id, customer_name, customer_email, items_json, subtotal_cents, shipping_cents, total_cents)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(req.sessionId, name, email, JSON.stringify(items), cart._cents.subtotal, cart._cents.shipping, cart._cents.total);
    db.prepare("DELETE FROM cart_items WHERE session_id = ?").run(req.sessionId);
    return {
      code: orderCode(Number(lastInsertRowid)),
      name,
      email,
      items,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
    };
  });

  if (!order) return badRequest(res, "Your bag is empty");
  res.status(201).json({ order, cart: publicCart(cartFor(req.sessionId)) });
});

/* --------------------------------- admin -------------------------------- */

function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) return res.status(404).json({ error: "Not found" });
  const given = Buffer.from(req.headers.authorization || "");
  const expected = Buffer.from(`Bearer ${ADMIN_TOKEN}`);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/api/admin/orders", requireAdmin, (_req, res) => {
  const rows = db.prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 200").all();
  res.json({
    orders: rows.map((o) => ({
      code: orderCode(o.id),
      name: o.customer_name,
      email: o.customer_email,
      items: JSON.parse(o.items_json),
      subtotal: cents(o.subtotal_cents),
      shipping: cents(o.shipping_cents),
      total: cents(o.total_cents),
      createdAt: o.created_at,
    })),
  });
});

app.get("/api/admin/subscribers", requireAdmin, (_req, res) => {
  res.json({ subscribers: db.prepare("SELECT email, created_at AS createdAt FROM subscribers ORDER BY created_at DESC").all() });
});

/* ------------------------------ fallbacks ------------------------------- */

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// In production, serve the built React site (npm run build) from the same port.
if (existsSync(DIST)) {
  app.use(express.static(DIST));
  app.use((req, res, next) => (req.method === "GET" ? res.sendFile(join(DIST, "index.html")) : next()));
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === "entity.parse.failed") return badRequest(res, "Malformed JSON body");
  if (err.type === "entity.too.large") return res.status(413).json({ error: "Request body too large" });
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`NIAA Kids API listening on http://localhost:${PORT}`);
  if (existsSync(DIST)) console.log(`Serving the built site from ${DIST}`);
  if (!ADMIN_TOKEN) console.log("Admin endpoints are disabled (set ADMIN_TOKEN to enable them).");
});
