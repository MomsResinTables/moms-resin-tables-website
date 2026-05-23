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
    name: "Tideforge Accent Top",
    category: "Accent Tabletop",
    styleTag: "Collector Accent",
    price: 399,
    compareAtPrice: 479,
    shippingBand: "side",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 20 in W x 14 in D x 1.5 in H",
    materials: "Mixed reclaimed hardwood strips and pigmented epoxy resin",
    finish: "Hand-sanded, high-build polyurethane top coat",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/8x2cN5d352kD2nF86mgQE00",
    cardDescription:
      "Compact one-of-one accent top with layered reclaimed hardwood and a teal shoreline pour.",
    description:
      "A compact handcrafted resin tabletop built from layered reclaimed hardwood and a moody teal pour that reads like shoreline water over stone. At 20 x 14 inches, Tideforge works beautifully on a pedestal, metal base, or nightstand frame where the color and gloss can stay in focus. The surface is hand-sanded, polished, fully cured, and ready to mount as a one-of-one studio original from Safety Harbor, Florida.",
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
    name: "Mosaic Hearth Console Top",
    category: "Console / Bench Top",
    styleTag: "Statement Mosaic",
    price: 589,
    compareAtPrice: 699,
    shippingBand: "large",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 40 in W x 16 in D x 1.5 in H",
    materials: "Multi-species reclaimed hardwood mosaic top",
    finish: "Flood-coat resin seal with UV-resistant polyurethane",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/14A9AT3sv5wPfar4UagQE01",
    cardDescription:
      "Large geometric hardwood mosaic top with deep gloss resin and strong console-scale presence.",
    description:
      "A long-format handcrafted hardwood mosaic top with pronounced tonal contrast and a deep gloss finish that gives every strip and joint more depth. At 40 x 16 inches, Mosaic Hearth is scaled for a narrow console, statement bench, or entry table where the composition can read like furniture-grade art laid flat. The one-of-one layout feels deliberate, substantial, and studio-made rather than mass produced.",
    care: "Avoid direct prolonged sun exposure to preserve tone consistency.",
    images: ["assets/images/picwish_8813968501_image1.webp"]
  },
  {
    id: "chevron-lumen-top",
    sku: "MRT-003",
    status: "available",
    name: "Chevron Lumen Accent Top",
    category: "Accent Tabletop",
    styleTag: "Chevron Inlay",
    price: 429,
    compareAtPrice: 509,
    shippingBand: "side",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 22 in W x 16 in D x 1.5 in H",
    materials: "Mixed hardwood chevron build with clear epoxy",
    finish: "Glass-like resin flood coat",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/3cIbJ1bZ10cvgevfyOgQE02",
    cardDescription:
      "Hand-cut chevron hardwood top with crystal-clear resin and a crisp modern accent-table profile.",
    description:
      "Chevron Lumen brings a cleaner, more architectural take to the resin tabletop format, using hand-cut hardwood segments under a clear flood coat that lets the geometry do the talking. At 22 x 16 inches, it suits an accent table, bedside piece, or small drink table where the pattern can catch changing light throughout the day. The finish stays glossy and refined without feeling overworked, making it an easy premium piece for modern interiors.",
    care: "Use felt pads if placing on delicate tile or hardwood flooring.",
    images: ["assets/images/picwish_8813968581_image2.webp"]
  },
  {
    id: "riverline-top",
    sku: "MRT-004",
    status: "available",
    name: "Riverline Live Edge Accent Top",
    category: "Accent Tabletop",
    styleTag: "Live Edge River",
    price: 469,
    compareAtPrice: 559,
    shippingBand: "side",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 23 in W x 16 in D x 1.5 in H",
    materials: "Live edge hardwood slab with teal epoxy channel",
    finish: "High-gloss resin and polyurethane blend",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/28E5kDe794sL9Q7dqGgQE03",
    cardDescription:
      "Compact live edge slab top with a teal resin channel and classic river-table character.",
    description:
      "Riverline distills the river-table look into a compact live edge accent top, pairing natural slab edges with a vivid teal channel that follows the grain movement rather than fighting it. Sized at 23 x 16 inches, it works well on a side table, pedestal, or small lounge piece where the live edge and resin line can stay fully visible. It is a one-of-one handcrafted slab top finished to a high gloss for buyers who want genuine river-table character in a smaller format.",
    care: "Do not place near radiators or direct heat sources.",
    images: ["assets/images/picwish_8813968621_image1.webp"]
  },
  {
    id: "atelier-stripe-top",
    sku: "MRT-005",
    status: "available",
    name: "Atelier Stripe Coffee Top",
    category: "Coffee / Accent Top",
    styleTag: "Studio Stripe",
    price: 429,
    compareAtPrice: 509,
    shippingBand: "medium",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 26 in W x 18 in D x 1.5 in H",
    materials: "Mixed reclaimed woods with clear resin",
    finish: "Resin flood coat with hand-buffed shine",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/eVq7sL9QTaR96DV3Q6gQE04",
    cardDescription:
      "Low-profile striped hardwood top with clear resin and a restrained, gallery-clean finish.",
    description:
      "Atelier Stripe leans more refined than rustic, with alternating hardwood bands under a clear resin coat that highlights subtle shifts in tone instead of dramatic contrast. At 26 x 18 inches, it lands in a flexible sweet spot for a coffee, accent, or display table where you want handcrafted work that still feels disciplined and modern. The finish is glossy, smooth, and intentionally understated, giving the piece a calm premium presence.",
    care: "Wipe spills promptly and avoid abrasive cleaners.",
    images: ["assets/images/picwish_8813968661_image1.webp"]
  },
  {
    id: "longline-mosaic-top",
    sku: "MRT-006",
    status: "available",
    name: "Longline Mosaic Console Top",
    category: "Console / Bench Top",
    styleTag: "Statement Console",
    price: 699,
    compareAtPrice: 829,
    shippingBand: "large",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 46 in W x 14 in D x 1.5 in H",
    materials: "Reclaimed hardwood strip top",
    finish: "Resin-protected top with durable satin edges",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/00w5kDbZ18J15zR86mgQE05",
    cardDescription:
      "Elongated one-of-one hardwood mosaic top built for console, bench, or hallway statement use.",
    description:
      "Longline Mosaic is a true statement-format tabletop, stretching to 46 x 14 inches with a rhythmic reclaimed hardwood layout that reads especially well in entryways, behind sofas, or on a bench base. The linear composition gives the piece motion, while the resin-protected surface keeps it polished and easy to live with. This is the kind of one-of-one top that can anchor a narrow space without needing oversized furniture around it.",
    care: "Indoor use recommended for longest finish life.",
    images: ["assets/images/picwish_8813968741_image1.webp"]
  },
  {
    id: "prism-chevron-top",
    sku: "MRT-007",
    status: "available",
    name: "Prism Chevron Accent Top",
    category: "Accent Tabletop",
    styleTag: "Collector Chevron",
    price: 519,
    compareAtPrice: 619,
    shippingBand: "side",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 23 in W x 16 in D x 1.5 in H",
    materials: "Multi-species hardwood with pigmented resin",
    finish: "Deep high-gloss resin top",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/fZu8wP2or4sLd2j4UagQE06",
    cardDescription:
      "Premium multi-species chevron top with pigmented resin details and a mirror-gloss finish.",
    description:
      "Prism Chevron is one of the most design-forward pieces in the collection, combining sharper hardwood contrast with pigmented resin detailing and a mirror-gloss finish that amplifies the diagonal pattern. At 23 x 16 inches, it is ideal for an accent table or pedestal display where the surface can be appreciated up close. The overall effect is bold, polished, and intentionally higher end, more like a collectible studio piece than a casual side top.",
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
    name: "Wrought Bloom Coffee Top",
    category: "Coffee Tabletop",
    styleTag: "Statement Coffee",
    price: 729,
    compareAtPrice: 859,
    shippingBand: "large",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 34 in W x 22 in D x 1.5 in H",
    materials: "Striped hardwood top with embedded resin",
    finish: "Gloss resin with sealed edge detailing",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/7sY4gz2or7EX8M32M2gQE07",
    cardDescription:
      "Coffee-table-scale hardwood top with embedded resin lines and a polished statement finish.",
    description:
      "Wrought Bloom is scaled for a proper coffee table presence at 34 x 22 inches, with a striped hardwood field and embedded resin lines that give it depth without overwhelming the wood. It pairs especially well with iron, architectural, or sculptural bases where the top needs enough visual strength to hold the room. The result is warm, reflective, and substantial, with the kind of finish expected from a premium handcrafted centerpiece.",
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
    name: "Aqua Vein Live Edge Console Top",
    category: "Console / Bench Top",
    styleTag: "Live Edge Statement",
    price: 649,
    compareAtPrice: 769,
    shippingBand: "large",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 36 in W x 16 in D x 1.5 in H",
    materials: "Live edge slab with translucent aqua epoxy channel",
    finish: "Resin + polyurethane protective top coat",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/28E8wPgfh0cvbYf5YegQE08",
    cardDescription:
      "Longer live edge slab top with translucent aqua resin and strong coastal-modern presence.",
    description:
      "Aqua Vein pairs a longer live edge slab with a translucent aqua channel that lets the grain and edge texture stay visually active beneath the color. At 36 x 16 inches, it works well as a console, bench, or narrow feature table, especially in interiors that want a cleaner coastal or modern-organic statement. The finish is glossy and protective, but the natural slab still leads the piece rather than getting lost under resin.",
    care: "Keep indoors and out of direct weather exposure.",
    images: ["assets/images/picwish_8813969051_image2.webp"]
  },
  {
    id: "cedar-facet-top",
    sku: "MRT-011",
    status: "available",
    name: "Cedar Facet Accent Top",
    category: "Coffee / Accent Top",
    styleTag: "Cedar Studio",
    price: 469,
    compareAtPrice: 559,
    shippingBand: "medium",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 24 in W x 18 in D x 1.5 in H",
    materials: "Cedar and mixed reclaimed species with resin reinforcement",
    finish: "High-build clear coat with resin reinforcement",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/dRmbJ1aUX2kDgev72igQE0a",
    cardDescription:
      "Warm cedar-led accent top with sculpted profile and a clear, furniture-grade finish.",
    description:
      "Cedar Facet brings a warmer, more natural palette to the collection, letting cedar tone and grain carry the piece while resin reinforcement and a high-build clear coat add depth and polish. At 24 x 18 inches, it works well as an accent or compact coffee top, especially with darker metal or grounded wood bases. The result is less flashy than a river piece and more studio-crafted, which gives it a strong premium appeal for buyers who want warmth over spectacle.",
    care: "Use a soft cloth and pH-neutral cleaner when needed.",
    images: ["assets/images/picwish_8813969381_image1.webp"]
  },
  {
    id: "teal-river-console-top",
    sku: "MRT-012",
    status: "available",
    name: "Teal River Statement Console Top",
    category: "Console Tabletop",
    styleTag: "Signature River",
    price: 789,
    compareAtPrice: 929,
    shippingBand: "large",
    leadTime: "Ready to ship in 3-5 business days",
    dimensions: "Top only, approx. 44 in W x 15 in D x 1.5 in H",
    materials: "Natural live edge slab with teal epoxy inlay",
    finish: "Mirror resin coat, hand-smoothed edges",
    scopeNote: "Top only. Any base shown in photos is for presentation and is not included.",
    availability: "One of one",
    paymentLink: "https://buy.stripe.com/fZu5kD1kn9N5gev3Q6gQE0b",
    cardDescription:
      "Long-form live edge river top with gallery-scale color contrast and premium console proportions.",
    description:
      "Teal River is the clearest statement piece in the collection: a 44 x 15 live edge slab top with a saturated teal river running through dark wood grain and a high-reflection finish. Its proportions make it ideal for a console or narrow hall table where the length and color contrast can command attention immediately. This is not an entry-level accent piece; it reads like a signature one-of-one tabletop built to carry a premium position in the catalog.",
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
