import { STORE, formatCurrency, getProductById, getShippingRate, isProductAvailable } from "./products.js";
import { addToCart, getAccountProfile, initHeaderUtilities, recordOrder, setYear, toggleMobileMenu, updateOrderStatus } from "./common.js";

const LAST_ORDER_ID_KEY = "mrt_last_order_id";

function isStripeLink(value) {
  return typeof value === "string" && value.startsWith("https://buy.stripe.com/");
}

function createOrderId(productId = "item") {
  const stamp = Date.now();
  const rand = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  const slug = String(productId || "item").replace(/[^a-z0-9]+/gi, "").toLowerCase().slice(0, 10) || "item";
  return `mrt-${slug}-${stamp}-${rand}`;
}

function saveLastOrderId(orderId) {
  if (!orderId) {
    return;
  }
  sessionStorage.setItem(LAST_ORDER_ID_KEY, orderId);
}

function getLastOrderId() {
  return sessionStorage.getItem(LAST_ORDER_ID_KEY) || "";
}

function setCheckoutStateMessage(message, tone = "info") {
  let node = document.querySelector("[data-checkout-state]");
  if (!node) {
    const root = document.querySelector(".checkout-summary");
    if (!root) {
      return;
    }
    node = document.createElement("p");
    node.className = "scope-note checkout-state";
    node.setAttribute("data-checkout-state", "");
    root.insertBefore(node, root.querySelector(".hero-actions"));
  }

  node.textContent = message;
  node.setAttribute("data-tone", tone);
}

function reconcileOrderStateFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const result = (params.get("payment") || "").trim().toLowerCase();
  const queryOrderId = (params.get("order") || "").trim();
  const orderId = queryOrderId || getLastOrderId();

  if (!result || !orderId) {
    return;
  }

  if (result === "success" || result === "paid") {
    updateOrderStatus(orderId, "paid", "Customer returned from payment confirmation.");
    setCheckoutStateMessage("Payment confirmation received. Your order now shows as Paid in your account dashboard.", "success");
    return;
  }

  if (result === "canceled" || result === "cancelled") {
    updateOrderStatus(orderId, "canceled", "Checkout was canceled before payment completion.");
    setCheckoutStateMessage("Checkout was canceled. You can restart payment at any time.", "warn");
    return;
  }

  if (result === "processing") {
    updateOrderStatus(orderId, "processing", "Payment provider marked transaction as processing.");
    setCheckoutStateMessage("Payment is processing. We will update your order status shortly.", "info");
  }
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
      const orderId = createOrderId(product.id);
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      }, 1);
      recordOrder({
        id: orderId,
        productId: product.id,
        productName: product.name,
        total,
        status: "checkout_started",
        checkoutUrl: product.paymentLink,
        eventNote: "Customer started Stripe checkout."
      });
      saveLastOrderId(orderId);

      const account = getAccountProfile();
      if (!account) {
        setCheckoutStateMessage("Tip: sign in before checkout so this order stays linked to your account history.", "warn");
      }
    });
  } else {
    button.href = "contact.html";
    button.textContent = "Request Invoice / Shipping Quote";
    button.removeAttribute("aria-disabled");
    warning.hidden = false;
    button.addEventListener("click", () => {
      const orderId = createOrderId(product.id);
      recordOrder({
        id: orderId,
        productId: product.id,
        productName: product.name,
        total,
        status: "invoice_requested",
        eventNote: "Customer requested invoice and shipping quote."
      });
      saveLastOrderId(orderId);
      setCheckoutStateMessage("Invoice request logged. You can track this request from your order history.", "info");
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
  reconcileOrderStateFromQuery();
}

init();
