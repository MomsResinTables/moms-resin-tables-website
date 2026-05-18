export const STORE = {
  name: "Mom's Resin Tables",
  domain: "momsresintables.com",
  currency: "USD",
  supportEmail: "support@momsresintables.com",
  supportPhone: "(727) 279-5289",
  shipFrom: "Safety Harbor, Florida",
  shippingBands: {
    decor: { label: "Decor", rate: 18 },
    side: { label: "Side Table", rate: 34 },
    medium: { label: "Coffee / Accent", rate: 52 },
    large: { label: "Console / Bench", rate: 74 }
  }
};

export const WOOD_TYPES = [
  { id: "pine", name: "Pine", image: "assets/woods/pine.webp", premiumPerSqFt: 0 },
  { id: "cedar", name: "Cedar", image: "assets/woods/cedar.webp", premiumPerSqFt: 6 },
  { id: "oak", name: "White Oak", image: "assets/woods/oak.webp", premiumPerSqFt: 10 },
  { id: "ash", name: "Ash", image: "assets/woods/ash.webp", premiumPerSqFt: 11 },
  { id: "maple", name: "Hard Maple", image: "assets/woods/maple.webp", premiumPerSqFt: 12 },
  { id: "hickory", name: "Hickory", image: "assets/woods/hickory.webp", premiumPerSqFt: 13 },
  { id: "cherry", name: "Cherry", image: "assets/woods/cherry.webp", premiumPerSqFt: 14 },
  { id: "walnut", name: "Black Walnut", image: "assets/woods/walnut.webp", premiumPerSqFt: 18 },
  { id: "mahogany", name: "Mahogany", image: "assets/woods/mahogany.webp", premiumPerSqFt: 20 },
  { id: "teak", name: "Teak", image: "assets/woods/teak.webp", premiumPerSqFt: 22 },
  { id: "padauk", name: "Padauk", image: "assets/woods/padauk.webp", premiumPerSqFt: 24 },
  { id: "ebony", name: "Ebony", image: "assets/woods/ebony.webp", premiumPerSqFt: 30 }
];

export const PRODUCTS = [
  {
    id: "tideforge-top",
    sku: "MRT-001",
    status: "available",
    name: "Tideforge Top Design",
    category: "Tabletop Design",
    styleTag: "Live Edge + Resin",
    price: 279,
    compareAtPrice: 329,
    shippingBand: "side",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 20 in W x 14 in D x 1.5 in H",
    materials: "Mixed reclaimed hardwood strips and pigmented epoxy resin",
    finish: "Hand-sanded, high-build polyurethane top coat",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/8x2cN5d352kD2nF86mgQE00",
    description:
      "The Tideforge Top is a compact handmade resin side table top crafted from layered mixed reclaimed hardwood strips with a shoreline-inspired teal and earth-tone epoxy pour. At approximately 20 × 14 inches, this one-of-one piece works beautifully as an end table top, nightstand surface, or side table accent. The layered pigmented resin creates depth similar to a tide pool captured in gloss — finished in hand-sanded, high-build polyurethane for lasting durability. No two teal epoxy resin wood table tops look the same. Ships fully cured and ready to use on a base of your choice from Safety Harbor, Florida.",
    care: "Clean with a microfiber cloth. Use coasters for heat and condensation.",
    images: [
      "assets/images/picwish_8813968191_image1.webp",
      "assets/images/picwish_8813968191_image2.webp"
    ]
  },
  {
    id: "mosaic-hearth-top",
    sku: "MRT-002",
    status: "available",
    name: "Mosaic Hearth Top Design",
    category: "Tabletop Design",
    styleTag: "Patchwork Wood",
    price: 319,
    compareAtPrice: 389,
    shippingBand: "large",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 40 in W x 16 in D x 1.5 in H",
    materials: "Multi-species reclaimed hardwood mosaic top",
    finish: "Flood-coat resin seal with UV-resistant polyurethane",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/14A9AT3sv5wPfar4UagQE01",
    description:
      "The Mosaic Hearth Top is a large handcrafted multi-species hardwood tabletop sealed in a deep flood-coat epoxy resin finish. Spanning approximately 40 × 16 inches, this one-of-one console table top or bench top features a geometric strip mosaic of contrasting wood species — walnut, maple, and reclaimed hardwoods bound in UV-resistant gloss resin. Ideal as an epoxy coffee table top, entry console top, or statement dining bench surface. The tight mosaic patchwork creates bold visual texture unlike a typical river table — every grain line and color boundary is a deliberate composition choice. Ships ready to mount.",
    care: "Avoid direct prolonged sun exposure to preserve tone consistency.",
    images: ["assets/images/picwish_8813968501_image1.webp"]
  },
  {
    id: "chevron-lumen-top",
    sku: "MRT-003",
    status: "available",
    name: "Chevron Lumen Top Design",
    category: "Tabletop Design",
    styleTag: "Geometric Resin",
    price: 309,
    compareAtPrice: 369,
    shippingBand: "side",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 22 in W x 16 in D x 1.5 in H",
    materials: "Mixed hardwood chevron build with clear epoxy",
    finish: "Glass-like resin flood coat",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/3cIbJ1bZ10cvgevfyOgQE02",
    description:
      "The Chevron Lumen Top is a handmade mixed hardwood side table top built in a classic chevron pattern with clear epoxy resin fill and a glass-like flood coat. Approximately 22 × 16 inches — an ideal size for a small coffee table top, accent table, or nightstand surface. The warm interplay of light and dark wood species through the chevron geometry creates a reflective depth that shifts with room lighting. Built for modern, Scandinavian, and transitional interiors. Each line of the chevron is hand-cut and arranged before the epoxy pour, making every piece an original handmade epoxy resin table top. Ready to ship nationwide.",
    care: "Use felt pads if placing on delicate tile or hardwood flooring.",
    images: ["assets/images/picwish_8813968581_image2.webp"]
  },
  {
    id: "riverline-top",
    sku: "MRT-004",
    status: "available",
    name: "Riverline Top Design",
    category: "Tabletop Design",
    styleTag: "Live Edge River",
    price: 339,
    compareAtPrice: 409,
    shippingBand: "side",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 23 in W x 16 in D x 1.5 in H",
    materials: "Live edge hardwood slab with teal epoxy channel",
    finish: "High-gloss resin and polyurethane blend",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/28E5kDe794sL9Q7dqGgQE03",
    description:
      "The Riverline Top is a live edge hardwood slab table top with a flowing teal epoxy river channel running through the natural slab. At approximately 23 × 16 inches, it captures the classic river table aesthetic in a compact format — the teal resin river highlights the original slab grain movement and live edge character. Finished in a high-gloss resin and polyurethane blend for lasting protection. Perfect as a river table side top, end table, or accent piece for coastal, rustic, or modern boho interiors. A true one-of-one handcrafted epoxy river table design, ready to ship from Safety Harbor, Florida.",
    care: "Do not place near radiators or direct heat sources.",
    images: ["assets/images/picwish_8813968621_image1.webp"]
  },
  {
    id: "atelier-stripe-top",
    sku: "MRT-005",
    status: "available",
    name: "Atelier Stripe Top Design",
    category: "Tabletop Design",
    styleTag: "Modern Stripe",
    price: 259,
    compareAtPrice: 309,
    shippingBand: "medium",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 26 in W x 18 in D x 1.5 in H",
    materials: "Mixed reclaimed woods with clear resin",
    finish: "Resin flood coat with hand-buffed shine",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/eVq7sL9QTaR96DV3Q6gQE04",
    description:
      "The Atelier Stripe Top is a low-profile handmade resin table top with alternating strips of mixed reclaimed wood species and a clear epoxy flood coat with hand-buffed shine. Approximately 26 × 18 inches — a natural fit for a coffee table top, accent table, ottoman tray top, or shelf display surface. Subtle tonal shifts between each wood stripe create a calm, modern aesthetic with organic warmth. Great for Scandinavian, mid-century modern, and minimalist interiors. This ready-to-ship epoxy resin table top is fully cured and sealed in Safety Harbor, Florida, then shipped nationwide.",
    care: "Wipe spills promptly and avoid abrasive cleaners.",
    images: ["assets/images/picwish_8813968661_image1.webp"]
  },
  {
    id: "longline-mosaic-top",
    sku: "MRT-006",
    status: "available",
    name: "Longline Mosaic Top Design",
    category: "Tabletop Design",
    styleTag: "Long Form",
    price: 359,
    compareAtPrice: 429,
    shippingBand: "large",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 46 in W x 14 in D x 1.5 in H",
    materials: "Reclaimed hardwood strip top",
    finish: "Resin-protected top with durable satin edges",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/00w5kDbZ18J15zR86mgQE05",
    description:
      "The Longline Mosaic Top is a wide, elongated handcrafted reclaimed hardwood strip table top at approximately 46 × 14 inches — sized as a statement bench top, console table top, or long coffee table surface. The mosaic strip layout creates a strong visual rhythm in green and gold wood tones, protected by a durable resin-coated surface and satin edges. An ideal choice for an entry console, a window bench, or a long coffee bench in a living room. The clean linear pattern pairs with both industrial and organic interior styles. Wipe-clean, resin-protected surface ships ready to install on a base of your choice.",
    care: "Indoor use recommended for longest finish life.",
    images: ["assets/images/picwish_8813968741_image1.webp"]
  },
  {
    id: "prism-chevron-top",
    sku: "MRT-007",
    status: "available",
    name: "Prism Chevron Top Design",
    category: "Tabletop Design",
    styleTag: "Artisan Chevron",
    price: 379,
    compareAtPrice: 449,
    shippingBand: "side",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 23 in W x 16 in D x 1.5 in H",
    materials: "Multi-species hardwood with pigmented resin",
    finish: "Deep high-gloss resin top",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/fZu8wP2or4sLd2j4UagQE06",
    description:
      "The Prism Chevron Top is a premium handmade chevron-pattern epoxy resin table top crafted from multiple hardwood species with pigmented resin inlays and a deep high-gloss mirror finish. At approximately 23 × 16 inches, it's ideal as a side table top, end table surface, or display accent. The bold diagonal composition creates maximum contrast between wood tones and resin fills — a statement piece built for design-forward homes, modern lofts, and boutique interiors. Each multi-species chevron is hand-arranged and resin-poured, so no two are alike. The mirror resin finish reflects light beautifully from every angle. Ships from Florida.",
    care: "Use coasters and avoid dragging metal objects across the top.",
    images: [
      "assets/images/picwish_8813968881_image1.webp",
      "assets/images/picwish_8813968881_image2.webp"
    ]
  },
  {
    id: "wrought-bloom-top",
    sku: "MRT-008",
    status: "available",
    name: "Wrought Bloom Top Design",
    category: "Tabletop Design",
    styleTag: "Ornate Iron Base",
    price: 429,
    compareAtPrice: 509,
    shippingBand: "large",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 34 in W x 22 in D x 1.5 in H",
    materials: "Striped hardwood top with embedded resin",
    finish: "Gloss resin with sealed edge detailing",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/7sY4gz2or7EX8M32M2gQE07",
    description:
      "The Wrought Bloom Top is a handcrafted striped hardwood epoxy resin coffee table top at approximately 34 × 22 inches — a proper coffee table or accent table scale. Embedded resin stripes and a highly reflective gloss finish make it ideal for pairing with decorative iron or metal bases, including ornate scrollwork or industrial-style frames. The warm striped composition suits traditional, eclectic, and farmhouse interiors alike. The resin-sealed surface is durable and easy to clean — a practical choice for a one-of-one handmade epoxy coffee table top. Ships fully cured with sealed edge detailing nationwide from Safety Harbor, Florida.",
    care: "Use a damp cloth only; avoid bleach and ammonia cleaners.",
    images: [
      "assets/images/picwish_8813969001_image1.webp",
      "assets/images/picwish_8813969001_image2.webp"
    ]
  },
  {
    id: "aqua-vein-top",
    sku: "MRT-009",
    status: "available",
    name: "Aqua Vein Top Design",
    category: "Tabletop Design",
    styleTag: "Live Edge River",
    price: 349,
    compareAtPrice: 419,
    shippingBand: "large",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 36 in W x 16 in D x 1.5 in H",
    materials: "Live edge slab with translucent aqua epoxy channel",
    finish: "Resin + polyurethane protective top coat",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/28E8wPgfh0cvbYf5YegQE08",
    description:
      "The Aqua Vein Top is a natural live edge slab epoxy resin table top with a translucent aqua channel that follows the organic contours of the original wood slab. At approximately 36 × 16 inches, it works as a console table top, a bench surface, or a bold accent table. The aqua inlay creates a river table effect using translucent teal resin that lets light pass through, highlighting the grain character and live edge texture of the natural slab. A resin and polyurethane top coat locks in the finish for long-term durability. A handmade live edge epoxy table top — one of one — ships from Safety Harbor, Florida.",
    care: "Keep indoors and out of direct weather exposure.",
    images: ["assets/images/picwish_8813969051_image2.webp"]
  },
  {
    id: "artisan-river-panel-set",
    sku: "MRT-010",
    status: "available",
    name: "Artisan River Panel Set (3-Piece)",
    category: "Decor",
    styleTag: "Sculptural Decor",
    price: 289,
    compareAtPrice: 339,
    shippingBand: "decor",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Approx. Tallest panel: 14 in H x 6 in W",
    materials: "Mixed hardwood sections, colored resin channels",
    finish: "Gloss hand-finished seal",
    scopeNote: "Decor set only. No hardware or mounting accessories included.",
    availability: "One of one set",
    paymentLink: "https://buy.stripe.com/eVqeVd1kn9N5d2jeuKgQE09",
    description:
      "The Artisan River Panel Set is a collectible three-piece grouping of handmade resin-and-wood panels, each featuring colored epoxy resin channels through mixed hardwood sections with a gloss hand-finished seal. The tallest panel is approximately 14 × 6 inches. Designed for shelf styling, desk display, bookcase accents, or as a decorative trio on a console table. Each panel showcases the river table aesthetic in miniature — a great gift for resin art enthusiasts or a unique accent for modern, industrial, or boho interiors. Sold as a set of three. Handmade, one-of-one, and ships from Safety Harbor, Florida.",
    care: "Dust with a soft dry cloth. Avoid prolonged direct sunlight.",
    images: ["assets/images/picwish_8813969231_image1.webp"]
  },
  {
    id: "cedar-facet-top",
    sku: "MRT-011",
    status: "available",
    name: "Cedar Facet Top Design",
    category: "Tabletop Design",
    styleTag: "Sculpted Base",
    price: 329,
    compareAtPrice: 389,
    shippingBand: "medium",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 24 in W x 18 in D x 1.5 in H",
    materials: "Cedar and mixed reclaimed species with resin reinforcement",
    finish: "High-build clear coat with resin reinforcement",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/dRmbJ1aUX2kDgev72igQE0a",
    description:
      "The Cedar Facet Top is a handcrafted cedar and reclaimed hardwood coffee table top with a sculptural side profile and warm cedar tones protected under a glassy high-build clear coat with resin reinforcement. At approximately 24 × 18 inches, it's a natural fit for a coffee table, accent table, or feature display surface. Warm, aromatic cedar grain shows beautifully under the clear epoxy resin surface — a natural conversation piece for rustic, cabin, or modern farmhouse interiors. Cedar's natural reddish warmth pairs well with dark metal or natural wood bases. A one-of-one handmade epoxy resin table top. Ships ready to use.",
    care: "Use a soft cloth and pH-neutral cleaner when needed.",
    images: ["assets/images/picwish_8813969381_image1.webp"]
  },
  {
    id: "teal-river-console-top",
    sku: "MRT-012",
    status: "available",
    name: "Teal River Console Top Design",
    category: "Tabletop Design",
    styleTag: "Live Edge Console",
    price: 389,
    compareAtPrice: 459,
    shippingBand: "large",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 44 in W x 15 in D x 1.5 in H",
    materials: "Natural live edge slab with teal epoxy inlay",
    finish: "Mirror resin coat, hand-smoothed edges",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/fZu5kD1kn9N5gev3Q6gQE0b",
    description:
      "The Teal River Console Top is a long-form live edge hardwood slab epoxy resin table top at approximately 44 × 15 inches — built specifically as a console table, hallway table top, or long accent bench surface. A vibrant teal epoxy river channel runs through the natural live edge slab, creating bold contrast against the dark wood grain. The mirror resin coat and hand-smoothed edges give it a finished, gallery-quality appearance. Perfect for entryways, studio lofts, behind sofas, or as a sideboard top. This is a statement live edge river table design — one of one — made by hand and shipped from Safety Harbor, Florida.",,
    care: "Keep dry and avoid prolonged standing water on the surface.",
    images: ["assets/images/picwish_8813969501_image2.webp"]
  }
];

export function getProductById(id) {
  return PRODUCTS.find((product) => product.id === id);
}

export function isProductAvailable(product) {
  return product && product.status !== "sold";
}

export function getAvailableProducts() {
  return PRODUCTS.filter((product) => isProductAvailable(product));
}

export function getAllCollectionImages() {
  const images = [];
  PRODUCTS.forEach((product) => {
    product.images.forEach((image) => {
      if (!images.includes(image)) {
        images.push(image);
      }
    });
  });
  return images;
}

export function getShippingRate(product) {
  const band = STORE.shippingBands[product.shippingBand];
  return band ? band.rate : 0;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: STORE.currency,
    maximumFractionDigits: 0
  }).format(amount);
}
