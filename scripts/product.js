import { STORE, formatCurrency, getProductById, getShippingRate, isProductAvailable } from "./products.js";
import { addToCart, initHeaderUtilities, setYear, startProductCheckout, toggleMobileMenu } from "./common.js";

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

function hasStripeCheckoutLink(value) {
  return typeof value === "string" && value.startsWith("https://buy.stripe.com/");
}

function setMeta(product) {
  document.title = `${product.name} | ${STORE.name}`;
  const canonicalUrl = `${SITE_ORIGIN}/product.html?id=${encodeURIComponent(product.id)}`;

  const desc = `${product.name}. ${product.description} ${product.scopeNote} ${product.dimensions}. Ships nationwide from ${STORE.shipFrom}.`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", desc);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", `${product.name} | ${STORE.name}`);
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute("content", desc);
  }

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    ogImage.setAttribute("content", toAbsoluteUrl(product.images[0]));
  }

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute("content", canonicalUrl);
  }

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute("content", `${product.name} | ${STORE.name}`);
  }

  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) {
    twitterDesc.setAttribute("content", desc);
  }

  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage) {
    twitterImage.setAttribute("content", toAbsoluteUrl(product.images[0]));
  }

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute("href", canonicalUrl);
  }
}

function injectSchema(product) {
  const node = document.querySelector("[data-product-schema]");
  if (!node) {
    return;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    image: product.images,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: STORE.name
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_ORIGIN}/product.html?id=${encodeURIComponent(product.id)}`,
      priceCurrency: STORE.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: STORE.name
      }
    }
  };

  node.textContent = JSON.stringify(schema);
}

function renderGallery(product) {
  const main = document.querySelector("[data-main-image]");
  const thumbs = document.querySelector("[data-thumb-grid]");

  if (!main || !thumbs) {
    return;
  }

  main.src = product.images[0];
  main.alt = product.name;

  product.images.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "thumb-button";
    button.innerHTML = `<img src="${image}" alt="${product.name} angle ${index + 1}" loading="lazy" />`;
    button.addEventListener("click", () => {
      main.src = image;
      main.alt = `${product.name} angle ${index + 1}`;
      document.querySelectorAll(".thumb-button").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
    });

    if (index === 0) {
      button.classList.add("active");
    }

    thumbs.appendChild(button);
  });
}

function renderDetails(product) {
  const shipping = getShippingRate(product);
  const current = formatCurrency(product.price);
  const compare = formatCurrency(product.compareAtPrice);

  const mapping = {
    "[data-product-name]": product.name,
    "[data-product-category]": product.category,
    "[data-product-style]": product.styleTag,
    "[data-product-description]": product.description,
    "[data-product-dimensions]": product.dimensions,
    "[data-product-materials]": product.materials,
    "[data-product-finish]": product.finish,
    "[data-product-availability]": product.availability,
    "[data-product-lead-time]": product.leadTime,
    "[data-product-care]": product.care,
    "[data-product-scope]": product.scopeNote,
    "[data-product-price]": current,
    "[data-product-compare]": compare,
    "[data-product-shipping]": `${formatCurrency(shipping)} estimated base shipping`
  };

  Object.entries(mapping).forEach(([selector, value]) => {
    const node = document.querySelector(selector);
    if (node) {
      node.textContent = value;
    }
  });

  const buy = document.querySelector("[data-buy-link]");
  if (buy) {
    if (isProductAvailable(product)) {
      const hasStripeCheckout = hasStripeCheckoutLink(product.paymentLink);
      buy.href = "#";
      buy.textContent = hasStripeCheckout ? "Proceed to Checkout" : "Add to Cart";
      buy.removeAttribute("aria-disabled");

      const qtyDec = document.querySelector("[data-buy-qty-row] .qty-dec");
      const qtyInc = document.querySelector("[data-buy-qty-row] .qty-inc");
      const qtyInput = document.querySelector("[data-buy-qty-row] .qty-input");
      if (qtyDec && qtyInc && qtyInput) {
        qtyDec.addEventListener("click", () => {
          const v = parseInt(qtyInput.value, 10) || 1;
          if (v > 1) { qtyInput.value = v - 1; }
        });
        qtyInc.addEventListener("click", () => {
          const v = parseInt(qtyInput.value, 10) || 1;
          if (v < 10) { qtyInput.value = v + 1; }
        });
      }

      buy.addEventListener("click", (event) => {
        event.preventDefault();
        const qty = Math.min(10, Math.max(1, parseInt(qtyInput ? qtyInput.value : "1", 10) || 1));

        if (hasStripeCheckout) {
          startProductCheckout(product, {
            quantity: qty,
            addToCart: true,
            eventNote: "Customer started checkout from product page popup."
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
    } else {
      buy.href = "contact.html";
      buy.textContent = "This Piece Is Sold";
      buy.setAttribute("aria-disabled", "true");
      const qtyRow = document.querySelector("[data-buy-qty-row]");
      if (qtyRow) { qtyRow.hidden = true; }
    }
  }
}

function renderNotFound() {
  const wrapper = document.querySelector("[data-product-root]");
  if (!wrapper) {
    return;
  }

  wrapper.innerHTML = `
    <section class="not-found">
      <h1>Product Not Found</h1>
      <p>This piece may have sold or the link is incorrect.</p>
      <a class="btn btn-primary" href="shop.html">Browse Collection</a>
    </section>
  `;
}

function init() {
  toggleMobileMenu();
  initHeaderUtilities();
  setYear();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = id ? getProductById(id) : null;

  if (!product) {
    renderNotFound();
    return;
  }

  setMeta(product);
  renderGallery(product);
  renderDetails(product);
  injectSchema(product);
}

init();
