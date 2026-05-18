import {
  PRODUCTS,
  STORE,
  formatCurrency,
  getAllCollectionImages,
  getAvailableProducts,
  getShippingRate,
  isProductAvailable
} from "./products.js";
import { addToCart, initHeaderUtilities, setAnnouncement, setYear, startProductCheckout, toggleMobileMenu } from "./common.js";

const SITE_ORIGIN = `https://${STORE.domain}`;

function toAbsoluteUrl(value) {
  if (!value) {
    return `${SITE_ORIGIN}/assets/images/picwish_8813969001_image1.webp`;
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return `${SITE_ORIGIN}/${String(value).replace(/^\//, "")}`;
}

function productCardTemplate(product) {
  const shipping = getShippingRate(product);
  const card = document.createElement("article");
  card.className = "product-card";
  const hasStripeCheckout = typeof product.paymentLink === "string" && product.paymentLink.startsWith("https://buy.stripe.com/");

  const current = formatCurrency(product.price);
  const compare = formatCurrency(product.compareAtPrice);

  card.innerHTML = `
    <a class="product-thumb" href="product.html?id=${product.id}" aria-label="View ${product.name}">
      <img src="${product.images[0]}" alt="${product.name} — handmade epoxy resin tabletop" loading="lazy" />
      <span class="badge">${isProductAvailable(product) ? product.styleTag : "Sold"}</span>
    </a>
    <div class="product-copy">
      <p class="product-category">${product.category}</p>
      <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
      <p class="product-description">${product.description}</p>
      <p class="scope-note">${product.scopeNote}</p>
      <div class="price-row">
        <strong>${current}</strong>
        <span>${compare}</span>
      </div>
      <p class="shipping-note">Nationwide shipping from ${STORE.shipFrom}: from ${formatCurrency(shipping)}</p>
      <div class="card-actions">
        <a class="btn btn-secondary" href="product.html?id=${product.id}">View Details</a>
        <div class="card-qty-row">
          <div class="qty-selector">
            <button class="qty-btn qty-dec" type="button" aria-label="Decrease quantity">&#8722;</button>
            <input class="qty-input" type="number" value="1" min="1" max="10" aria-label="Quantity" />
            <button class="qty-btn qty-inc" type="button" aria-label="Increase quantity">&#43;</button>
          </div>
          <a class="btn btn-primary" href="#">Buy Now</a>
        </div>
      </div>
    </div>
  `;

  const buyNow = card.querySelector(".btn-primary");
  const qtyInput = card.querySelector(".qty-input");
  const qtyDec = card.querySelector(".qty-dec");
  const qtyInc = card.querySelector(".qty-inc");

  if (qtyDec && qtyInc && qtyInput) {
    qtyDec.addEventListener("click", () => {
      const v = parseInt(qtyInput.value, 10) || 1;
      if (v > 1) qtyInput.value = v - 1;
    });
    qtyInc.addEventListener("click", () => {
      const v = parseInt(qtyInput.value, 10) || 1;
      if (v < 10) qtyInput.value = v + 1;
    });
  }

  if (buyNow) {
    buyNow.addEventListener("click", (event) => {
      event.preventDefault();
      const qty = Math.min(10, Math.max(1, parseInt(qtyInput ? qtyInput.value : "1", 10) || 1));

      if (hasStripeCheckout) {
        startProductCheckout(product, {
          quantity: qty,
          addToCart: true,
          eventNote: "Customer started checkout from product grid popup."
        });
        return;
      }

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      }, qty);
    });
  }

  return card;
}

function renderShopGrid() {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) {
    return;
  }

  getAvailableProducts().forEach((product) => {
    grid.appendChild(productCardTemplate(product));
  });
}

function renderFeatured() {
  const node = document.querySelector("[data-featured-grid]");
  if (!node) {
    return;
  }

  const products = getAvailableProducts();
  products.forEach((product) => node.appendChild(productCardTemplate(product)));
}

function renderImageShowcase() {
  const node = document.querySelector("[data-showcase-grid]");
  if (!node) {
    return;
  }

  const allImages = getAllCollectionImages();
  allImages.forEach((image, index) => {
    const item = document.createElement("figure");
    item.className = "showcase-item";
    item.innerHTML = `<img src="${image}" alt="Tabletop design showcase ${index + 1}" loading="lazy" />`;
    node.appendChild(item);
  });
}

function injectHomepageSchema() {
  const schemaNode = document.querySelector("[data-home-schema]");
  if (!schemaNode) {
    return;
  }

  const list = PRODUCTS.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      url: `${SITE_ORIGIN}/product.html?id=${encodeURIComponent(product.id)}`,
      name: product.name,
      sku: product.sku,
      image: product.images.map((image) => toAbsoluteUrl(image)),
      category: product.category,
      description: product.description,
      offers: {
        "@type": "Offer",
        priceCurrency: STORE.currency,
        price: product.price,
        availability: "https://schema.org/InStock"
      }
    }
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${STORE.name} Collection`,
    itemListElement: list
  };

  schemaNode.textContent = JSON.stringify(schema);
}

function init() {
  toggleMobileMenu();
  initHeaderUtilities({ deferAuth: true });
  setYear();
  setAnnouncement("Tops only: bases in photos are display examples and are not included.");
  renderShopGrid();
  renderFeatured();
  renderImageShowcase();
  injectHomepageSchema();
}

init();
