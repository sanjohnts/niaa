// Catalog data for NIAA Kids. It is upserted into the database on every server
// start, so editing this file (prices, names, new products) and restarting is
// enough to update the store. Prices are in cents to avoid rounding errors.

export const CATEGORIES = [
  { id: "onesies", name: "Onesies & Bodysuits", img: "cat-onesies.jpg" },
  { id: "dresses", name: "Dresses & Sets", img: "cat-dresses.jpg" },
  { id: "tops", name: "Tops & Bottoms", img: "cat-tops.jpg" },
  { id: "outerwear", name: "Outerwear", img: "cat-outerwear.jpg" },
  { id: "accessories", name: "Accessories", img: "cat-accessories.jpg" },
  { id: "footwear", name: "Footwear", img: "cat-footwear.jpg" },
  { id: "toys", name: "Toys & Essentials", img: "cat-toys.jpg" },
];

export const PRODUCTS = [
  // featured favourites (shown on the home page)
  { id: "romper", name: "Cozy Bear Romper", category: "onesies", priceCents: 2800, rating: 4.5, reviews: 124, img: "p-bear-romper.jpg", alt: "Cream knit romper with a bear-ear hood", featured: true },
  { id: "blossom", name: "Blossom Dress", category: "dresses", priceCents: 3200, rating: 5, reviews: 98, img: "p-blossom-dress.jpg", alt: "Pink floral dress with flutter sleeves", featured: true },
  { id: "explorer", name: "Little Explorer Set", category: "tops", priceCents: 3400, rating: 4.5, reviews: 156, img: "p-explorer-set.jpg", alt: "Sage sweatshirt with a bear face and matching shorts", featured: true },
  { id: "cardigan", name: "Cloud Knit Cardigan", category: "outerwear", priceCents: 3000, rating: 4.5, reviews: 87, img: "p-knit-cardigan.jpg", alt: "Cream cable-knit button cardigan", featured: true },
  { id: "overalls", name: "Everyday Overalls", category: "tops", priceCents: 2900, rating: 5, reviews: 102, img: "p-overalls.jpg", alt: "Tan cotton overalls with cargo pockets", featured: true },

  // rest of the catalogue
  { id: "oat-bodysuit", name: "Oat Cotton Bodysuit", category: "onesies", priceCents: 1800, rating: 4.5, reviews: 64, img: "cat-onesies.jpg", alt: "Oat-coloured short-sleeve cotton bodysuit" },
  { id: "rose-sundress", name: "Rose Ruffle Sundress", category: "dresses", priceCents: 2600, rating: 5, reviews: 41, img: "cat-dresses.jpg", alt: "Dusty pink sundress with ruffle sleeves" },
  { id: "sage-hoodie", name: "Sage Zip Hoodie", category: "tops", priceCents: 2700, rating: 4.5, reviews: 58, img: "cat-tops.jpg", alt: "Sage green zip-up hoodie" },
  { id: "teddy-jacket", name: "Teddy Fleece Jacket", category: "outerwear", priceCents: 3600, rating: 5, reviews: 73, img: "cat-outerwear.jpg", alt: "Cream teddy fleece jacket" },
  { id: "bear-beanie", name: "Bear Ear Beanie", category: "accessories", priceCents: 1400, rating: 4.5, reviews: 39, img: "cat-accessories.jpg", alt: "Knit beanie with little bear ears" },
  { id: "cloud-sneakers", name: "Cloud Sneakers", category: "footwear", priceCents: 3200, rating: 4.5, reviews: 52, img: "cat-footwear.jpg", alt: "White canvas sneakers for toddlers" },
  { id: "bunny-plush", name: "Snuggle Bunny Plush", category: "toys", priceCents: 2200, rating: 5, reviews: 88, img: "cat-toys.jpg", alt: "Soft grey bunny plush toy" },
];
