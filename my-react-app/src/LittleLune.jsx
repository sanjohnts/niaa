import { useEffect, useRef, useState } from "react";

/* ==========================================================================
   LittleLune — kidswear landing page
   Everything for the page lives in this one file: data, icons, components
   and styles. Product photos are served from /public/images.
   ========================================================================== */

const IMG = "/images/";

/* ---------------------------------- data ---------------------------------- */

const NAV = ["New In", "Girls", "Boys", "Baby", "Accessories", "Sale"];

const LOOK = [
  { id: "shirt", name: "Linen Shirt", price: 32, img: "thumb-shirt.jpg" },
  { id: "shorts", name: "Chino Shorts", price: 24, img: "thumb-shorts.jpg" },
  { id: "shoes", name: "Canvas Sneakers", price: 36, img: "thumb-shoes.jpg" },
];

const FEATURED = [
  { id: "sunny", name: "Sunny Button Dress", price: 36, tag: "New", img: "f-yellow-dress.jpg", bg: "#dddcdc", alt: "Girl in a yellow button-front dress and straw hat" },
  { id: "forest", name: "Forest Hooded Jacket", price: 44, img: "f-green-jacket.jpg", bg: "#dedddd", alt: "Boy in a green hooded jacket and cream trousers" },
  { id: "rosebud", name: "Rosebud Ruffle Dress", price: 42, img: "f-pink-dress.jpg", bg: "#d8d8d6", alt: "Girl in a pink ruffle dress with a hair bow" },
  { id: "dino", name: "Dino Sweatshirt & Joggers Set", price: 48, tag: "Bestseller", img: "f-dino-set.jpg", bg: "#e8e8e8", pos: "35% 50%", alt: "Boy in a cream dinosaur sweatshirt and green joggers" },
  { id: "bluebell", name: "Bluebell Floral Dress", price: 38, img: "f-blue-floral.jpg", bg: "#dcdbdb", alt: "Girl in a blue floral print dress" },
  { id: "seaside", name: "Seaside Stripe Tee & Shorts", price: 34, tag: "New", img: "f-striped-tee.jpg", bg: "#e2e1e1", alt: "Boy in a striped tee, khaki shorts and a cap" },
  { id: "cherry", name: "Cherry Knit Cardigan", price: 40, img: "f-pink-cardigan.jpg", bg: "#e7e6e6", alt: "Girl in a pink cherry cardigan and wide-leg jeans" },
];

const PRODUCTS = [
  { id: "smiley", name: "Smiley Fleece Hoodie", price: 29, img: "p-smiley-hoodie.jpg", alt: "Boy in a blue hoodie with a smiley patch" },
  { id: "hearts", name: "Little Hearts Sweatshirt", price: 32, img: "p-heart-sweater.jpg", alt: "Girl in a cream sweatshirt with pink hearts" },
  { id: "olive", name: "Olive Utility Jacket", price: 46, img: "p-olive-jacket.jpg", alt: "Boy in an olive jacket and knit beanie" },
  { id: "stripe", name: "Everyday Stripe Sweater", price: 34, img: "hero-essentials.jpg", pos: "30% 30%", alt: "Boy in a blue and cream striped sweater" },
  { id: "linen", name: "Sunshine Linen Shirt", price: 32, img: "hero-linen.jpg", pos: "50% 20%", alt: "Boy in sunglasses and a blue linen shirt" },
  { id: "floral", name: "Floral Cotton Dress", price: 39, img: "hero-dress.jpg", pos: "50% 18%", alt: "Girl in a floral cotton dress" },
];

const FOOTER = [
  { title: "Shop", links: ["New In", "Girls", "Boys", "Baby", "Accessories", "Sale"] },
  { title: "Help", links: ["Size Guide", "Shipping", "Returns", "Contact Us"] },
  { title: "About", links: ["Our Story", "Sustainability", "Journal", "Careers"] },
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const money = (n) => `$${n}`;

/* ---------------------------------- icons --------------------------------- */

function Svg({ size = 20, children, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

const SearchIcon = (p) => <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></Svg>;
const UserIcon = (p) => <Svg {...p}><circle cx="12" cy="8" r="3.8" /><path d="M4.8 20.2c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6z" /></Svg>;
const BagIcon = (p) => <Svg {...p}><path d="M5.2 8h13.6l-1 12.2H6.2z" /><path d="M9 8V6.6a3 3 0 0 1 6 0V8" /></Svg>;
const ArrowRight = (p) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const ArrowLeft = (p) => <Svg {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>;
const Chevron = (p) => <Svg {...p}><path d="m9.5 6 6 6-6 6" /></Svg>;
const CartIcon = (p) => <Svg {...p}><path d="M3 4h2.2l2.1 10.2h10.2L19.5 7H6.4" /><circle cx="9" cy="19" r="1.3" /><circle cx="16.5" cy="19" r="1.3" /></Svg>;
const MenuIcon = (p) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h10" /></Svg>;
const CloseIcon = (p) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>;
const PlusIcon = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;

function LongArrow({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 12" width="64" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 6h61M56 1l6 5-6 5" />
    </svg>
  );
}

function Moon({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M15.5 3.2A9 9 0 1 0 20.8 15 7 7 0 0 1 15.5 3.2z" fill="#E9C46A" />
    </svg>
  );
}

function Sun({ className }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const [r1, r2] = i % 2 ? [15.5, 19.5] : [15, 22];
    const f = (v) => Math.round(v * 100) / 100;
    return (
      <line
        key={i}
        x1={f(24 + r1 * Math.cos(a))}
        y1={f(24 + r1 * Math.sin(a))}
        x2={f(24 + r2 * Math.cos(a))}
        y2={f(24 + r2 * Math.sin(a))}
      />
    );
  });
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="24" cy="24" r="9" />
      <path d="M19.8 25.2a4.6 4.6 0 0 0 8.6-1.6" />
      {rays}
    </svg>
  );
}

function Doodle() {
  return (
    <svg className="ll-doodle" viewBox="0 0 120 135" aria-hidden="true">
      <path
        d="M32 22l5 9M60 8v10M90 18l-6 8M6 54h9M9 88l8-5M100 52l9-3M97 92l8 5"
        stroke="#EBC25C"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <g fill="#EBC25C" fontFamily="'Patrick Hand', cursive" fontSize="23" textAnchor="middle" transform="rotate(-12 58 72)">
        <text x="56" y="58">GOOD</text>
        <text x="60" y="82">DAYS</text>
        <text x="64" y="106">AHEAD</text>
      </g>
    </svg>
  );
}

/* --------------------------------- header --------------------------------- */

function Header({ bag, notify }) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) notify(`Search is coming soon — you looked for “${q}”`);
  };

  return (
    <header className={`ll-header${stuck ? " is-stuck" : ""}`}>
      <button
        type="button"
        className="ll-iconbtn ll-burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="ll-nav"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
      </button>

      <nav id="ll-nav" className={`ll-nav${open ? " is-open" : ""}`} aria-label="Primary">
        {NAV.map((item) => (
          <a key={item} href={`#${slug(item)}`} onClick={() => setOpen(false)}>
            {item}
          </a>
        ))}
      </nav>

      <a href="#top" className="ll-logo" aria-label="LittleLune home">
        <Moon size={24} />
        <span className="ll-logo-word">LITTLELUNE</span>
      </a>

      <div className="ll-tools">
        <form className="ll-search" role="search" onSubmit={submit}>
          <input
            type="search"
            placeholder="Search for clothes, toys, ..."
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="ll-iconbtn" aria-label="Search">
            <SearchIcon size={19} />
          </button>
        </form>
        <div className="ll-icons">
          <a href="#account" className="ll-iconbtn" aria-label="Account">
            <UserIcon size={21} />
          </a>
          <a href="#bag" className="ll-iconbtn" aria-label={`Shopping bag, ${bag} item${bag === 1 ? "" : "s"}`}>
            <BagIcon size={21} />
            {bag > 0 && (
              <span key={bag} className="ll-badge">
                {bag}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------- hero ---------------------------------- */

function Hero({ onAdd }) {
  const [selected, setSelected] = useState(LOOK[0].id);
  const item = LOOK.find((l) => l.id === selected);
  const lookTotal = LOOK.reduce((sum, l) => sum + l.price, 0);

  return (
    <section className="ll-hero" id="new-in" aria-labelledby="hero-title">
      <div className="ll-hero-head ll-rise">
        <h1 id="hero-title" className="ll-h1">
          <span>A Brighter World</span> <span>For Little Explorers</span>
        </h1>
        <p>
          Thoughtfully designed kidswear for every adventure. Soft fabrics, playful styles and everyday
          essentials made for growing imaginations.
        </p>
      </div>

      <div className="ll-hero-grid">
        <article className="ll-card ll-dress ll-rise" style={{ "--d": "80ms" }} id="girls">
          <img src={IMG + "hero-dress.jpg"} alt="Smiling girl in a floral cotton dress holding a woven daisy bag" />
          <a href="#featured" className="ll-tag ll-tag-top">
            <span>
              Floral
              <br />
              Cotton Dress
            </span>
            <strong>$39</strong>
          </a>
          <a href="#featured" className="ll-tag ll-tag-bottom">
            <span>Daisy Bag</span>
            <strong>$25</strong>
          </a>
        </article>

        <div className="ll-mid">
          <a href="#featured" className="ll-btn ll-btn-solid ll-rise" style={{ "--d": "140ms" }}>
            Shop New In <LongArrow className="ll-btn-arrow" />
          </a>
          <a href="#fingertips" className="ll-btn ll-btn-ghost ll-rise" style={{ "--d": "200ms" }}>
            Explore All Products
          </a>
          <article className="ll-card ll-essentials ll-rise" style={{ "--d": "260ms" }} id="boys">
            <img src={IMG + "hero-essentials.jpg"} alt="Smiling boy in a bucket hat and striped sweater" />
            <span className="ll-pill">New</span>
            <Sun className="ll-essentials-sun" />
            <h2 className="ll-essentials-copy">
              <em>The Everyday</em>
              <strong>Essentials Collection</strong>
            </h2>
            <a href="#featured" className="ll-shopnow">
              Shop Now
              <span className="ll-dot">
                <ArrowRight size={16} />
              </span>
            </a>
          </article>
        </div>

        <article className="ll-card ll-linen ll-rise" style={{ "--d": "320ms" }}>
          <img
            className="ll-linen-photo"
            src={IMG + "hero-linen.jpg"}
            alt="Boy in sunglasses wearing a blue linen shirt over a sunshine tee"
          />
          <Doodle />
          <div className="ll-linen-ui">
            <div className="ll-glass-row" aria-live="polite">
              <span className="ll-glass ll-glass-price">{money(item.price)}</span>
              <span className="ll-glass ll-glass-name">{item.name}</span>
            </div>
            <button
              type="button"
              className="ll-glass ll-complete"
              onClick={() => onAdd(LOOK.length, `Complete look added — ${LOOK.length} pieces, ${money(lookTotal)}`)}
            >
              Complete Look <ArrowRight size={20} />
            </button>
            <div className="ll-thumbs" role="group" aria-label="Pieces in this look">
              {LOOK.map((l) => (
                <button
                  type="button"
                  key={l.id}
                  className={`ll-thumb${l.id === selected ? " is-on" : ""}`}
                  aria-pressed={l.id === selected}
                  aria-label={`${l.name}, ${money(l.price)}`}
                  onClick={() => setSelected(l.id)}
                >
                  <img src={IMG + l.img} alt="" />
                </button>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ---------------------------- featured carousel --------------------------- */

function Featured({ onAdd }) {
  const n = FEATURED.length;
  const [active, setActive] = useState(3);
  const touchX = useRef(null);
  const go = (step) => setActive((a) => (a + step + n) % n);

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <section className="ll-section" id="featured" aria-labelledby="featured-title">
      <div className="ll-sec-head">
        <h2 id="featured-title" className="ll-h2">
          Featured Collection
        </h2>
        <p>Playful styles. Everyday comfort. Made for their next big adventure.</p>
      </div>

      <div className="ll-carousel" role="region" aria-roledescription="carousel" aria-label="Featured collection">
        <button type="button" className="ll-arrow ll-arrow-prev" onClick={() => go(-1)} aria-label="Previous product">
          <ArrowLeft size={20} />
        </button>

        <div className="ll-track" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
            const p = FEATURED[(active + offset + n) % n];

            if (offset === 0) {
              return (
                <article key="active" className="ll-fcard is-active" aria-live="polite">
                  <div className="ll-fcard-media" style={{ background: p.bg }}>
                    <img key={p.id} src={IMG + p.img} alt={p.alt} />
                  </div>
                  {p.tag && (
                    <span key={`${p.id}-tag`} className="ll-pill">
                      {p.tag}
                    </span>
                  )}
                  <div key={`${p.id}-meta`} className="ll-fcard-meta">
                    <div className="ll-fcard-info">
                      <span>{p.name}</span>
                      <strong>{money(p.price)}</strong>
                    </div>
                    <button
                      type="button"
                      className="ll-cart"
                      onClick={() => onAdd(1, `${p.name} added to your bag`)}
                      aria-label={`Add ${p.name} to bag`}
                    >
                      <CartIcon size={18} />
                    </button>
                  </div>
                </article>
              );
            }

            return (
              <button
                type="button"
                key={`slot${offset}`}
                className={`ll-fcard d${Math.abs(offset)}`}
                onClick={() => go(offset)}
                aria-label={`View ${p.name}`}
              >
                <img key={p.id} src={IMG + p.img} alt="" style={{ objectPosition: p.pos }} />
              </button>
            );
          })}
        </div>

        <button type="button" className="ll-arrow ll-arrow-next" onClick={() => go(1)} aria-label="Next product">
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}

/* --------------------------- adventures banner ---------------------------- */

function Adventure() {
  return (
    <section className="ll-adventure" id="shop-the-edit" aria-labelledby="adv-title">
      <div className="ll-adv-panel">
        <h2 id="adv-title" className="ll-h2 ll-adv-title">
          Little Outfits
          <br />
          For Big Adventures
        </h2>
        <div className="ll-adv-copy">
          <p>
            Premium materials. Thoughtful details. Versatile styles for school days, play dates and everything in
            between.
          </p>
          <a href="#fingertips" className="ll-textlink">
            Shop The Edit <ArrowRight size={17} />
          </a>
        </div>
      </div>
      <img
        className="ll-adv-photo"
        src={IMG + "banner-girl.jpg"}
        alt="Girl in a daisy knit cardigan lying on a rug, smiling and daydreaming"
        loading="lazy"
      />
    </section>
  );
}

/* ---------------------------- product rail -------------------------------- */

function Fingertips({ onAdd }) {
  const rail = useRef(null);

  const scrollNext = () => {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 12 : el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
  };

  return (
    <section className="ll-section" id="fingertips" aria-labelledby="fing-title">
      <div className="ll-sec-head">
        <h2 id="fing-title" className="ll-h2">
          Kids’ Fashion At Your Fingertips
        </h2>
      </div>

      <div className="ll-fing-row">
        <a href="#featured" className="ll-stat" id="baby">
          <span className="ll-stat-fillet" aria-hidden="true" />
          <strong>1000+</strong>
          <span className="ll-stat-label">Adorable Products</span>
          <LongArrow className="ll-stat-arrow" />
          <Sun className="ll-stat-sun" />
        </a>

        <div className="ll-rail-wrap" id="accessories">
          <div className="ll-rail" ref={rail}>
            {PRODUCTS.map((p) => (
              <article key={p.id} className="ll-pcard">
                <div className="ll-pcard-media">
                  <img src={IMG + p.img} alt={p.alt} loading="lazy" style={{ objectPosition: p.pos }} />
                  <button
                    type="button"
                    className="ll-add"
                    onClick={() => onAdd(1, `${p.name} added to your bag`)}
                    aria-label={`Add ${p.name} to bag`}
                  >
                    <PlusIcon size={18} />
                  </button>
                </div>
                <h3>{p.name}</h3>
                <span className="ll-pcard-price">{money(p.price)}</span>
              </article>
            ))}
          </div>
          <button type="button" className="ll-arrow ll-rail-next" onClick={scrollNext} aria-label="More products">
            <Chevron size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- footer --------------------------------- */

function Footer({ notify }) {
  const submit = (e) => {
    e.preventDefault();
    notify("Welcome to the Lune Club! Check your inbox soon.");
    e.currentTarget.reset();
  };

  return (
    <footer className="ll-footer" id="sale">
      <div className="ll-foot-top">
        <div className="ll-foot-brand">
          <a href="#top" className="ll-logo" aria-label="LittleLune home">
            <Moon size={22} />
            <span className="ll-logo-word">LITTLELUNE</span>
          </a>
          <p>Soft, playful clothing for little explorers — made to be worn, washed and loved again and again.</p>
        </div>

        {FOOTER.map((col) => (
          <nav key={col.title} className="ll-foot-col" aria-label={col.title}>
            <h4>{col.title}</h4>
            {col.links.map((l) => (
              <a key={l} href={`#${slug(l)}`}>
                {l}
              </a>
            ))}
          </nav>
        ))}

        <form className="ll-news" onSubmit={submit}>
          <h3>Join the Lune Club</h3>
          <p>Early access to new drops, styling notes and 10% off your first order.</p>
          <div className="ll-news-row">
            <label htmlFor="ll-email" className="ll-sr">
              Email address
            </label>
            <input id="ll-email" type="email" required placeholder="Your email address" autoComplete="email" />
            <button type="submit">Subscribe</button>
          </div>
        </form>
      </div>

      <div className="ll-foot-bottom">
        <span>© 2026 LittleLune. All rights reserved.</span>
        <span className="ll-foot-legal">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#cookies">Cookies</a>
        </span>
      </div>
    </footer>
  );
}

/* ----------------------------------- app ---------------------------------- */

export default function LittleLune() {
  const [bag, setBag] = useState(0);
  const [toast, setToast] = useState({ msg: "", show: false });
  const timer = useRef(0);

  useEffect(() => {
    document.title = "LittleLune — Kidswear for Little Explorers";
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const notify = (msg) => {
    clearTimeout(timer.current);
    setToast({ msg, show: true });
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2800);
  };

  const addToBag = (qty, msg) => {
    setBag((b) => b + qty);
    notify(msg);
  };

  return (
    <div className="ll">
      <style>{CSS}</style>
      <div className="ll-page" id="top">
        <Header bag={bag} notify={notify} />
        <main>
          <Hero onAdd={addToBag} />
          <Featured onAdd={addToBag} />
          <Adventure />
          <Fingertips onAdd={addToBag} />
        </main>
        <Footer notify={notify} />
      </div>
      <div className={`ll-toast${toast.show ? " is-visible" : ""}`} role="status" aria-live="polite">
        <span className="ll-toast-dot" aria-hidden="true" />
        {toast.msg}
      </div>
    </div>
  );
}

/* --------------------------------- styles --------------------------------- */

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..700&family=Instrument+Serif:ital@0;1&family=Lora:ital,wght@0,400..600;1,400..500&family=Patrick+Hand&display=swap");

:where(.ll) *, :where(.ll) *::before, :where(.ll) *::after { box-sizing: border-box; }
:where(.ll) img { display: block; max-width: 100%; }
:where(.ll) a { color: inherit; }
:where(.ll) button { font: inherit; color: inherit; }
:where(.ll) :is(h1, h2, h3, h4, p) { margin: 0; }
:where(.ll) :focus-visible { outline: 2px solid var(--sage-deep); outline-offset: 3px; }

.ll {
  --page: #eef6f9;
  --paper: #ffffff;
  --ink: #1c1c1f;
  --ink-2: #4d4e53;
  --muted: #8b8c92;
  --line: #e4e5e8;
  --sage: #6fae9c;
  --sage-deep: #5b9987;
  --mint: #88c1b0;
  --butter: #fdf3cf;
  --sun: #ebc25c;
  --stone: #e6e7ea;
  --display: "Instrument Serif", "Didot", "Bodoni 72", Georgia, serif;
  --serif: "Lora", Georgia, "Times New Roman", serif;
  --sans: "DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --r-lg: 20px;
  --r-md: 14px;
  --gutter: clamp(16px, 2.4vw, 34px);
  min-height: 100vh;
  padding: clamp(0px, 1.4vw, 20px);
  background: var(--page);
  color: var(--ink);
  font-family: var(--serif);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.ll-sr {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap;
}

.ll-page {
  position: relative;
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 var(--gutter) var(--gutter);
  background: var(--paper);
  border-radius: clamp(0px, 1.6vw, 26px);
  box-shadow: 0 1px 2px rgba(30, 60, 80, .04), 0 30px 60px -40px rgba(30, 60, 80, .18);
}

/* ---------- header ---------- */
.ll-header {
  position: sticky; top: 0; z-index: 40;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: "nav logo tools";
  align-items: center;
  gap: 20px;
  padding: 20px 0 18px;
  background: rgba(255, 255, 255, .94);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  transition: box-shadow .3s;
}
.ll-header.is-stuck { box-shadow: 0 12px 24px -24px rgba(20, 40, 60, .55); }

.ll-nav { grid-area: nav; display: flex; align-items: center; gap: clamp(16px, 2.6vw, 44px); }
.ll-nav a {
  position: relative; padding: 6px 0;
  font-size: 15px; color: var(--ink-2); text-decoration: none;
  transition: color .2s;
}
.ll-nav a::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1.5px;
  background: var(--sage); transform: scaleX(0); transform-origin: left; transition: transform .3s ease;
}
.ll-nav a:hover { color: var(--ink); }
.ll-nav a:hover::after { transform: scaleX(1); }

.ll-logo {
  grid-area: logo;
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  text-decoration: none;
}
.ll-logo-word {
  font: 500 clamp(17px, 1.5vw, 21px)/1 var(--serif);
  letter-spacing: .3em; margin-right: -.3em;
}

.ll-tools { grid-area: tools; justify-self: end; display: flex; align-items: center; gap: clamp(8px, 1.2vw, 18px); }
.ll-search {
  display: flex; align-items: center;
  width: clamp(190px, 21vw, 300px); height: 44px;
  padding: 0 3px 0 18px;
  border: 1px solid var(--line); border-radius: 999px; background: #fff;
  transition: border-color .2s, box-shadow .2s;
}
.ll-search:focus-within { border-color: #c4d8d2; box-shadow: 0 0 0 4px rgba(111, 174, 156, .15); }
.ll-search input {
  flex: 1; min-width: 0; height: 100%;
  border: 0; outline: 0; background: transparent;
  font: 14px var(--serif); color: var(--ink);
}
.ll-search input::placeholder { color: #a6a7ab; }
.ll-search input::-webkit-search-cancel-button { display: none; }
.ll-icons { display: flex; align-items: center; gap: 2px; }
.ll-iconbtn {
  position: relative; display: grid; place-items: center;
  width: 40px; height: 40px; padding: 0;
  border: 0; border-radius: 50%; background: transparent; color: var(--ink);
  cursor: pointer; text-decoration: none; transition: background .2s;
}
.ll-iconbtn:hover { background: #eff5f6; }
.ll-badge {
  position: absolute; top: 2px; right: 0;
  min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px;
  background: var(--sage); color: #fff;
  font: 600 11px/18px var(--sans); text-align: center;
  animation: ll-pop .45s cubic-bezier(.3, 1.6, .5, 1);
}
.ll-burger { display: none; grid-area: burger; justify-self: start; }

/* ---------- hero ---------- */
.ll-hero { padding-top: clamp(16px, 2.4vw, 34px); }
.ll-hero-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 20px 40px; margin-bottom: clamp(20px, 2.4vw, 34px);
}
.ll-h1 {
  font: 400 clamp(2.7rem, 7.4vw, 6.9rem)/.94 var(--display);
  letter-spacing: -.012em; text-transform: uppercase;
}
.ll-h1 span { display: block; }
.ll-hero-head p {
  flex: 0 1 360px; padding-bottom: .9em;
  font-size: 15px; line-height: 1.65; color: var(--ink-2);
}

.ll-hero-grid {
  display: grid;
  grid-template-columns: 1fr 1.06fr 1fr;
  grid-template-areas: "dress mid linen";
  gap: clamp(12px, 1.3vw, 18px);
}
.ll-card { position: relative; overflow: hidden; isolation: isolate; border-radius: var(--r-lg); background: var(--stone); }
.ll-card > img { transition: transform .9s cubic-bezier(.2, .7, .2, 1); }

.ll-dress { grid-area: dress; aspect-ratio: 263 / 358; background: #e7e7e9; }
.ll-dress > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 30% top; }
.ll-dress:hover > img, .ll-essentials:hover > img { transform: scale(1.035); }

.ll-tag {
  position: absolute; display: flex; flex-direction: column; gap: 6px;
  font-family: var(--sans); color: var(--ink); text-decoration: none;
}
.ll-tag span { font-size: clamp(10.5px, .9vw, 12.5px); font-weight: 500; letter-spacing: .07em; line-height: 1.55; text-transform: uppercase; }
.ll-tag strong { font-size: clamp(16px, 1.45vw, 20px); font-weight: 500; letter-spacing: .01em; }
.ll-tag-top { top: 8.5%; left: 67%; }
.ll-tag-bottom { bottom: 10%; left: 72%; }
.ll-tag-top::after, .ll-tag-bottom::before {
  content: ""; width: 34px; height: 1px; background: currentColor; opacity: .4;
  transition: width .3s, opacity .3s;
}
.ll-tag-top::after { margin-top: 6px; }
.ll-tag-bottom::before { margin-bottom: 6px; }
.ll-tag:hover::after, .ll-tag:hover::before { width: 54px; opacity: .85; }

.ll-mid { grid-area: mid; display: flex; flex-direction: column; gap: clamp(10px, 1.6vw, 22px); min-width: 0; }
.ll-btn {
  display: flex; align-items: center; justify-content: center; gap: 18px;
  border-radius: 999px; text-decoration: none;
  font: 500 clamp(12.5px, 1vw, 14.5px)/1 var(--sans); letter-spacing: .16em; text-transform: uppercase;
  transition: background .25s, border-color .25s, color .25s, box-shadow .25s;
}
.ll-btn-solid {
  height: clamp(56px, 5.9vw, 84px);
  background: var(--sage); color: #fff;
  box-shadow: 0 14px 26px -18px rgba(60, 130, 110, .9);
}
.ll-btn-solid:hover { background: var(--sage-deep); }
.ll-btn-arrow { width: clamp(44px, 4.4vw, 62px); transition: transform .35s ease; }
.ll-btn-solid:hover .ll-btn-arrow { transform: translateX(6px); }
.ll-btn-ghost { height: clamp(50px, 5vw, 71px); border: 1.5px solid #dcdde0; background: #fff; color: var(--ink); }
.ll-btn-ghost:hover { border-color: var(--ink); }

.ll-essentials { flex: 1; min-height: 280px; background: linear-gradient(160deg, #e4f3fa, #dcedf5); }
.ll-essentials > img {
  position: absolute; top: 0; left: 0;
  width: auto; height: 100%; max-width: 100%;
  object-fit: cover; object-position: 12% center;
  -webkit-mask-image: linear-gradient(90deg, #000 84%, transparent);
  mask-image: linear-gradient(90deg, #000 84%, transparent);
}
.ll-pill {
  position: absolute; top: 14px; left: 14px; z-index: 2;
  padding: 7px 15px; border-radius: 999px; background: #fff; color: var(--ink);
  font: 700 10.5px/1 var(--sans); letter-spacing: .1em; text-transform: uppercase;
  box-shadow: 0 4px 14px -6px rgba(0, 0, 0, .18);
}
.ll-essentials-sun { position: absolute; top: 3.5%; right: 3.5%; width: clamp(40px, 4vw, 58px); color: var(--sun); }
.ll-essentials-copy { position: absolute; top: 27%; right: 2.5%; width: 28%; display: flex; flex-direction: column; gap: 3px; }
.ll-essentials-copy em { font: italic 400 clamp(13px, 1.15vw, 17px)/1.3 var(--serif); color: var(--ink-2); }
.ll-essentials-copy strong { font: 600 clamp(15px, 1.4vw, 20px)/1.22 var(--sans); color: var(--ink); }
.ll-shopnow {
  position: absolute; right: 4.5%; bottom: 8%;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  font: 700 10.5px/1 var(--sans); letter-spacing: .08em; text-transform: uppercase; text-decoration: none;
}
.ll-dot { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--ink); color: #fff; transition: transform .3s; }
.ll-shopnow:hover .ll-dot { transform: translateX(4px); }

.ll-linen { grid-area: linen; background: linear-gradient(180deg, #eceff2 0%, #e3e5e9 55%, #dfe1e5 100%); }
.ll-linen-photo {
  position: absolute; top: 0; left: 0; width: 100%; height: auto;
  aspect-ratio: 260 / 190; object-fit: cover;
  -webkit-mask-image: linear-gradient(#000 80%, transparent);
  mask-image: linear-gradient(#000 80%, transparent);
}
.ll-doodle { position: absolute; top: 6%; right: 2.5%; width: 31%; max-width: 134px; pointer-events: none; }
.ll-linen-ui { position: absolute; left: 4.5%; right: 4.5%; bottom: 3.5%; display: flex; flex-direction: column; gap: 7px; }
.ll-glass-row { display: grid; grid-template-columns: 30% 1fr; gap: 6px; }
.ll-glass {
  display: flex; align-items: center;
  height: clamp(46px, 4.4vw, 62px); padding: 0 clamp(12px, 1.4vw, 20px);
  border: 1px solid rgba(255, 255, 255, .6); border-radius: 14px;
  background: rgba(140, 147, 160, .45);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  backdrop-filter: blur(14px) saturate(1.2);
  color: #fff; font-family: var(--sans);
}
.ll-glass-price { justify-content: center; font-size: clamp(20px, 2.1vw, 30px); font-weight: 300; }
.ll-glass-name { font-size: clamp(14px, 1.3vw, 19px); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ll-complete { width: 100%; justify-content: space-between; font-size: clamp(14px, 1.25vw, 18px); font-weight: 500; cursor: pointer; transition: background .25s; }
.ll-complete:hover { background: rgba(110, 118, 134, .6); }
.ll-complete svg { transition: transform .3s; }
.ll-complete:hover svg { transform: translateX(4px); }
.ll-thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 3px; }
.ll-thumb {
  aspect-ratio: 76 / 56; padding: 0; overflow: hidden;
  border: 2px solid transparent; border-radius: 11px; background: #e4e4e6;
  cursor: pointer; transition: border-color .2s, transform .25s, box-shadow .25s;
}
.ll-thumb img { width: 100%; height: 100%; object-fit: cover; }
.ll-thumb:hover { transform: translateY(-2px); }
.ll-thumb.is-on { border-color: #fff; box-shadow: 0 6px 16px -8px rgba(30, 40, 60, .45); }

/* ---------- sections ---------- */
.ll-section { padding-top: clamp(56px, 6.4vw, 92px); }
.ll-sec-head { text-align: center; margin-bottom: clamp(22px, 2.6vw, 38px); }
.ll-h2 { font: 400 clamp(2.2rem, 4.3vw, 3.9rem)/1 var(--display); letter-spacing: -.005em; text-transform: uppercase; }
.ll-sec-head p { margin-top: 10px; font-size: clamp(15px, 1.25vw, 18px); line-height: 1.5; color: var(--ink-2); }

/* ---------- featured carousel ---------- */
.ll-carousel { position: relative; }
.ll-track { display: flex; align-items: center; gap: clamp(6px, .75vw, 10px); height: clamp(360px, 34vw, 480px); touch-action: pan-y; }
.ll-fcard {
  position: relative; flex: 1 1 0; min-width: 0; height: 88%;
  padding: 0; overflow: hidden; border: 0; border-radius: var(--r-md); background: #e4e3e3;
  cursor: pointer; transition: transform .3s, box-shadow .3s;
}
.ll-fcard.d2 { height: 92.5%; }
.ll-fcard.d1 { height: 96%; flex-grow: 1.1; }
.ll-fcard:not(.is-active):hover { transform: translateY(-4px); box-shadow: 0 16px 28px -20px rgba(30, 40, 60, .5); }
.ll-fcard > img { width: 100%; height: 100%; object-fit: cover; animation: ll-fade .55s ease both; }
.ll-fcard.is-active {
  flex-grow: 1.8; height: 100%; padding: 6px; overflow: visible;
  border-radius: 20px; background: #fff; cursor: default;
  box-shadow: 0 22px 44px -22px rgba(30, 40, 60, .38), 0 0 0 1px rgba(20, 30, 40, .04);
}
.ll-fcard-media { display: flex; justify-content: center; width: 100%; height: 100%; overflow: hidden; border-radius: 15px; transition: background .4s; }
.ll-fcard-media img {
  width: auto; height: 100%; max-width: 100%; object-fit: cover;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent);
  animation: ll-fade .55s ease both;
}
.is-active .ll-pill { top: 18px; left: 18px; animation: ll-fade .5s ease both; }
.ll-fcard-meta {
  position: absolute; right: 7%; bottom: 5%; max-width: 46%;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  animation: ll-fade .55s .08s ease both;
}
.ll-fcard-info {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 8px 10px; border-radius: 12px; text-align: center;
  background: rgba(255, 255, 255, .55);
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
}
.ll-fcard-info span { font: 400 clamp(11.5px, .95vw, 13.5px)/1.35 var(--serif); color: var(--ink-2); }
.ll-fcard-info strong { font: 700 clamp(15px, 1.3vw, 19px)/1.1 var(--sans); }
.ll-cart {
  display: grid; place-items: center; width: 40px; height: 40px; padding: 0;
  border: 0; border-radius: 50%; background: var(--ink); color: #fff;
  cursor: pointer; transition: transform .2s, background .2s;
}
.ll-cart:hover { transform: scale(1.08); background: #000; }
.ll-cart:active { transform: scale(.94); }

.ll-arrow {
  position: absolute; top: 50%; z-index: 5;
  display: grid; place-items: center; width: 46px; height: 46px; padding: 0;
  border: 0; border-radius: 50%; background: #fff; color: var(--ink);
  box-shadow: 0 8px 22px -8px rgba(30, 40, 60, .35);
  cursor: pointer; transform: translateY(-50%); transition: transform .2s;
}
.ll-arrow:hover { transform: translateY(-50%) scale(1.07); }
.ll-arrow-prev { left: -10px; }
.ll-arrow-next { right: -10px; }

/* ---------- adventures banner ---------- */
.ll-adventure { --overlap: 13%; margin-top: clamp(56px, 6.4vw, 92px); }
.ll-adv-panel {
  display: grid; grid-template-columns: 1.25fr 1fr; align-items: start;
  gap: 20px clamp(24px, 4vw, 64px);
  padding: clamp(24px, 2.8vw, 40px) clamp(20px, 2.6vw, 36px) calc(var(--overlap) + clamp(18px, 2vw, 30px));
  border-radius: var(--r-lg); background: var(--butter);
}
.ll-adv-title { font-size: clamp(2.3rem, 5vw, 4.6rem); }
.ll-adv-copy { padding-top: clamp(4px, .8vw, 12px); }
.ll-adv-copy p { max-width: 450px; font-size: clamp(14.5px, 1.2vw, 16.5px); line-height: 1.65; color: var(--ink-2); }
.ll-textlink {
  display: inline-flex; align-items: center; gap: 14px;
  margin-top: 18px; padding-bottom: 8px; border-bottom: 1.5px solid #c9c49a;
  font: 700 12.5px/1 var(--sans); letter-spacing: .2em; text-transform: uppercase; text-decoration: none;
  transition: border-color .25s, gap .25s;
}
.ll-textlink:hover { border-color: var(--ink); gap: 20px; }
.ll-adv-photo {
  position: relative;
  width: calc(100% - 2 * clamp(10px, 1.2vw, 16px));
  margin: calc(-1 * var(--overlap)) auto 0;
  aspect-ratio: 806 / 280; object-fit: cover;
  border-radius: var(--r-lg);
  box-shadow: 0 24px 48px -30px rgba(70, 60, 20, .45);
}

/* ---------- fingertips ---------- */
.ll-fing-row { display: grid; grid-template-columns: 2fr 3fr; gap: clamp(12px, 1.3vw, 18px); align-items: stretch; }

.ll-stat {
  --tab: 40px; --tab-w: 64%; --g: var(--mint);
  position: relative; isolation: isolate;
  display: flex; flex-direction: column; align-items: flex-start;
  min-height: 320px;
  padding: calc(var(--tab) + clamp(14px, 2vw, 30px)) clamp(22px, 3vw, 40px) clamp(22px, 3vw, 36px);
  color: #fff; text-decoration: none;
}
.ll-stat:hover { --g: #7db8a6; }
.ll-stat::before {
  content: ""; position: absolute; inset: var(--tab) 0 0 0; z-index: -1;
  background: var(--g); border-radius: 0 24px 24px 24px;
}
.ll-stat::after {
  content: ""; position: absolute; top: 0; left: 0; z-index: -1;
  width: var(--tab-w); height: calc(var(--tab) + 30px);
  background: var(--g); border-radius: 24px 20px 0 0;
}
.ll-stat-fillet {
  position: absolute; top: calc(var(--tab) - 20px); left: var(--tab-w); z-index: -1;
  width: 20px; height: 20px;
  background: radial-gradient(circle at 100% 0, transparent 19.5px, var(--g) 20px);
}
.ll-stat strong { font: 400 clamp(52px, 5.8vw, 84px)/1 var(--display); letter-spacing: -.01em; }
.ll-stat-label { margin-top: 10px; font: 500 clamp(14px, 1.3vw, 18px)/1.3 var(--sans); letter-spacing: .16em; text-transform: uppercase; }
.ll-stat-arrow { width: clamp(70px, 8vw, 110px); height: auto; margin-top: clamp(22px, 3vw, 40px); transition: transform .35s ease; }
.ll-stat:hover .ll-stat-arrow { transform: translateX(8px); }
.ll-stat-sun { position: absolute; right: 12%; bottom: 13%; width: clamp(64px, 7vw, 100px); color: #f7df92; }

.ll-rail-wrap { position: relative; min-width: 0; }
.ll-rail {
  display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 24px) / 3); gap: 12px;
  overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory; scrollbar-width: none;
}
.ll-rail::-webkit-scrollbar { display: none; }
.ll-pcard { min-width: 0; scroll-snap-align: start; }
.ll-pcard-media { position: relative; overflow: hidden; aspect-ratio: 150 / 160; border-radius: var(--r-md); background: #ededed; }
.ll-pcard-media img { width: 100%; height: 100%; object-fit: cover; object-position: center top; transition: transform .8s cubic-bezier(.2, .7, .2, 1); }
.ll-pcard:hover .ll-pcard-media img { transform: scale(1.04); }
.ll-add {
  position: absolute; right: 10px; bottom: 10px;
  display: grid; place-items: center; width: 38px; height: 38px; padding: 0;
  border: 0; border-radius: 50%; background: #fff; color: var(--ink);
  box-shadow: 0 6px 16px -8px rgba(0, 0, 0, .35);
  cursor: pointer; opacity: 0; transform: translateY(6px);
  transition: opacity .25s, transform .25s, background .2s, color .2s;
}
.ll-pcard:hover .ll-add, .ll-add:focus-visible { opacity: 1; transform: none; }
.ll-add:hover { background: var(--sage); color: #fff; }
.ll-pcard h3 { margin-top: 12px; font: 500 clamp(14px, 1.1vw, 15.5px)/1.3 var(--sans); }
.ll-pcard-price { display: block; margin-top: 3px; font-size: 14.5px; color: var(--ink-2); }
.ll-rail-next { top: 12px; right: 12px; width: 38px; height: 38px; transform: none; }
.ll-rail-next:hover { transform: scale(1.07); }

/* ---------- footer ---------- */
.ll-footer {
  margin-top: clamp(56px, 6.4vw, 92px);
  padding: clamp(28px, 4vw, 56px) clamp(22px, 3.6vw, 52px) 24px;
  border-radius: var(--r-lg); background: #f1f7f5;
}
.ll-foot-top { display: grid; grid-template-columns: 1.3fr .75fr .75fr .75fr 1.6fr; gap: 32px clamp(20px, 3vw, 44px); }
.ll-foot-brand .ll-logo { align-items: flex-start; }
.ll-foot-brand p { margin-top: 16px; max-width: 280px; font-size: 14.5px; line-height: 1.65; color: var(--ink-2); }
.ll-foot-col h4 { margin-bottom: 14px; font: 700 11.5px/1 var(--sans); letter-spacing: .16em; text-transform: uppercase; }
.ll-foot-col a { display: block; padding: 5px 0; font-size: 14.5px; color: var(--ink-2); text-decoration: none; transition: color .2s; }
.ll-foot-col a:hover { color: var(--sage-deep); }
.ll-news h3 { font: 400 clamp(1.7rem, 2.4vw, 2.2rem)/1.05 var(--display); text-transform: uppercase; }
.ll-news p { margin-top: 8px; font-size: 14.5px; line-height: 1.6; color: var(--ink-2); }
.ll-news-row {
  display: flex; gap: 6px; margin-top: 16px; padding: 5px;
  border: 1px solid var(--line); border-radius: 999px; background: #fff;
  transition: border-color .2s, box-shadow .2s;
}
.ll-news-row:focus-within { border-color: #c4d8d2; box-shadow: 0 0 0 4px rgba(111, 174, 156, .15); }
.ll-news-row input { flex: 1; min-width: 0; padding: 0 14px; border: 0; outline: 0; background: transparent; font: 14.5px var(--serif); color: var(--ink); }
.ll-news-row button {
  padding: 13px 20px; border: 0; border-radius: 999px; background: var(--sage); color: #fff;
  font: 600 12px/1 var(--sans); letter-spacing: .12em; text-transform: uppercase;
  cursor: pointer; transition: background .2s;
}
.ll-news-row button:hover { background: var(--sage-deep); }
.ll-foot-bottom {
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px 24px;
  margin-top: clamp(32px, 4vw, 48px); padding-top: 20px; border-top: 1px solid #dde8e4;
  font: 13px/1.5 var(--sans); color: var(--muted);
}
.ll-foot-legal { display: flex; gap: 20px; }
.ll-foot-legal a { text-decoration: none; }
.ll-foot-legal a:hover { color: var(--ink); }

/* ---------- toast ---------- */
.ll-toast {
  position: fixed; left: 50%; bottom: 24px; z-index: 100;
  display: flex; align-items: center; gap: 10px; max-width: calc(100vw - 32px);
  padding: 13px 20px 13px 16px; border-radius: 999px;
  background: var(--ink); color: #fff; font: 500 14px/1.3 var(--sans);
  box-shadow: 0 18px 40px -18px rgba(0, 0, 0, .5);
  opacity: 0; pointer-events: none; transform: translate(-50%, 16px);
  transition: opacity .3s, transform .3s;
}
.ll-toast.is-visible { opacity: 1; transform: translate(-50%, 0); }
.ll-toast-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--mint); }

/* ---------- motion ---------- */
.ll-rise { animation: ll-rise .8s cubic-bezier(.2, .7, .2, 1) both; animation-delay: var(--d, 0ms); }
@keyframes ll-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes ll-fade { from { opacity: 0; transform: scale(1.035); } to { opacity: 1; transform: none; } }
@keyframes ll-pop { from { transform: scale(.4); } to { transform: scale(1); } }
@keyframes ll-drop { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }

/* ---------- responsive ---------- */
@media (hover: none) {
  .ll-add { opacity: 1; transform: none; }
}

@media (max-width: 1080px) {
  .ll-header { grid-template-areas: "burger logo tools"; }
  .ll-burger { display: grid; }
  .ll-search { width: clamp(160px, 24vw, 260px); }
  .ll-nav {
    grid-area: auto;
    position: absolute; top: 100%; left: 0; right: 0;
    display: none; flex-direction: column; align-items: stretch; gap: 0;
    padding: 6px 0 14px;
    background: #fff; border-radius: 0 0 18px 18px;
    box-shadow: 0 24px 40px -24px rgba(20, 40, 60, .35);
  }
  .ll-nav.is-open { display: flex; animation: ll-drop .25s ease; }
  .ll-nav a { padding: 13px 6px; font-size: 17px; border-bottom: 1px solid #f0f1f2; }
  .ll-nav a::after { display: none; }
}

@media (max-width: 1000px) {
  .ll-hero-head { flex-direction: column; align-items: flex-start; }
  .ll-hero-head p { flex: none; max-width: 520px; padding: 0; }
  .ll-hero-grid { grid-template-columns: 1fr 1fr; grid-template-areas: "mid mid" "dress linen"; }
  .ll-mid { display: grid; grid-template-columns: 1fr 1fr; }
  .ll-essentials { grid-column: 1 / -1; aspect-ratio: 1.7; min-height: 0; }
  .ll-essentials-copy { right: 6%; width: 24%; top: 32%; }
  .ll-linen { aspect-ratio: 263 / 358; }
  .ll-fcard.d3 { display: none; }
  .ll-foot-top { grid-template-columns: repeat(3, 1fr); }
  .ll-foot-brand, .ll-news { grid-column: 1 / -1; }
}

@media (max-width: 860px) {
  .ll-fing-row { grid-template-columns: 1fr; }
  .ll-stat { min-height: 240px; }
  .ll-rail { grid-auto-columns: calc((100% - 24px) / 2.5); }
}

@media (max-width: 760px) {
  .ll-adventure { --overlap: 20%; }
  .ll-adv-panel { grid-template-columns: 1fr; }
  .ll-adv-photo { aspect-ratio: 4 / 3; object-position: 56% center; }
}

@media (max-width: 640px) {
  .ll-header {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "burger logo icons" "search search search";
    row-gap: 12px; padding: 14px 0 12px;
  }
  .ll-header .ll-logo { justify-self: center; }
  .ll-tools { display: contents; }
  .ll-search { grid-area: search; width: 100%; }
  .ll-icons { grid-area: icons; }
  .ll-h1 { font-size: clamp(2.6rem, 12.5vw, 4rem); }
  .ll-h1 span { display: inline; }
  .ll-hero-grid { grid-template-columns: 1fr; grid-template-areas: "mid" "dress" "linen"; }
  .ll-mid { grid-template-columns: 1fr; }
  .ll-essentials { aspect-ratio: 275 / 226; }
  .ll-essentials-copy { right: 2.5%; width: 28%; top: 27%; }
  .ll-track { height: 420px; }
  .ll-fcard.d2 { display: none; }
  .ll-fcard.is-active { flex-grow: 2.6; }
  .ll-fcard-meta {
    left: 12px; right: 12px; bottom: 12px; max-width: none;
    flex-direction: row; justify-content: space-between;
    padding: 8px 8px 8px 12px; border-radius: 14px;
    background: rgba(255, 255, 255, .78);
    -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
  }
  .ll-fcard-info { align-items: flex-start; padding: 0; background: none; text-align: left; -webkit-backdrop-filter: none; backdrop-filter: none; }
  .ll-arrow-prev { left: -6px; }
  .ll-arrow-next { right: -6px; }
  .ll-rail { grid-auto-columns: 64%; }
  .ll-foot-top { grid-template-columns: 1fr 1fr; }
  .ll-foot-bottom { flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  .ll *, .ll *::before, .ll *::after {
    animation-duration: .01ms !important;
    animation-delay: 0ms !important;
    transition-duration: .01ms !important;
  }
}
`;
