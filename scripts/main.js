import {
  PRODUCTS,
  STORE,
  formatCurrency,
  getAllCollectionImages,
  getAvailableProducts,
  getShippingRate,
  isProductAvailable
} from "./products.js";
import { addToCart, initHeaderUtilities, setAnnouncement, setYear, toggleMobileMenu } from "./common.js";

function productCardTemplate(product) {
  const shipping = getShippingRate(product);
  const card = document.createElement("article");
  card.className = "product-card";
  const hasStripeCheckout = typeof product.paymentLink === "string" && product.paymentLink.startsWith("https://buy.stripe.com/");

  const current = formatCurrency(product.price);
  const compare = formatCurrency(product.compareAtPrice);

  card.innerHTML = `
    <a class="product-thumb" href="product.html?id=${product.id}" aria-label="View ${product.name}">
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy" />
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
        <a class="btn btn-primary" href="${hasStripeCheckout ? `checkout.html?id=${product.id}` : "#"}">${hasStripeCheckout ? "Buy Now" : "Add to Cart"}</a>
      </div>
    </div>
  `;

  const buyNow = card.querySelector(".btn-primary");
  if (buyNow) {
    buyNow.addEventListener("click", (event) => {
      if (!hasStripeCheckout) {
        event.preventDefault();
      }
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      }, 1);
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
      name: product.name,
      sku: product.sku,
      image: product.images,
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
  initHeaderUtilities();
  setYear();
  setAnnouncement("Tops only: bases in photos are display examples and are not included.");
  renderShopGrid();
  renderFeatured();
  renderImageShowcase();
  injectHomepageSchema();
}

init();
