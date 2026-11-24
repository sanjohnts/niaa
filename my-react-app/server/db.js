import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { CATEGORIES, PRODUCTS } from "./seed.js";

const here = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || join(here, "data", "niaa.db");
mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS categories (
    id    TEXT PRIMARY KEY,
    name  TEXT NOT NULL,
    img   TEXT NOT NULL,
    sort  INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    category_id  TEXT NOT NULL REFERENCES categories(id),
    price_cents  INTEGER NOT NULL CHECK (price_cents >= 0),
    rating       REAL NOT NULL DEFAULT 5,
    reviews      INTEGER NOT NULL DEFAULT 0,
    img          TEXT NOT NULL,
    alt          TEXT NOT NULL DEFAULT '',
    featured     INTEGER NOT NULL DEFAULT 0,
    sort         INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    session_id  TEXT NOT NULL,
    product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    qty         INTEGER NOT NULL CHECK (qty > 0),
    added_at    TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (session_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS wishlist_items (
    session_id  TEXT NOT NULL,
    product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at    TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (session_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    email       TEXT PRIMARY KEY COLLATE NOCASE,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id      TEXT NOT NULL,
    customer_name   TEXT NOT NULL,
    customer_email  TEXT NOT NULL,
    items_json      TEXT NOT NULL,
    subtotal_cents  INTEGER NOT NULL,
    shipping_cents  INTEGER NOT NULL,
    total_cents     INTEGER NOT NULL,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

/** Run `fn` inside a transaction, rolling back if it throws. */
export function transaction(fn) {
  db.exec("BEGIN");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

// Keep the catalogue in sync with seed.js on every start.
transaction(() => {
  const upsertCategory = db.prepare(`
    INSERT INTO categories (id, name, img, sort) VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name = excluded.name, img = excluded.img, sort = excluded.sort
  `);
  CATEGORIES.forEach((c, i) => upsertCategory.run(c.id, c.name, c.img, i));

  const upsertProduct = db.prepare(`
    INSERT INTO products (id, name, category_id, price_cents, rating, reviews, img, alt, featured, sort)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name, category_id = excluded.category_id, price_cents = excluded.price_cents,
      rating = excluded.rating, reviews = excluded.reviews, img = excluded.img, alt = excluded.alt,
      featured = excluded.featured, sort = excluded.sort
  `);
  PRODUCTS.forEach((p, i) =>
    upsertProduct.run(p.id, p.name, p.category, p.priceCents, p.rating, p.reviews, p.img, p.alt, p.featured ? 1 : 0, i)
  );
});
