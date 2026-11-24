import { useCallback, useEffect, useRef, useState } from "react";

/* ==========================================================================
   NIAA Kids — playful daily wear
   Everything for this page lives in this one file: data, icons, components
   and styles. Images (logo pieces + product photos) are in /public/images/niaa.
   ========================================================================== */

const IMG = "/images/niaa/";

/* ---------------------------------- data ---------------------------------- */

const NAV = ["Home", "Shop", "New Arrivals", "Collections", "About"];

const CATEGORIES = [
  { id: "onesies", label: ["Onesies", "& Bodysuits"], img: "cat-onesies.jpg" },
  { id: "dresses", label: ["Dresses", "& Sets"], img: "cat-dresses.jpg" },
  { id: "tops", label: ["Tops &", "Bottoms"], img: "cat-tops.jpg" },
  { id: "outerwear", label: ["Outerwear"], img: "cat-outerwear.jpg" },
  { id: "accessories", label: ["Accessories"], img: "cat-accessories.jpg" },
  { id: "footwear", label: ["Footwear"], img: "cat-footwear.jpg" },
  { id: "toys", label: ["Toys &", "Essentials"], img: "cat-toys.jpg" },
];

const FAVORITES = [
  { id: "romper", name: "Cozy Bear Romper", price: 28, rating: 4.5, reviews: 124, img: "p-bear-romper.jpg", alt: "Cream knit romper with a bear-ear hood" },
  { id: "blossom", name: "Blossom Dress", price: 32, rating: 5, reviews: 98, img: "p-blossom-dress.jpg", alt: "Pink floral dress with flutter sleeves" },
  { id: "explorer", name: "Little Explorer Set", price: 34, rating: 4.5, reviews: 156, img: "p-explorer-set.jpg", alt: "Sage sweatshirt with a bear face and matching shorts" },
  { id: "cardigan", name: "Cloud Knit Cardigan", price: 30, rating: 4.5, reviews: 87, img: "p-knit-cardigan.jpg", alt: "Cream cable-knit button cardigan" },
  { id: "overalls", name: "Everyday Overalls", price: 29, rating: 5, reviews: 102, img: "p-overalls.jpg", alt: "Tan cotton overalls with cargo pockets" },
];

const PERKS = [
  { icon: "leaf", title: "Premium Quality", text: "Soft, safe & skin-friendly fabrics" },
  { icon: "truck", title: "Free Shipping", text: "On orders over $50" },
  { icon: "shield", title: "Easy Returns", text: "Hassle-free shopping" },
  { icon: "heart", title: "A Kinder Tomorrow", text: "Sustainable choices for a brighter world" },
];

const REVIEWS = [
  { name: "Ayesha K.", img: "avatar-ayesha.jpg", text: "The quality is amazing and the clothes are even cuter in person!" },
  { name: "Hamza R.", img: "avatar-hamza.jpg", text: "Soft, comfortable and perfect for everyday wear. Highly recommend!" },
  { name: "Sara M.", img: "avatar-sara.jpg", text: "Beautiful designs and such fast delivery. We love NIAA Kids!" },
];

const FOOTER = [
  { title: "Shop", links: ["All Products", "New Arrivals", "Best Sellers", "Sale"] },
  { title: "About", links: ["Our Story", "Sustainability", "Size Guide", "Blog"] },
  { title: "Help", links: ["Shipping", "Returns", "FAQs", "Contact Us"] },
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const price = (n) => `$${n.toFixed(2)}`;

const UNAVAILABLE = "Sorry, the shop is unavailable right now. Please try again in a moment.";

/** Small JSON client for the NIAA Kids API (server/index.js, proxied at /api). */
async function api(path, { method = "GET", body, signal } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    signal,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

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

const HEART = "M12 20.2s-7.6-4.6-7.6-10.4A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.6 2.6c0 5.8-7.6 10.4-7.6 10.4z";

const SearchIcon = (p) => <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></Svg>;
const UserIcon = (p) => <Svg {...p}><circle cx="12" cy="8" r="3.8" /><path d="M4.8 20.2c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6z" /></Svg>;
const BagIcon = (p) => <Svg {...p}><path d="M5.2 8h13.6l-1 12.2H6.2z" /><path d="M9 8V6.6a3 3 0 0 1 6 0V8" /></Svg>;
const ArrowRight = (p) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const ArrowLeft = (p) => <Svg {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>;
const PlusIcon = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
const MinusIcon = (p) => <Svg {...p}><path d="M5 12h14" /></Svg>;
const TrashIcon = (p) => <Svg {...p}><path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2h9.4l.8-12.2" /></Svg>;
const MenuIcon = (p) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h10" /></Svg>;
const CloseIcon = (p) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>;
const HeartIcon = ({ filled, ...p }) => <Svg {...p}><path d={HEART} fill={filled ? "currentColor" : "none"} /></Svg>;
const StarIcon = (p) => (
  <Svg {...p} stroke="none">
    <path fill="currentColor" d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.3l-5.6 2.9 1.1-6.3L2.9 9.5l6.3-.9z" />
  </Svg>
);
const LeafIcon = (p) => <Svg {...p}><path d="M5 19.5C5 10.8 10.5 5 20 4.5c-.2 9.3-6 15-14.5 15" /><path d="M5 19.5 14.5 10" /></Svg>;
const TruckIcon = (p) => <Svg {...p}><path d="M2.5 6.5h11.5v9.5H2.5zM14 10h4.2l3.3 3.4v2.6H14" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></Svg>;
const ShieldIcon = (p) => <Svg {...p}><path d="M12 3l7 2.8v5.4c0 4.6-3 8-7 9.8-4-1.8-7-5.2-7-9.8V5.8z" /><path d="m9 12.2 2.1 2.1L15.2 10" /></Svg>;
const PlaneIcon = (p) => <Svg {...p}><path d="M21.5 2.5 2.5 10.2l7.3 2.7 2.7 7.6z" /><path d="M21.5 2.5 9.8 12.9" /></Svg>;

const PERK_ICONS = { leaf: LeafIcon, truck: TruckIcon, shield: ShieldIcon, heart: HeartIcon };

const SOCIALS = [
  {
    name: "Instagram",
    icon: (
      <Svg size={20}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </Svg>
    ),
  },
  {
    name: "Facebook",
    icon: (
      <Svg size={20} stroke="none">
        <path fill="currentColor" d="M13.6 21v-7.6h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H8v3h2.6V21z" />
      </Svg>
    ),
  },
  {
    name: "Pinterest",
    icon: (
      <Svg size={20}>
        <circle cx="12" cy="12" r="9" />
        <path d="M10 20.4 11.9 12.2M11.3 8.4c.6-.4 1.4-.7 2.2-.7 2 0 3.2 1.3 3.2 3.1 0 2.2-1.4 3.9-3.2 3.9-.8 0-1.5-.3-1.8-.9" />
      </Svg>
    ),
  },
  {
    name: "YouTube",
    icon: (
      <Svg size={20} stroke="none">
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="currentColor" />
        <path d="M10.2 9.3v5.4l4.6-2.7z" fill="#fff" />
      </Svg>
    ),
  },
  {
    name: "TikTok",
    icon: (
      <Svg size={20} stroke="none">
        <path fill="currentColor" d="M14.6 3.5c.3 2.3 1.8 3.9 4 4.2v2.8c-1.5 0-2.9-.5-4-1.3v6.1a5.2 5.2 0 1 1-5.2-5.2l.8.1v2.9a2.4 2.4 0 1 0 1.6 2.3V3.5z" />
      </Svg>
    ),
  },
];

function Sparkle() {
  return (
    <svg className="nk-sparkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M5 8.5 8.5 11M5 15h4M5.5 21l3.5-3" />
    </svg>
  );
}

function Sprig() {
  return (
    <svg className="nk-sprig" viewBox="0 0 40 92" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M20 90V10" />
      <path d="M20 32c-8-2-12-8-12-17 8 1 12 8 12 17zM20 52c8-2 12-8 12-17-8 1-12 8-12 17zM20 72c-8-2-12-8-12-17 8 1 12 8 12 17zM20 18c5-2 8-7 8-14-5 1-8 6-8 14z" />
    </svg>
  );
}

/* ---------------------------------- logo ---------------------------------- */

function Logo() {
  return (
    <a href="#home" className="nk-logo" aria-label="NIAA Kids, home">
      <svg className="nk-logo-mark" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d={HEART} />
      </svg>
      <span className="nk-logo-word">NIAA KIDS</span>
    </a>
  );
}

function Stars({ value, size = 14 }) {
  const row = [0, 1, 2, 3, 4].map((i) => <StarIcon key={i} size={size} />);
  return (
    <span className="nk-stars" role="img" aria-label={`Rated ${value} out of 5`}>
      <span className="nk-stars-row nk-stars-base">{row}</span>
      <span className="nk-stars-fill" style={{ width: `${(value / 5) * 100}%` }}>
        <span className="nk-stars-row">{row}</span>
      </span>
    </span>
  );
}

/* --------------------------------- header --------------------------------- */

function Header({ cartCount, onOpenCart, onAdd }) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null); // { q, items } or { q, error: true }
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // live product search (debounced, cancels stale requests)
  useEffect(() => {
    const q = query.trim();
    if (!q) return undefined;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      api(`/products?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((d) => setResults({ q, items: d.products }))
        .catch((err) => {
          if (err.name !== "AbortError") setResults({ q, error: true });
        });
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  // close the results panel on an outside click or Escape
  useEffect(() => {
    if (!showResults) return undefined;
    const onDown = (e) => {
      if (!searchRef.current?.contains(e.target)) setShowResults(false);
    };
    const onKey = (e) => e.key === "Escape" && setShowResults(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [showResults]);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const q = query.trim();
  const panelOpen = showResults && q.length > 0;
  const current = results && results.q === q ? results : null;

  return (
    <header className={`nk-header${stuck ? " is-stuck" : ""}`}>
      <div className="nk-wrap nk-header-row">
        <button
          type="button"
          className="nk-iconbtn nk-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nk-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>

        <Logo />

        <nav id="nk-nav" className={`nk-nav${open ? " is-open" : ""}`} aria-label="Primary">
          {NAV.map((item, i) => (
            <a
              key={item}
              href={i === 0 ? "#home" : `#${slug(item)}`}
              className={i === 0 ? "is-active" : undefined}
              aria-current={i === 0 ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="nk-tools">
          <div className="nk-search-wrap" ref={searchRef}>
            <form
              className="nk-search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                setShowResults(true);
              }}
            >
              <SearchIcon size={18} />
              <input
                type="search"
                placeholder="Search for outfits, sets, more..."
                aria-label="Search products"
                aria-controls="nk-search-results"
                aria-expanded={panelOpen}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
              />
            </form>

            {panelOpen && (
              <div className="nk-results" id="nk-search-results" role="region" aria-label="Search results" aria-live="polite">
                {!current ? (
                  <p className="nk-results-note">Searching…</p>
                ) : current.error ? (
                  <p className="nk-results-note">Search is unavailable right now.</p>
                ) : current.items.length === 0 ? (
                  <p className="nk-results-note">No matches for “{q}”.</p>
                ) : (
                  <ul>
                    {current.items.slice(0, 6).map((p) => (
                      <li key={p.id} className="nk-result">
                        <img src={IMG + p.img} alt="" />
                        <span className="nk-result-text">
                          <span>{p.name}</span>
                          <b>{price(p.price)}</b>
                        </span>
                        <button type="button" className="nk-result-add" aria-label={`Add ${p.name} to bag`} onClick={() => onAdd(p)}>
                          <PlusIcon size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="nk-icons">
            <a href="#account" className="nk-iconbtn" aria-label="Account">
              <UserIcon size={23} />
            </a>
            <button
              type="button"
              className="nk-iconbtn"
              aria-label={`Open shopping bag, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              onClick={onOpenCart}
            >
              <BagIcon size={23} />
              <span key={cartCount} className="nk-count">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------- hero ---------------------------------- */

function Hero() {
  return (
    <section className="nk-hero" id="home" aria-labelledby="nk-hero-title">
      <div className="nk-hero-media">
        <img src={IMG + "hero-baby.jpg"} alt="Laughing baby in a knit bear-ear hoodie lying on a soft rug" />
        <div className="nk-hero-badge" aria-hidden="true">
          <span>
            Comfort
            <br />
            Today
            <br />
            Brighter
            <br />
            Tomorrow
          </span>
          <HeartIcon size={18} />
        </div>
      </div>

      <div className="nk-wrap nk-hero-inner">
        <div className="nk-hero-copy nk-rise">
          <p className="nk-eyebrow">New season, more smiles</p>
          <h1 id="nk-hero-title">
            Adorable Outfits
            <br />
            for Every Little
            <br />
            Adventure
            <svg className="nk-heart-doodle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M12 19.5c-4.6-3.4-7.6-6.4-7.6-9.6 0-2.1 1.6-3.6 3.5-3.6 1.6 0 3.1 1.1 4.1 3.4M12 19.5c3.3-2.5 6.2-5.6 7-8.9" />
            </svg>
          </h1>
          <p className="nk-hero-sub">Soft fabrics. Thoughtful designs. Happier little days.</p>
          <div className="nk-hero-ctas">
            <a href="#new-arrivals" className="nk-btn nk-btn-solid">
              Shop Now <ArrowRight size={18} />
            </a>
            <a href="#shop" className="nk-btn nk-btn-ghost">
              Explore Collection
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- categories ------------------------------- */

function Categories({ onSelect, onShowAll }) {
  return (
    <section className="nk-wrap nk-section" id="shop" aria-labelledby="nk-cat-title">
      <div className="nk-head">
        <h2 id="nk-cat-title">
          Shop by Category <Sparkle />
        </h2>
        <button type="button" className="nk-viewall" onClick={onShowAll}>
          View All <ArrowRight size={16} />
        </button>
      </div>
      <div className="nk-cats nk-scroll">
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" className="nk-cat" onClick={() => onSelect(c)}>
            <span className="nk-cat-img">
              <img src={IMG + c.img} alt="" loading="lazy" />
            </span>
            <span className="nk-cat-label">
              {c.label.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- favourites ------------------------------ */

function ProductGrid({ view, products, loading, liked, onToggleWish, onAdd, onShowFeatured, onShowAll }) {
  const featured = view.kind === "featured";
  const heading = featured ? "Featured Favorites" : view.kind === "all" ? "All Products" : view.label;
  const sub = featured
    ? "Loved by parents. Made for little moments."
    : `${products.length} piece${products.length === 1 ? "" : "s"} picked for little explorers.`;

  return (
    <section className="nk-wrap nk-section" id="new-arrivals" aria-labelledby="nk-fav-title">
      <div className="nk-head">
        <div>
          <h2 id="nk-fav-title">
            {heading} {featured && <HeartIcon filled size={20} className="nk-head-heart" />}
          </h2>
          <p className="nk-sub">{sub}</p>
        </div>
        {featured ? (
          <button type="button" className="nk-viewall" onClick={onShowAll}>
            View All <ArrowRight size={16} />
          </button>
        ) : (
          <button type="button" className="nk-viewall" onClick={onShowFeatured}>
            <ArrowLeft size={16} /> Back to Favorites
          </button>
        )}
      </div>

      <div className={`nk-products nk-scroll${loading ? " is-loading" : ""}`} aria-busy={loading}>
        {products.map((p) => {
          const isLiked = liked.has(p.id);
          return (
            <article key={p.id} className="nk-product">
              <div className="nk-product-media">
                <img src={IMG + p.img} alt={p.alt} loading="lazy" />
                <button
                  type="button"
                  className={`nk-wish${isLiked ? " is-on" : ""}`}
                  aria-pressed={isLiked}
                  aria-label={`${isLiked ? "Remove" : "Save"} ${p.name} ${isLiked ? "from" : "to"} wishlist`}
                  onClick={() => onToggleWish(p)}
                >
                  <HeartIcon filled={isLiked} size={19} />
                </button>
                <button type="button" className="nk-quickadd" onClick={() => onAdd(p)}>
                  <BagIcon size={16} /> Add to Bag
                </button>
              </div>
              <h3>{p.name}</h3>
              <p className="nk-price">{price(p.price)}</p>
              <div className="nk-rating">
                <Stars value={p.rating} />
                <span>({p.reviews})</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------------- promos -------------------------------- */

function Promos() {
  return (
    <section className="nk-wrap nk-promos" id="collections" aria-label="Collections">
      <article className="nk-promo nk-promo-new">
        <img src={IMG + "promo-new-arrivals.jpg"} alt="Smiling baby in a sage sweater and knit beanie" loading="lazy" />
        <div className="nk-promo-copy">
          <h2>New Arrivals</h2>
          <p>
            Fresh styles for
            <br />
            brighter days.
          </p>
          <a href="#new-arrivals" className="nk-btn nk-btn-solid nk-btn-sm">
            Shop New <ArrowRight size={16} />
          </a>
        </div>
        <p className="nk-promo-note" aria-hidden="true">
          Little
          <br />
          Looks
          <br />
          Big
          <br />
          Adventures
          <HeartIcon size={16} />
        </p>
      </article>

      <article className="nk-promo nk-promo-sale">
        <img src={IMG + "promo-seasonal.jpg"} alt="Stack of soft knitwear with daisies and a tag reading Good Outfits Brighter Days" loading="lazy" />
        <div className="nk-promo-copy">
          <h2 className="nk-promo-kicker">Seasonal Offer</h2>
          <p className="nk-upto">Up to</p>
          <p className="nk-big">30% OFF</p>
          <p>Cozy styles for the season ahead.</p>
          <a href="#new-arrivals" className="nk-btn nk-btn-solid nk-btn-sm">
            Shop the Sale <ArrowRight size={16} />
          </a>
        </div>
      </article>
    </section>
  );
}

function Perks() {
  return (
    <section className="nk-wrap nk-perks" aria-label="Why parents shop with us">
      {PERKS.map((perk) => {
        const Icon = PERK_ICONS[perk.icon];
        return (
          <div key={perk.title} className="nk-perk">
            <span className="nk-perk-icon">
              <Icon size={26} />
            </span>
            <div>
              <h3>{perk.title}</h3>
              <p>{perk.text}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function Reviews() {
  return (
    <section className="nk-wrap nk-section" id="about" aria-labelledby="nk-rev-title">
      <div className="nk-head">
        <div>
          <h2 id="nk-rev-title">
            Happy Parents, Happier Babies <HeartIcon filled size={20} className="nk-head-heart" />
          </h2>
          <p className="nk-sub">Real stories from our amazing community.</p>
        </div>
      </div>
      <div className="nk-reviews">
        {REVIEWS.map((r) => (
          <figure key={r.name} className="nk-review">
            <img src={IMG + r.img} alt="" loading="lazy" />
            <div>
              <Stars value={5} size={15} />
              <blockquote>“{r.text}”</blockquote>
              <figcaption>– {r.name}</figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Newsletter({ notify }) {
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setBusy(true);
    try {
      const d = await api("/newsletter", { method: "POST", body: { email } });
      notify(
        d.status === "already-subscribed"
          ? "You're already part of our Little Circle — thank you!"
          : "Welcome to the Little Circle! Thanks for subscribing."
      );
      form.reset();
    } catch (err) {
      notify(err.status === 400 ? err.message : UNAVAILABLE);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="nk-band" aria-labelledby="nk-band-title">
      <div className="nk-wrap nk-band-row">
        <PlaneIcon size={52} strokeWidth="1.3" className="nk-band-icon" />
        <div className="nk-band-copy">
          <h2 id="nk-band-title">Join Our Little Circle</h2>
          <p>Get exclusive offers, new arrivals and parenting tips straight to your inbox.</p>
        </div>
        <form className="nk-band-form" onSubmit={submit}>
          <label htmlFor="nk-email" className="nk-sr">
            Email address
          </label>
          <input id="nk-email" name="email" type="email" required placeholder="Your email address" autoComplete="email" />
          <button type="submit" disabled={busy}>
            {busy ? "Joining…" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="nk-footer">
      <div className="nk-wrap nk-foot-grid">
        <div className="nk-foot-brand">
          <a href="#home" aria-label="NIAA Kids, back to top">
            <img className="nk-foot-logo" src={IMG + "logo-full.png"} alt="NIAA Kids — playful daily wear" width="476" height="498" loading="lazy" />
          </a>
          <div className="nk-socials">
            {SOCIALS.map((s) => (
              <a key={s.name} href={`#${slug(s.name)}`} aria-label={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {FOOTER.map((col) => (
          <nav key={col.title} className="nk-foot-col" aria-label={col.title}>
            <h3>{col.title}</h3>
            {col.links.map((l) => (
              <a key={l} href={`#${slug(l)}`}>
                {l}
              </a>
            ))}
          </nav>
        ))}

        <div className="nk-foot-note" aria-hidden="true">
          <p>
            Little People
            <br />
            Brighter Tomorrows
            <HeartIcon size={18} />
          </p>
          <Sprig />
        </div>
      </div>

      <div className="nk-wrap nk-foot-bottom">
        <span>© 2026 NIAA Kids. All rights reserved.</span>
        <span className="nk-foot-love">
          Made with love, just for you <HeartIcon filled size={14} />
        </span>
      </div>
    </footer>
  );
}

/* -------------------------------- cart drawer ----------------------------- */

function CartDrawer({ cart, onClose, onQty, onRemove, onCheckout }) {
  const [order, setOrder] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setPlacing(true);
    setError("");
    try {
      setOrder(await onCheckout({ name: data.get("name"), email: data.get("email") }));
    } catch (err) {
      setError(err.status === 400 ? err.message : UNAVAILABLE);
    } finally {
      setPlacing(false);
    }
  };

  const items = cart?.items ?? [];
  const progress = cart ? Math.min(100, (cart.subtotal / cart.freeShippingThreshold) * 100) : 0;
  const title = order ? "Order placed" : `Your Bag${cart?.count ? ` (${cart.count})` : ""}`;

  return (
    <div className="nk-drawer-root">
      <div className="nk-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="nk-drawer" role="dialog" aria-modal="true" aria-labelledby="nk-drawer-title">
        <header className="nk-drawer-head">
          <h2 id="nk-drawer-title">{title}</h2>
          <button ref={closeRef} type="button" className="nk-iconbtn" onClick={onClose} aria-label="Close bag">
            <CloseIcon size={22} />
          </button>
        </header>

        {order ? (
          <div className="nk-drawer-body nk-drawer-center">
            <img className="nk-drawer-art" src={IMG + "logo-icon.png"} alt="" />
            <p className="nk-thanks-script">
              Thank You <HeartIcon size={30} />
            </p>
            <p>for supporting our small business and choosing us!</p>
            <dl className="nk-thanks-card">
              <dt>Order number</dt>
              <dd>{order.code}</dd>
              <dt>Total</dt>
              <dd>{price(order.total)}</dd>
            </dl>
            <button type="button" className="nk-btn nk-btn-solid" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : !cart ? (
          <div className="nk-drawer-body nk-drawer-center">
            <p>{UNAVAILABLE}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="nk-drawer-body nk-drawer-center">
            <img className="nk-drawer-art" src={IMG + "logo-icon.png"} alt="" />
            <h3>Your bag is empty</h3>
            <p>Little outfits are waiting for you.</p>
            <button type="button" className="nk-btn nk-btn-solid" onClick={onClose}>
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="nk-drawer-body">
              <div className="nk-ship">
                <p>
                  {cart.remainingForFreeShipping > 0 ? (
                    <>
                      You're <b>{price(cart.remainingForFreeShipping)}</b> away from free shipping
                    </>
                  ) : (
                    <>
                      You've unlocked <b>free shipping</b>!
                    </>
                  )}
                </p>
                <span className="nk-ship-bar">
                  <span style={{ width: `${progress}%` }} />
                </span>
              </div>

              <ul className="nk-lines">
                {items.map((item) => (
                  <li key={item.id} className="nk-line">
                    <img src={IMG + item.img} alt="" />
                    <div className="nk-line-info">
                      <p className="nk-line-name">{item.name}</p>
                      <p className="nk-line-price">{price(item.price)}</p>
                      <div className="nk-stepper">
                        <button type="button" aria-label={`Decrease quantity of ${item.name}`} onClick={() => onQty(item, item.qty - 1)}>
                          <MinusIcon size={14} />
                        </button>
                        <span aria-label={`Quantity ${item.qty}`}>{item.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={item.qty >= 20}
                          onClick={() => onQty(item, item.qty + 1)}
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="nk-line-end">
                      <b>{price(item.lineTotal)}</b>
                      <button type="button" className="nk-line-remove" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item)}>
                        <TrashIcon size={17} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <form className="nk-drawer-foot" onSubmit={submit}>
              <dl className="nk-totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{price(cart.subtotal)}</dd>
                </div>
                <div>
                  <dt>Shipping</dt>
                  <dd>{cart.shipping === 0 ? "Free" : price(cart.shipping)}</dd>
                </div>
                <div className="nk-total">
                  <dt>Total</dt>
                  <dd>{price(cart.total)}</dd>
                </div>
              </dl>
              <div className="nk-checkout-fields">
                <label>
                  <span className="nk-sr">Your name</span>
                  <input name="name" required maxLength={80} placeholder="Your name" autoComplete="name" />
                </label>
                <label>
                  <span className="nk-sr">Email address</span>
                  <input name="email" type="email" required placeholder="Email address" autoComplete="email" />
                </label>
              </div>
              {error && (
                <p className="nk-form-error" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="nk-btn nk-btn-solid nk-checkout" disabled={placing}>
                {placing ? "Placing order…" : `Place Order · ${price(cart.total)}`}
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}

/* ----------------------------------- page --------------------------------- */

const PRODUCT_SECTION = "new-arrivals";

export default function NiaaKids() {
  const [view, setView] = useState({ kind: "featured" });
  const [products, setProducts] = useState(FAVORITES); // shown until the API answers
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [liked, setLiked] = useState(() => new Set());
  const [toast, setToast] = useState({ msg: "", show: false });
  const timer = useRef(0);
  const request = useRef(0);

  useEffect(() => {
    document.title = "NIAA Kids — Playful Daily Wear";
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  // initial data from the API — the page still renders with built-in favourites if it is offline
  useEffect(() => {
    const id = ++request.current;
    api("/products?featured=1")
      .then((d) => id === request.current && setProducts(d.products))
      .catch(() => {});
    api("/cart").then(setCart).catch(() => {});
    api("/wishlist")
      .then((d) => setLiked(new Set(d.productIds)))
      .catch(() => {});
  }, []);

  const notify = (msg) => {
    clearTimeout(timer.current);
    setToast({ msg, show: true });
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2800);
  };

  const loadProducts = async (nextView) => {
    const id = ++request.current;
    setView(nextView);
    setLoading(true);
    document.getElementById(PRODUCT_SECTION)?.scrollIntoView({ behavior: "smooth", block: "start" });
    const query =
      nextView.kind === "featured" ? "?featured=1" : nextView.kind === "category" ? `?category=${encodeURIComponent(nextView.id)}` : "";
    try {
      const d = await api(`/products${query}`);
      if (id === request.current) setProducts(d.products);
    } catch {
      if (id === request.current) {
        setView({ kind: "featured" });
        setProducts(FAVORITES);
        notify(UNAVAILABLE);
      }
    } finally {
      if (id === request.current) setLoading(false);
    }
  };

  const addToBag = async (p) => {
    try {
      setCart(await api("/cart/items", { method: "POST", body: { productId: p.id, qty: 1 } }));
      notify(`${p.name} added to your bag`);
    } catch {
      notify(UNAVAILABLE);
    }
  };

  const changeQty = async (item, qty) => {
    try {
      setCart(await api(`/cart/items/${encodeURIComponent(item.id)}`, { method: "PATCH", body: { qty } }));
    } catch {
      notify(UNAVAILABLE);
    }
  };

  const removeItem = async (item) => {
    try {
      setCart(await api(`/cart/items/${encodeURIComponent(item.id)}`, { method: "DELETE" }));
      notify(`${item.name} removed from your bag`);
    } catch {
      notify(UNAVAILABLE);
    }
  };

  const checkout = async (details) => {
    const d = await api("/orders", { method: "POST", body: details });
    setCart(d.cart);
    return d.order;
  };

  const toggleWish = async (p) => {
    const on = !liked.has(p.id);
    const apply = (add) =>
      setLiked((prev) => {
        const next = new Set(prev);
        if (add) next.add(p.id);
        else next.delete(p.id);
        return next;
      });
    apply(on);
    try {
      await api(`/wishlist/${encodeURIComponent(p.id)}`, { method: on ? "PUT" : "DELETE" });
      notify(on ? `${p.name} saved to your wishlist` : `${p.name} removed from your wishlist`);
    } catch {
      apply(!on);
      notify(UNAVAILABLE);
    }
  };

  const openCart = () => {
    setCartOpen(true);
    api("/cart").then(setCart).catch(() => {});
  };
  const closeCart = useCallback(() => setCartOpen(false), []);

  return (
    <div className="nk">
      <style>{CSS}</style>

      <div className="nk-announce">
        <div className="nk-wrap nk-announce-row">
          <p className="nk-announce-main">
            <LeafIcon size={14} /> Free Shipping on Orders Over $50
            <span className="nk-announce-extra">
              <span className="nk-announce-sep">|</span> Soft Styles for Brighter Tomorrows
            </span>
          </p>
          <p className="nk-announce-side">
            <HeartIcon filled size={13} /> A Happier Childhood, A Kinder Planet
          </p>
        </div>
      </div>

      <Header cartCount={cart?.count ?? 0} onOpenCart={openCart} onAdd={addToBag} />

      <main>
        <Hero />
        <Categories
          onSelect={(c) => loadProducts({ kind: "category", id: c.id, label: c.label.join(" ") })}
          onShowAll={() => loadProducts({ kind: "all" })}
        />
        <ProductGrid
          view={view}
          products={products}
          loading={loading}
          liked={liked}
          onToggleWish={toggleWish}
          onAdd={addToBag}
          onShowFeatured={() => loadProducts({ kind: "featured" })}
          onShowAll={() => loadProducts({ kind: "all" })}
        />
        <Promos />
        <Perks />
        <Reviews />
        <Newsletter notify={notify} />
      </main>

      <Footer />

      {cartOpen && (
        <CartDrawer cart={cart} onClose={closeCart} onQty={changeQty} onRemove={removeItem} onCheckout={checkout} />
      )}

      <div className={`nk-toast${toast.show ? " is-visible" : ""}`} role="status" aria-live="polite">
        <HeartIcon filled size={15} />
        {toast.msg}
      </div>
    </div>
  );
}

/* --------------------------------- styles --------------------------------- */

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Lora:ital,wght@0,500..700;1,500&family=Nunito:wght@400..800&display=swap");

:where(.nk) *, :where(.nk) *::before, :where(.nk) *::after { box-sizing: border-box; }
:where(.nk) img { display: block; max-width: 100%; }
:where(.nk) a { color: inherit; }
:where(.nk) button { font: inherit; color: inherit; }
:where(.nk) :is(h1, h2, h3, p, blockquote, figure) { margin: 0; }
:where(.nk) :focus-visible { outline: 2px solid var(--sage-deep); outline-offset: 3px; }

.nk {
  --cream: #faf8f5;
  --ink: #2d2322;
  --ink-2: #5d524c;
  --muted: #8e847e;
  --line: #ebe5df;
  --sage: #707d63;
  --sage-deep: #5c6c51;
  --sage-soft: #98a184;
  --sage-tint: #eceee6;
  --pink: #e29092;
  --peach: #fbd8c4;
  --peach-deep: #d9866e;
  --beige: #f1ece6;
  --card: #efebe7;
  --star: #f5b942;
  --brown: #755c48;
  --serif: "Lora", Georgia, "Times New Roman", serif;
  --sans: "Nunito", system-ui, -apple-system, "Segoe UI", sans-serif;
  --hand: "Caveat", "Segoe Print", cursive;
  --gutter: clamp(16px, 4vw, 40px);
  min-height: 100vh;
  background: var(--cream);
  color: var(--ink);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
}
.nk-wrap { width: min(1280px, 100% - 2 * var(--gutter)); margin-inline: auto; }
.nk-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.nk-scroll { scrollbar-width: none; }
.nk-scroll::-webkit-scrollbar { display: none; }

/* ---------- announcement ---------- */
.nk-announce { background: var(--sage); color: #fff; font-size: 13px; font-weight: 600; }
.nk-announce-row { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; min-height: 36px; }
.nk-announce p { display: flex; align-items: center; gap: 8px; }
.nk-announce-main { grid-column: 2; }
.nk-announce-extra { display: contents; }
.nk-announce-sep { opacity: .6; margin: 0 4px; }
.nk-announce-side { grid-column: 3; justify-self: end; }

/* ---------- header ---------- */
.nk-header {
  position: sticky; top: 0; z-index: 40;
  background: rgba(251, 250, 248, .95);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color .3s, box-shadow .3s;
}
.nk-header.is-stuck { border-color: var(--line); box-shadow: 0 12px 26px -24px rgba(45, 35, 34, .45); }
.nk-header-row {
  display: grid; grid-template-columns: auto 1fr auto; grid-template-areas: "logo nav tools";
  align-items: center; gap: 24px; min-height: 84px;
}
.nk-logo {
  grid-area: logo; display: flex; flex-direction: column; align-items: center; gap: 3px;
  color: var(--ink); text-decoration: none;
}
.nk-logo-mark { width: 22px; height: 22px; color: var(--pink); transition: transform .4s cubic-bezier(.3, 1.6, .5, 1); }
.nk-logo:hover .nk-logo-mark { transform: scale(1.15); }
.nk-logo-word {
  font: 500 clamp(17px, 1.5vw, 21px)/1 var(--serif);
  letter-spacing: .3em; margin-right: -.3em; white-space: nowrap;
}

.nk-nav { grid-area: nav; justify-self: center; display: flex; align-items: center; gap: clamp(18px, 2.4vw, 38px); }
.nk-nav a { position: relative; padding: 8px 0; font-weight: 600; font-size: 15px; color: var(--ink-2); text-decoration: none; transition: color .2s; }
.nk-nav a::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 1px; height: 2px; border-radius: 2px;
  background: var(--sage-deep); transform: scaleX(0); transition: transform .3s ease;
}
.nk-nav a:hover, .nk-nav a.is-active { color: var(--ink); }
.nk-nav a:hover::after, .nk-nav a.is-active::after { transform: scaleX(1); }

.nk-tools { grid-area: tools; display: flex; align-items: center; gap: 14px; }
.nk-search {
  display: flex; align-items: center; gap: 10px;
  width: clamp(200px, 20vw, 290px); height: 44px; padding: 0 16px;
  border: 1px solid var(--line); border-radius: 999px; background: #f6f3ef; color: var(--ink-2);
  transition: border-color .2s, box-shadow .2s, background .2s;
}
.nk-search:focus-within { background: #fff; border-color: #cdd3c4; box-shadow: 0 0 0 4px rgba(112, 125, 99, .14); }
.nk-search input { flex: 1; min-width: 0; height: 100%; border: 0; outline: 0; background: transparent; font: 14px var(--sans); color: var(--ink); }
.nk-search input::placeholder { color: #a39a94; }
.nk-search input::-webkit-search-cancel-button { display: none; }
.nk-search-wrap { position: relative; }
.nk-results {
  position: absolute; top: calc(100% + 8px); right: 0; z-index: 50;
  width: max(100%, 340px); padding: 8px;
  border: 1px solid var(--line); border-radius: 16px; background: #fff;
  box-shadow: 0 24px 48px -24px rgba(45, 35, 34, .35);
  animation: nk-drop .2s ease;
}
.nk-results ul { margin: 0; padding: 0; list-style: none; }
.nk-result { display: flex; align-items: center; gap: 12px; padding: 6px; border-radius: 10px; transition: background .2s; }
.nk-result:hover { background: #f6f3ef; }
.nk-result img { flex: none; width: 46px; height: 46px; border-radius: 10px; object-fit: cover; background: var(--card); }
.nk-result-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.nk-result-text span { overflow: hidden; font-weight: 700; font-size: 14px; white-space: nowrap; text-overflow: ellipsis; }
.nk-result-text b { font-weight: 700; font-size: 13px; color: var(--ink-2); }
.nk-result-add {
  flex: none; display: grid; place-items: center; width: 34px; height: 34px; padding: 0;
  border: 0; border-radius: 50%; background: var(--sage-tint); color: var(--sage-deep); cursor: pointer;
  transition: background .2s, color .2s;
}
.nk-result-add:hover { background: var(--sage-deep); color: #fff; }
.nk-results-note { padding: 12px; font-size: 14px; color: var(--ink-2); }
.nk-icons { display: flex; align-items: center; gap: 4px; }
.nk-iconbtn {
  position: relative; display: grid; place-items: center; width: 42px; height: 42px; padding: 0;
  border: 0; border-radius: 50%; background: transparent; color: var(--ink); cursor: pointer; text-decoration: none;
  transition: background .2s;
}
.nk-iconbtn:hover { background: var(--sage-tint); }
.nk-count {
  position: absolute; top: 3px; right: 2px; min-width: 18px; height: 18px; padding: 0 5px;
  border-radius: 9px; background: var(--ink); color: #fff; font: 800 10.5px/18px var(--sans); text-align: center;
  animation: nk-pop .45s cubic-bezier(.3, 1.6, .5, 1);
}
.nk-burger { display: none; grid-area: burger; }

/* ---------- hero ---------- */
.nk-hero { position: relative; isolation: isolate; overflow: hidden; background: #efe9e3; }
.nk-hero-media { position: absolute; inset: 0; z-index: -1; }
.nk-hero-media > img { width: 100%; height: 100%; object-fit: cover; object-position: 62% 40%; }
.nk-hero-media::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(250, 247, 243, .94) 0%, rgba(250, 247, 243, .86) 27%, rgba(250, 247, 243, .38) 44%, rgba(250, 247, 243, 0) 58%);
}
.nk-hero-badge {
  position: absolute; z-index: 1; top: 5%; right: 7%;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  width: clamp(112px, 10.5vw, 158px); aspect-ratio: 1; border-radius: 50%;
  background: #f9d3c0; color: #4b3a33; text-align: center;
  font: 600 clamp(18px, 1.65vw, 25px)/1 var(--hand);
  box-shadow: 0 16px 30px -20px rgba(150, 90, 60, .6);
  transform: rotate(-8deg);
  animation: nk-float 6s ease-in-out infinite;
}
.nk-hero-inner { display: flex; align-items: center; min-height: clamp(440px, 34vw, 560px); padding-block: 48px; }
.nk-hero-copy { max-width: 560px; }
.nk-eyebrow { font-size: 13px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-2); }
.nk-hero h1 { margin-top: 16px; font: 600 clamp(2.3rem, 4.4vw, 3.9rem)/1.1 var(--serif); letter-spacing: -.01em; color: var(--ink); }
.nk-heart-doodle { display: inline-block; width: .55em; height: .55em; margin-left: .2em; vertical-align: -.05em; color: var(--ink-2); }
.nk-hero-sub { margin-top: 16px; font-size: clamp(15.5px, 1.3vw, 18.5px); color: var(--ink-2); }
.nk-hero-ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px; }

.nk-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  height: 52px; padding: 0 30px; border-radius: 999px;
  font: 700 15px/1 var(--sans); text-decoration: none; white-space: nowrap; cursor: pointer;
  transition: background .25s, border-color .25s, color .25s, box-shadow .25s, transform .25s;
}
.nk-btn svg { transition: transform .3s; }
.nk-btn:hover svg { transform: translateX(4px); }
.nk-btn-solid { border: 0; background: var(--sage-deep); color: #fff; box-shadow: 0 12px 24px -16px rgba(70, 90, 60, .85); }
.nk-btn-solid:hover { background: #4e5d44; }
.nk-btn-ghost { border: 1.5px solid #cdc4bc; background: rgba(255, 255, 255, .55); color: var(--ink); }
.nk-btn-ghost:hover { border-color: var(--ink); background: #fff; }
.nk-btn-sm { height: 44px; padding: 0 22px; font-size: 14px; }

/* ---------- section heads ---------- */
.nk-section { padding-top: clamp(40px, 5vw, 64px); scroll-margin-top: 60px; }
.nk-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: clamp(18px, 2vw, 26px); }
.nk-head > div { min-width: 0; }
.nk-head h2 { font: 600 clamp(1.55rem, 2.4vw, 2.1rem)/1.15 var(--serif); }
.nk-head h2 svg { display: inline-block; margin-left: 6px; vertical-align: -.08em; }
.nk-head-heart { color: #f2c3b6; }
.nk-sparkle { width: 22px; height: 22px; color: var(--muted); }
.nk-sub { margin-top: 6px; font-size: 15px; color: var(--ink-2); }
.nk-viewall {
  display: inline-flex; align-items: center; gap: 6px; flex: none; padding: 0;
  border: 0; background: none; color: var(--ink); cursor: pointer;
  font-weight: 700; font-size: 14.5px; text-decoration: none; transition: color .2s;
}
.nk-viewall svg { transition: transform .3s; }
.nk-viewall:hover { color: var(--sage-deep); }
.nk-viewall:hover svg { transform: translateX(3px); }

/* ---------- categories ---------- */
.nk-cats { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: clamp(10px, 1.6vw, 24px); }
.nk-cat {
  display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 0;
  border: 0; background: none; color: var(--ink); cursor: pointer; text-decoration: none;
}
.nk-cat-img {
  width: 100%; max-width: 158px; aspect-ratio: 1; overflow: hidden; border-radius: 50%; background: var(--beige);
  transition: transform .3s, box-shadow .3s;
}
.nk-cat-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2, .7, .2, 1); }
.nk-cat:hover .nk-cat-img { transform: translateY(-4px); box-shadow: 0 0 0 3px #fff, 0 0 0 5px var(--sage-soft), 0 18px 30px -20px rgba(60, 50, 40, .55); }
.nk-cat:hover .nk-cat-img img { transform: scale(1.06); }
.nk-cat-label { display: flex; flex-direction: column; align-items: center; font-weight: 700; font-size: 14px; line-height: 1.25; text-align: center; }

/* ---------- products ---------- */
.nk-products { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: clamp(12px, 1.6vw, 22px) clamp(12px, 1.6vw, 22px); row-gap: 28px; transition: opacity .2s; }
.nk-products.is-loading { opacity: .5; }
.nk-product { min-width: 0; scroll-snap-align: start; }
.nk-product-media { position: relative; overflow: hidden; aspect-ratio: 123 / 125; border-radius: 12px; background: var(--card); }
.nk-product-media img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2, .7, .2, 1); }
.nk-product:hover .nk-product-media img { transform: scale(1.05); }
.nk-wish {
  position: absolute; top: 10px; right: 10px; display: grid; place-items: center; width: 36px; height: 36px; padding: 0;
  border: 0; border-radius: 50%; background: rgba(255, 255, 255, .7); color: var(--ink); cursor: pointer;
  transition: background .2s, color .2s, transform .2s;
}
.nk-wish:hover { background: #fff; transform: scale(1.08); }
.nk-wish.is-on { color: var(--pink); animation: nk-pop .4s cubic-bezier(.3, 1.6, .5, 1); }
.nk-quickadd {
  position: absolute; left: 10px; right: 10px; bottom: 10px;
  display: flex; align-items: center; justify-content: center; gap: 8px; height: 42px;
  border: 0; border-radius: 999px; background: var(--sage-deep); color: #fff;
  font-weight: 700; font-size: 13.5px; cursor: pointer;
  opacity: 0; transform: translateY(8px); transition: opacity .25s, transform .25s, background .2s;
}
.nk-quickadd:hover { background: #4e5d44; }
.nk-product:hover .nk-quickadd, .nk-quickadd:focus-visible { opacity: 1; transform: none; }
.nk-product h3 { margin-top: 12px; font-weight: 700; font-size: 15px; line-height: 1.3; }
.nk-price { margin-top: 2px; font-weight: 800; font-size: 15px; }
.nk-rating { display: flex; align-items: center; gap: 6px; margin-top: 5px; font-size: 13px; color: var(--muted); }

.nk-stars { position: relative; display: inline-flex; }
.nk-stars-row { display: flex; gap: 2px; width: max-content; }
.nk-stars-base { color: #e9e1d7; }
.nk-stars-fill { position: absolute; top: 0; left: 0; height: 100%; overflow: hidden; color: var(--star); }

/* ---------- promos ---------- */
.nk-promos { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(12px, 1.6vw, 22px); margin-top: clamp(40px, 5vw, 64px); }
.nk-promo {
  position: relative; isolation: isolate; overflow: hidden;
  display: flex; align-items: center; min-height: clamp(240px, 21vw, 300px);
  padding: clamp(22px, 3vw, 44px); border-radius: 16px;
}
.nk-promo > img { position: absolute; z-index: -1; transition: transform 1s cubic-bezier(.2, .7, .2, 1); }
.nk-promo:hover > img { transform: scale(1.03); }
.nk-promo-copy { position: relative; max-width: 48%; }
.nk-promo-copy h2 { font: 600 clamp(1.6rem, 2.4vw, 2.25rem)/1.1 var(--serif); }
.nk-promo-copy p { margin-top: 8px; font-size: 16px; line-height: 1.45; color: var(--ink-2); }
.nk-promo-copy .nk-btn { margin-top: 18px; }

.nk-promo-new { background: #e6e4e3; }
.nk-promo-new > img { inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 70% center; }
.nk-promo-new::after {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(90deg, rgba(238, 236, 234, .8), rgba(238, 236, 234, .35) 34%, rgba(238, 236, 234, 0) 52%);
}
.nk-promo-note {
  position: absolute; top: 11%; right: 5%;
  display: flex; flex-direction: column; align-items: center;
  font: 500 clamp(18px, 1.75vw, 25px)/1.02 var(--hand); color: #6b5f58; text-align: center;
  transform: rotate(-4deg);
}
.nk-promo-note svg { margin-top: 6px; }

.nk-promo-sale { background: var(--peach); }
.nk-promo-sale > img {
  top: 0; right: 0; width: 64%; height: 100%; object-fit: cover; object-position: right center;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 30%);
  mask-image: linear-gradient(90deg, transparent 0%, #000 30%);
}
.nk-promo-copy .nk-promo-kicker { font-size: clamp(1.2rem, 1.7vw, 1.55rem); }
.nk-promo-copy .nk-upto { margin-top: 10px; font-weight: 800; font-size: 13px; letter-spacing: .3em; text-transform: uppercase; color: var(--peach-deep); }
.nk-promo-copy .nk-big { margin-top: 0; font: 700 clamp(2.5rem, 4vw, 3.6rem)/1 var(--serif); color: var(--ink); letter-spacing: -.01em; }

/* ---------- perks ---------- */
.nk-perks { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: clamp(36px, 4vw, 52px); }
.nk-perk { display: flex; align-items: center; gap: 16px; }
.nk-perk-icon { flex: none; display: grid; place-items: center; width: 60px; height: 60px; border-radius: 50%; background: var(--sage-tint); color: #4c5545; }
.nk-perk h3 { font: 600 16px/1.25 var(--serif); }
.nk-perk p { margin-top: 3px; font-size: 14px; line-height: 1.4; color: var(--ink-2); }

/* ---------- reviews ---------- */
.nk-reviews { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(12px, 1.6vw, 22px); }
.nk-review {
  display: flex; align-items: flex-start; gap: 18px; padding: 22px;
  border: 1px solid var(--line); border-radius: 16px; background: #fff;
  box-shadow: 0 14px 30px -28px rgba(60, 40, 30, .45);
  transition: transform .3s, box-shadow .3s;
}
.nk-review:hover { transform: translateY(-3px); box-shadow: 0 20px 36px -28px rgba(60, 40, 30, .55); }
.nk-review > img { flex: none; width: 64px; height: 64px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 3px #fff, 0 0 0 4px var(--line); }
.nk-review blockquote { margin-top: 8px; font-size: 14.5px; line-height: 1.5; color: var(--ink-2); }
.nk-review figcaption { margin-top: 10px; font-weight: 800; font-size: 14px; }

/* ---------- newsletter band ---------- */
.nk-band { margin-top: clamp(44px, 5vw, 64px); background: var(--sage); color: #fff; }
.nk-band-row { display: flex; align-items: center; gap: clamp(16px, 2.4vw, 32px); padding-block: clamp(22px, 2.6vw, 30px); }
.nk-band-icon { flex: none; transform: rotate(-6deg); }
.nk-band-copy { flex: 1; min-width: 0; }
.nk-band-copy h2 { font: 600 clamp(1.4rem, 2.2vw, 1.95rem)/1.15 var(--serif); }
.nk-band-copy p { margin-top: 4px; font-size: 15px; opacity: .88; }
.nk-band-form {
  display: flex; flex: 0 1 470px; padding: 5px;
  border: 2px solid rgba(255, 255, 255, .5); border-radius: 999px; background: #fff;
}
.nk-band-form input { flex: 1; min-width: 0; padding: 0 18px; border: 0; outline: 0; background: transparent; font: 15px var(--sans); color: var(--ink); }
.nk-band-form button {
  height: 46px; padding: 0 30px; border: 0; border-radius: 999px;
  background: var(--sage-deep); color: #fff; font-weight: 700; font-size: 15px; cursor: pointer; transition: background .2s;
}
.nk-band-form button:hover { background: #4e5d44; }

/* ---------- footer ---------- */
.nk-footer { padding-top: clamp(36px, 4vw, 52px); }
.nk-foot-grid { display: grid; grid-template-columns: 1.2fr repeat(3, .75fr) 1.1fr; gap: 32px; align-items: start; }
.nk-foot-logo { width: 132px; height: auto; }
.nk-socials { display: flex; gap: 6px; margin-top: 16px; margin-left: -8px; }
.nk-socials a { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; color: var(--ink); transition: background .2s, color .2s; }
.nk-socials a:hover { background: var(--sage-tint); color: var(--sage-deep); }
.nk-foot-col { display: flex; flex-direction: column; }
.nk-foot-col h3 { margin-bottom: 10px; font-weight: 800; font-size: 15px; }
.nk-foot-col a { padding: 5px 0; font-size: 14.5px; color: var(--ink-2); text-decoration: none; transition: color .2s; }
.nk-foot-col a:hover { color: var(--sage-deep); }
.nk-foot-note { justify-self: end; display: flex; align-items: center; gap: 10px; color: #6f645d; }
.nk-foot-note p {
  display: flex; flex-direction: column; align-items: center;
  font: 500 clamp(22px, 2vw, 28px)/1.05 var(--hand); text-align: center; transform: rotate(-7deg);
}
.nk-foot-note p svg { margin-top: 6px; }
.nk-sprig { width: 34px; height: 80px; color: #9a908a; }
.nk-foot-bottom {
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px 24px;
  margin-top: clamp(28px, 3vw, 40px); padding-block: 20px 28px; border-top: 1px solid var(--line);
  font-size: 13.5px; color: var(--muted);
}
.nk-foot-love { display: inline-flex; align-items: center; gap: 6px; }
.nk-foot-love svg { color: var(--pink); }

/* ---------- cart drawer ---------- */
.nk-drawer-root { position: fixed; inset: 0; z-index: 90; }
.nk-overlay {
  position: absolute; inset: 0; background: rgba(45, 35, 34, .38);
  -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px); animation: nk-fade .25s ease;
}
.nk-drawer {
  position: absolute; top: 0; right: 0; bottom: 0; width: min(430px, 100%);
  display: flex; flex-direction: column; background: var(--cream);
  box-shadow: -24px 0 60px -30px rgba(45, 35, 34, .5);
  animation: nk-slide .32s cubic-bezier(.2, .7, .2, 1);
}
.nk-drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 16px 14px 24px; border-bottom: 1px solid var(--line); }
.nk-drawer-head h2 { font: 600 1.35rem/1.2 var(--serif); }
.nk-drawer-body { flex: 1; overflow-y: auto; padding: 18px 24px; }
.nk-drawer-center { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-align: center; }
.nk-drawer-center h3 { font: 600 1.3rem/1.2 var(--serif); }
.nk-drawer-center p { color: var(--ink-2); line-height: 1.5; }
.nk-drawer-center .nk-btn { margin-top: 10px; }
.nk-drawer-art { width: 160px; height: auto; margin-bottom: 4px; }
.nk-thanks-script { display: flex; align-items: center; gap: 6px; font: 600 3.1rem/1 var(--hand); color: var(--pink) !important; }
.nk-thanks-card {
  display: grid; grid-template-columns: auto auto; gap: 6px 22px; margin: 10px 0 0; padding: 14px 22px;
  border: 1px dashed #e8c3c0; border-radius: 14px; background: #fff; font-size: 14px; text-align: left;
}
.nk-thanks-card dt { color: var(--ink-2); }
.nk-thanks-card dd { margin: 0; font-weight: 800; text-align: right; }

.nk-ship { padding: 12px 14px; border-radius: 12px; background: var(--sage-tint); font-size: 14px; }
.nk-ship-bar { display: block; height: 6px; margin-top: 8px; overflow: hidden; border-radius: 3px; background: #dde2d4; }
.nk-ship-bar span { display: block; height: 100%; border-radius: inherit; background: var(--sage-deep); transition: width .4s ease; }
.nk-lines { margin: 8px 0 0; padding: 0; list-style: none; }
.nk-line { display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--line); }
.nk-line > img { flex: none; width: 76px; height: 76px; border-radius: 12px; object-fit: cover; background: var(--card); }
.nk-line-info { flex: 1; min-width: 0; }
.nk-line-name { font-weight: 700; font-size: 15px; line-height: 1.3; }
.nk-line-price { margin-top: 2px; font-size: 13.5px; color: var(--ink-2); }
.nk-stepper {
  display: inline-flex; align-items: center; gap: 4px; margin-top: 8px; padding: 3px;
  border: 1px solid var(--line); border-radius: 999px; background: #fff;
}
.nk-stepper button {
  display: grid; place-items: center; width: 28px; height: 28px; padding: 0;
  border: 0; border-radius: 50%; background: none; cursor: pointer; transition: background .2s;
}
.nk-stepper button:hover { background: var(--sage-tint); }
.nk-stepper button:disabled { opacity: .35; cursor: default; background: none; }
.nk-stepper span { min-width: 22px; text-align: center; font-weight: 800; font-size: 14px; }
.nk-line-end { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; }
.nk-line-end b { font-weight: 800; font-size: 15px; }
.nk-line-remove {
  display: grid; place-items: center; width: 32px; height: 32px; padding: 0;
  border: 0; border-radius: 50%; background: none; color: var(--muted); cursor: pointer; transition: background .2s, color .2s;
}
.nk-line-remove:hover { background: #f8e9e6; color: #b4534f; }
.nk-drawer-foot { padding: 16px 24px 22px; border-top: 1px solid var(--line); background: #fff; }
.nk-totals { margin: 0; }
.nk-totals div { display: flex; justify-content: space-between; padding: 3px 0; font-size: 14.5px; color: var(--ink-2); }
.nk-totals dd { margin: 0; font-weight: 700; color: var(--ink); }
.nk-totals .nk-total { margin-top: 4px; padding-top: 8px; border-top: 1px dashed var(--line); font-size: 16px; font-weight: 800; color: var(--ink); }
.nk-checkout-fields { display: grid; gap: 8px; margin-top: 14px; }
.nk-checkout-fields input {
  width: 100%; height: 46px; padding: 0 16px; outline: 0;
  border: 1px solid var(--line); border-radius: 12px; background: var(--cream);
  font: 15px var(--sans); color: var(--ink); transition: border-color .2s, box-shadow .2s, background .2s;
}
.nk-checkout-fields input:focus { border-color: #cdd3c4; background: #fff; box-shadow: 0 0 0 4px rgba(112, 125, 99, .14); }
.nk-form-error { margin-top: 10px; font-weight: 600; font-size: 13.5px; color: #b4534f; }
.nk-checkout { width: 100%; margin-top: 12px; }
.nk-checkout:disabled, .nk-band-form button:disabled { opacity: .7; cursor: progress; }

/* ---------- toast ---------- */
.nk-toast {
  position: fixed; left: 50%; bottom: 24px; z-index: 100;
  display: flex; align-items: center; gap: 10px; max-width: calc(100vw - 32px);
  padding: 13px 20px 13px 16px; border-radius: 999px;
  background: var(--ink); color: #fff; font-weight: 600; font-size: 14px; line-height: 1.3;
  box-shadow: 0 18px 40px -18px rgba(0, 0, 0, .5);
  opacity: 0; pointer-events: none; transform: translate(-50%, 16px); transition: opacity .3s, transform .3s;
}
.nk-toast svg { flex: none; color: var(--pink); }
.nk-toast.is-visible { opacity: 1; transform: translate(-50%, 0); }

/* ---------- motion ---------- */
.nk-rise { animation: nk-rise .8s cubic-bezier(.2, .7, .2, 1) both; }
@keyframes nk-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes nk-pop { from { transform: scale(.5); } to { transform: scale(1); } }
@keyframes nk-float { 0%, 100% { transform: rotate(-8deg) translateY(0); } 50% { transform: rotate(-6deg) translateY(-6px); } }
@keyframes nk-drop { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
@keyframes nk-slide { from { transform: translateX(100%); } to { transform: none; } }
@keyframes nk-fade { from { opacity: 0; } to { opacity: 1; } }

/* ---------- responsive ---------- */
@media (hover: none) {
  .nk-quickadd { opacity: 1; transform: none; }
}

@media (max-width: 1100px) {
  .nk-nav { gap: 18px; }
  .nk-search { width: clamp(170px, 18vw, 220px); }
  .nk-perks { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 24px; }
}

@media (max-width: 960px) {
  .nk-header-row {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "burger logo icons" "search search search";
    row-gap: 10px; min-height: 0; padding-block: 10px 12px;
  }
  .nk-burger { display: grid; }
  .nk-logo { justify-self: center; }
  .nk-tools { display: contents; }
  .nk-search-wrap { grid-area: search; }
  .nk-search { width: 100%; }
  .nk-results { width: 100%; }
  .nk-icons { grid-area: icons; }
  .nk-nav {
    position: absolute; top: 100%; left: 0; right: 0;
    display: none; flex-direction: column; align-items: stretch; gap: 0;
    padding: 6px var(--gutter) 16px;
    background: #fbfaf8; border-bottom: 1px solid var(--line);
    box-shadow: 0 24px 40px -26px rgba(45, 35, 34, .4);
  }
  .nk-nav.is-open { display: flex; animation: nk-drop .25s ease; }
  .nk-nav a { padding: 13px 4px; font-size: 17px; border-bottom: 1px solid #f0ebe6; }
  .nk-nav a::after { display: none; }
  .nk-nav a.is-active { color: var(--sage-deep); }

  .nk-cats, .nk-products {
    grid-template-columns: none; grid-auto-flow: column;
    overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory;
    padding-bottom: 6px;
  }
  .nk-cats { grid-auto-columns: 112px; }
  .nk-cat { scroll-snap-align: start; }
  .nk-products { grid-auto-columns: calc((100% - 2 * 14px) / 3); gap: 14px; }

  .nk-reviews { grid-template-columns: 1fr; }
  .nk-band-row { flex-wrap: wrap; }
  .nk-band-form { flex: 1 1 100%; }
  .nk-foot-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .nk-foot-brand { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .nk-foot-brand .nk-socials { margin: 0; }
  .nk-foot-note { grid-column: 1 / -1; justify-self: start; }
}

@media (max-width: 760px) {
  .nk-hero { display: flex; flex-direction: column; }
  .nk-hero-inner { order: 1; min-height: 0; padding-block: 34px 26px; }
  .nk-hero-media { position: relative; order: 2; inset: auto; z-index: 0; aspect-ratio: 1.15; }
  .nk-hero-media > img { object-position: 64% 50%; }
  .nk-hero-media::after { background: linear-gradient(180deg, #efe9e3 0%, rgba(239, 233, 227, 0) 22%); }
  .nk-hero-badge { top: 8%; right: 5%; width: 104px; font-size: 17px; }
  .nk-promos { grid-template-columns: 1fr; }
  .nk-products { grid-auto-columns: 62%; }
}

@media (max-width: 560px) {
  .nk-announce-row { grid-template-columns: 1fr; justify-items: center; padding-block: 8px; }
  .nk-announce-main { grid-column: 1; }
  .nk-announce .nk-announce-extra, .nk-announce .nk-announce-side { display: none; }
  .nk-logo-word { font-size: 16px; letter-spacing: .26em; margin-right: -.26em; }
  .nk-head { align-items: flex-start; }
  .nk-head .nk-viewall { margin-top: 6px; }
  .nk-promo { flex-direction: column; align-items: stretch; min-height: 0; padding: 0; }
  .nk-promo > img, .nk-promo-sale > img {
    position: static; width: 100%; height: 190px;
    -webkit-mask-image: none; mask-image: none;
  }
  .nk-promo-new > img { object-position: 66% 28%; }
  .nk-promo-new::after { display: none; }
  .nk-promo-copy { max-width: none; padding: 18px 22px 24px; }
  .nk-promo-note { display: none; }
  .nk-perks { grid-template-columns: 1fr; }
  .nk-foot-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .nk-foot-bottom { flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  .nk *, .nk *::before, .nk *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`;
