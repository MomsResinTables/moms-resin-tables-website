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
    paymentLink: "https://buy.stripe.com/test_4gM7sLbZ1f7pgev5YegQE0c",
    description:
      "A compact top design with a layered shoreline effect in teal and earth tones.",
    care: "Clean with a microfiber cloth. Use coasters for heat and condensation.",
    images: [
      "assets/images/picwish_8813968191_image1.jpg",
      "assets/images/picwish_8813968191_image2.jpg"
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
    paymentLink: "https://buy.stripe.com/test_9B6bJ19QTbVd5zRcmCgQE0d",
    description:
      "A longer geometric striping layout with rich contrast and deep gloss finish.",
    care: "Avoid direct prolonged sun exposure to preserve tone consistency.",
    images: ["assets/images/picwish_8813968501_image1.jpg"]
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
    paymentLink: "https://buy.stripe.com/test_4gM3cv9QTaR96DVeuKgQE0e",
    description:
      "A warm chevron composition with clean color transitions and reflective depth. Works beautifully in bright, modern interiors.",
    care: "Use felt pads if placing on delicate tile or hardwood flooring.",
    images: ["assets/images/picwish_8813968581_image2.jpg"]
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
    paymentLink: "https://buy.stripe.com/test_6oUcN50gj0cve6ndqGgQE0f",
    description:
      "A two-tier side table featuring a flowing resin river and visible edge character from the original slab.",
    care: "Do not place near radiators or direct heat sources.",
    images: ["assets/images/picwish_8813968621_image1.jpg"]
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
    paymentLink: "https://buy.stripe.com/test_8x23cv4wz7EXe6n0DUgQE0g",
    description:
      "A low-profile accent piece with alternating wood species and subtle tonal shifts. Great for lounge corners and studio spaces.",
    care: "Wipe spills promptly and avoid abrasive cleaners.",
    images: ["assets/images/picwish_8813968661_image1.jpg"]
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
    paymentLink: "https://buy.stripe.com/test_eVq5kDe796ATe6ngCSgQE0h",
    description:
      "An elongated bench silhouette with strong visual rhythm in green and gold tones, suitable as a coffee bench or entry feature.",
    care: "Indoor use recommended for longest finish life.",
    images: ["assets/images/picwish_8813968741_image1.jpg"]
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
    paymentLink: "https://buy.stripe.com/test_5kQ3cv0gj3oH7HZ2M2gQE0i",
    description:
      "A bold diagonal composition with premium contrast and mirror finish, crafted for design-forward interiors.",
    care: "Use coasters and avoid dragging metal objects across the top.",
    images: [
      "assets/images/picwish_8813968881_image1.jpg",
      "assets/images/picwish_8813968881_image2.jpg"
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
    paymentLink: "https://buy.stripe.com/test_aFa4gz9QTe3lfarbiygQE0j",
    description:
      "A decorative iron-frame coffee table with floral scrollwork and a warm, highly reflective striped top.",
    care: "Use a damp cloth only; avoid bleach and ammonia cleaners.",
    images: [
      "assets/images/picwish_8813969001_image1.jpg",
      "assets/images/picwish_8813969001_image2.jpg"
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
    paymentLink: "https://buy.stripe.com/test_6oUbJ14wz6AT3rJ86mgQE0k",
    description:
      "A natural slab bench with an organic aqua inlay that highlights grain movement and edge texture.",
    care: "Keep indoors and out of direct weather exposure.",
    images: ["assets/images/picwish_8813969051_image2.jpg"]
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
    paymentLink: "https://buy.stripe.com/test_5kQ14n3sv5wP7HZ5YegQE0l",
    description:
      "A collectible trio of artisan resin-wood panels for shelf styling, desk display, or wall-adjacent accent.",
    care: "Dust with a soft dry cloth. Avoid prolonged direct sunlight.",
    images: ["assets/images/picwish_8813969231_image1.jpg"]
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
    paymentLink: "https://buy.stripe.com/test_eVq9AT3sv9N54vNgCSgQE0m",
    description:
      "A dramatic silhouette with sculptural side profile and warm cedar tones under a glassy top layer.",
    care: "Use a soft cloth and pH-neutral cleaner when needed.",
    images: ["assets/images/picwish_8813969381_image1.jpg"]
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
    paymentLink: "https://buy.stripe.com/test_14A00j1kncZh2nFcmCgQE0n",
    description:
      "A long-form live edge bench with a vibrant teal channel, built to stand out in entryways and studio lofts.",
    care: "Keep dry and avoid prolonged standing water on the surface.",
    images: ["assets/images/picwish_8813969501_image2.jpg"]
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
