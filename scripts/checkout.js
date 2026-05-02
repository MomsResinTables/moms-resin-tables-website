import { STORE, formatCurrency, getProductById, getShippingRate, isProductAvailable } from "./products.js";
import { addToCart, initHeaderUtilities, recordOrder, setYear, toggleMobileMenu } from "./common.js";

function isStripeLink(value) {
  return typeof value === "string" && value.startsWith("https://buy.stripe.com/");
}

function renderCheckout(product) {
  if (!isProductAvailable(product)) {
    const node = document.querySelector("[data-checkout-root]");
    if (node) {
      node.innerHTML = `
        <section class="not-found">
          <h1>Piece No Longer Available</h1>
          <p>This design has already been sold. Use the custom builder if you want a similar top recreated.</p>
          <a class="btn btn-primary" href="custom.html">Open Custom Builder</a>
        </section>
      `;
    }
    return;
  }

  const shipping = getShippingRate(product);
  const total = product.price + shipping;

  const map = {
    "[data-checkout-name]": product.name,
    "[data-checkout-sku]": product.sku,
    "[data-checkout-price]": formatCurrency(product.price),
    "[data-checkout-shipping]": formatCurrency(shipping),
    "[data-checkout-total]": formatCurrency(total),
    "[data-checkout-note]": `${product.scopeNote} Shipping estimate is based on ${STORE.shippingBands[product.shippingBand].label} class.`
  };

  Object.entries(map).forEach(([selector, value]) => {
    const node = document.querySelector(selector);
    if (node) {
      node.textContent = value;
    }
  });

  const hero = document.querySelector("[data-checkout-image]");
  if (hero) {
    hero.src = product.images[0];
    hero.alt = product.name;
  }

  const button = document.querySelector("[data-checkout-button]");
  const warning = document.querySelector("[data-stripe-warning]");

  if (!button) {
    return;
  }

  if (isStripeLink(product.paymentLink)) {
    button.href = product.paymentLink;
    button.textContent = "Continue to Secure Stripe Checkout";
    button.removeAttribute("aria-disabled");
    warning.hidden = true;
    button.addEventListener("click", () => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      }, 1);
      recordOrder({
        productId: product.id,
        productName: product.name,
        total,
        status: "checkout_started"
      });
    });
  } else {
    button.href = "contact.html";
    button.textContent = "Request Invoice / Shipping Quote";
    button.removeAttribute("aria-disabled");
    warning.hidden = false;
    button.addEventListener("click", () => {
      recordOrder({
        productId: product.id,
        productName: product.name,
        total,
        status: "invoice_requested"
      });
    });
  }
}

function renderNotFound() {
  const node = document.querySelector("[data-checkout-root]");
  if (node) {
    node.innerHTML = `
      <section class="not-found">
        <h1>Checkout Unavailable</h1>
        <p>We could not load that product. Please return to the collection.</p>
        <a class="btn btn-primary" href="shop.html">Back to Shop</a>
      </section>
    `;
  }
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

  renderCheckout(product);
}

init();
