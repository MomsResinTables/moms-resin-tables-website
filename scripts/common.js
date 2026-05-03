import { getProductById, getShippingRate } from "./products.js";

export function setYear() {
  const yearNodes = document.querySelectorAll("[data-year]");
  const year = String(new Date().getFullYear());
  yearNodes.forEach((node) => {
    node.textContent = year;
  });
}

export function toggleMobileMenu() {
  const trigger = document.querySelector("[data-menu-trigger]");
  const menu = document.querySelector("[data-mobile-menu]");

  if (!trigger || !menu) {
    return;
  }

  const setMenuOpen = (open) => {
    menu.setAttribute("data-open", String(open));
    trigger.setAttribute("aria-expanded", String(open));
  };

  trigger.addEventListener("click", () => {
    const open = menu.getAttribute("data-open") === "true";
    setMenuOpen(!open);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }
    if (menu.getAttribute("data-open") !== "true") {
      return;
    }
    if (menu.contains(target) || trigger.contains(target)) {
      return;
    }
    setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
}

export function setAnnouncement(text) {
  const node = document.querySelector("[data-announcement]");
  if (node) {
    node.textContent = text;
  }
}

const CART_KEY = "mrt_cart";
const ORDERS_BY_USER_KEY = "mrt_orders_by_user";
const GUEST_ORDERS_KEY = "mrt_guest_orders";
const FIREBASE_SDK_VERSION = "11.6.1";
const FIREBASE_REQUIRED_KEYS = ["apiKey", "authDomain", "projectId", "appId"];
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAfxbw_Ur2jfQDZqEh-wBX9Lqeo1RdAIPA",
  authDomain: "customeraccounts-a29eb.firebaseapp.com",
  projectId: "customeraccounts-a29eb",
  storageBucket: "customeraccounts-a29eb.appspot.com",
  messagingSenderId: "4968118695",
  appId: "1:4968118695:web:079298c836a3d5f5551e82"
};

let firebaseAuthClientPromise = null;
let firebaseAuthClient = null;
let firebaseAccountProfile = null;
let authStateBootstrapped = false;
let authConfigState = "checking";
let googleAuthState = "ready";
let accountFeedback = { message: "", tone: "info" };

function parseStoredJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStoredJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFirebaseConfig() {
  const config = window.__MRT_FIREBASE_CONFIG__ || DEFAULT_FIREBASE_CONFIG;
  if (!config || typeof config !== "object") {
    return null;
  }

  const isValid = FIREBASE_REQUIRED_KEYS.every((key) => {
    const value = config[key];
    return typeof value === "string" && value.trim().length > 0;
  });

  return isValid ? config : null;
}

function hasFirebaseAuthConfig() {
  return Boolean(getFirebaseConfig());
}

function setAccountFeedback(message, tone = "info") {
  accountFeedback = {
    message: String(message || "").trim(),
    tone
  };
}

function normalizeFirebaseUser(user) {
  if (!user || !user.email) {
    return null;
  }

  const displayName = typeof user.displayName === "string" ? user.displayName.trim() : "";
  return {
    uid: typeof user.uid === "string" ? user.uid : "",
    name: displayName || user.email.split("@")[0] || "Customer",
    email: user.email,
    provider: Array.isArray(user.providerData) && user.providerData[0] ? user.providerData[0].providerId || "password" : "password"
  };
}

function getCurrentOrderOwnerKey() {
  const account = firebaseAccountProfile;
  if (!account || !account.email) {
    return "";
  }

  if (account.uid) {
    return `uid:${account.uid}`;
  }

  return `email:${account.email.toLowerCase()}`;
}

function getOrdersByUserMap() {
  const map = parseStoredJSON(ORDERS_BY_USER_KEY, {});
  if (!map || typeof map !== "object" || Array.isArray(map)) {
    return {};
  }
  return map;
}

function saveOrdersByUserMap(map) {
  writeStoredJSON(ORDERS_BY_USER_KEY, map);
}

function getOrdersForOwner(ownerKey) {
  if (!ownerKey) {
    return [];
  }

  const map = getOrdersByUserMap();
  const orders = map[ownerKey];
  return Array.isArray(orders) ? orders : [];
}

function saveOrdersForOwner(ownerKey, orders) {
  if (!ownerKey) {
    return;
  }

  const map = getOrdersByUserMap();
  map[ownerKey] = orders;
  saveOrdersByUserMap(map);
}

function getGuestOrders() {
  const orders = parseStoredJSON(GUEST_ORDERS_KEY, []);
  return Array.isArray(orders) ? orders : [];
}

function saveGuestOrders(orders) {
  writeStoredJSON(GUEST_ORDERS_KEY, orders);
}

function normalizeOrderStatus(status) {
  const value = String(status || "").trim().toLowerCase();
  if (!value) {
    return "draft";
  }
  return value;
}

function getOrderStatusMeta(status) {
  const normalized = normalizeOrderStatus(status);
  const map = {
    draft: { label: "Draft", tone: "muted" },
    checkout_started: { label: "Checkout Started", tone: "warn" },
    payment_submitted: { label: "Payment Submitted", tone: "warn" },
    paid: { label: "Paid", tone: "success" },
    processing: { label: "Processing", tone: "accent" },
    shipped: { label: "Shipped", tone: "accent" },
    delivered: { label: "Delivered", tone: "success" },
    canceled: { label: "Canceled", tone: "danger" },
    invoice_requested: { label: "Invoice Requested", tone: "warn" }
  };

  return map[normalized] || { label: "Pending", tone: "muted" };
}

function upsertOrderInList(orders, incoming) {
  const next = Array.isArray(orders) ? [...orders] : [];
  const nowIso = new Date().toISOString();
  const incomingId = incoming.id || `mrt-${Date.now()}`;
  const existingIndex = next.findIndex((order) => order && order.id === incomingId);

  const payload = {
    id: incomingId,
    createdAt: incoming.createdAt || nowIso,
    updatedAt: nowIso,
    productId: incoming.productId || "",
    productName: incoming.productName || "Order",
    total: Number(incoming.total) || 0,
    status: normalizeOrderStatus(incoming.status || "draft"),
    checkoutUrl: incoming.checkoutUrl || "",
    notes: incoming.notes || "",
    events: []
  };

  if (existingIndex >= 0) {
    const existing = next[existingIndex] || {};
    payload.createdAt = existing.createdAt || payload.createdAt;
    payload.productId = payload.productId || existing.productId || "";
    payload.productName = payload.productName || existing.productName || "Order";
    payload.total = payload.total || Number(existing.total) || 0;
    payload.checkoutUrl = payload.checkoutUrl || existing.checkoutUrl || "";
    payload.notes = payload.notes || existing.notes || "";
    payload.events = Array.isArray(existing.events) ? [...existing.events] : [];
    next.splice(existingIndex, 1);
  }

  const eventEntry = {
    at: nowIso,
    status: payload.status,
    note: incoming.eventNote || ""
  };
  payload.events.unshift(eventEntry);
  payload.events = payload.events.slice(0, 30);

  next.unshift(payload);
  next.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
  return next.slice(0, 80);
}

async function ensureFirebaseAuthClient() {
  if (!hasFirebaseAuthConfig()) {
    return null;
  }

  if (firebaseAuthClient) {
    return firebaseAuthClient;
  }

  if (!firebaseAuthClientPromise) {
    firebaseAuthClientPromise = (async () => {
      const firebaseBase = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
      const [{ getApp, getApps, initializeApp }, authModule] = await Promise.all([
        import(`${firebaseBase}/firebase-app.js`),
        import(`${firebaseBase}/firebase-auth.js`)
      ]);

      const app = getApps().length ? getApp() : initializeApp(getFirebaseConfig());
      firebaseAuthClient = {
        auth: authModule.getAuth(app),
        GoogleAuthProvider: authModule.GoogleAuthProvider,
        createUserWithEmailAndPassword: authModule.createUserWithEmailAndPassword,
        getRedirectResult: authModule.getRedirectResult,
        onAuthStateChanged: authModule.onAuthStateChanged,
        sendPasswordResetEmail: authModule.sendPasswordResetEmail,
        signInWithEmailAndPassword: authModule.signInWithEmailAndPassword,
        signInWithPopup: authModule.signInWithPopup,
        signInWithRedirect: authModule.signInWithRedirect,
        signOut: authModule.signOut,
        updateProfile: authModule.updateProfile
      };

      return firebaseAuthClient;
    })();
  }

  return firebaseAuthClientPromise;
}

async function initializeAccountAuth() {
  if (authStateBootstrapped) {
    return;
  }

  authStateBootstrapped = true;

  if (!hasFirebaseAuthConfig()) {
    authConfigState = "missing";
    firebaseAccountProfile = null;
    return;
  }

  try {
    const client = await ensureFirebaseAuthClient();
    authConfigState = "ready";
    try {
      const redirectResult = await client.getRedirectResult(client.auth);
      if (redirectResult?.user) {
        firebaseAccountProfile = normalizeFirebaseUser(redirectResult.user);
        setAccountFeedback("Signed in with Google.", "success");
      }
    } catch (error) {
      setAccountFeedback(getAuthErrorMessage(error), "error");
    }

    client.onAuthStateChanged(client.auth, (user) => {
      firebaseAccountProfile = normalizeFirebaseUser(user);
      if (firebaseAccountProfile) {
        migrateGuestOrdersToAccount();
      } else {
        setAccountFeedback("", "info");
      }
      emitStateChange();
    });
  } catch {
    authConfigState = "error";
    setAccountFeedback("Secure sign-in could not be initialized. Check the Firebase setup and try again.", "error");
    emitStateChange();
  }
}

function getAccountProviderLabel(account) {
  if (!account || !account.provider) {
    return "Saved on this device";
  }
  if (account.provider === "google.com") {
    return "Signed in with Google";
  }
  if (account.provider === "password") {
    return "Signed in with email";
  }
  return "Signed in";
}

function getAccountFormValues(form) {
  const formData = new FormData(form);
  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || "")
  };
}

function getAuthErrorMessage(error) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message : "";

  if (message.includes("deleted_client") || message.includes("OAuth client was deleted")) {
    return "Google sign-in is temporarily unavailable because the Google OAuth client for this Firebase project was deleted.";
  }

  if (message.includes("auth/unauthorized-domain")) {
    return "This domain is not yet authorized in Firebase Authentication settings.";
  }

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "That email or password was not recognized.";
    case "auth/email-already-in-use":
      return "That email already has an account. Try signing in instead.";
    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed before completion.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup. Allow popups and try again.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error while contacting the sign-in service. Try again.";
    default:
      return "Account sign-in failed. Please try again.";
  }
}

async function handleEmailAuthSubmit(form, action) {
  const values = getAccountFormValues(form);
  if (!values.email || !values.password) {
    setAccountFeedback("Email and password are required.", "error");
    renderUtilityPanel();
    return;
  }

  try {
    const client = await ensureFirebaseAuthClient();
    if (!client) {
      setAccountFeedback("Secure sign-in is not configured yet.", "error");
      renderUtilityPanel();
      return;
    }

    setAccountFeedback("", "info");

    if (action === "signup") {
      const credential = await client.createUserWithEmailAndPassword(client.auth, values.email, values.password);
      if (values.name) {
        await client.updateProfile(credential.user, { displayName: values.name });
      }
      firebaseAccountProfile = normalizeFirebaseUser(credential.user);
      if (values.name && firebaseAccountProfile) {
        firebaseAccountProfile.name = values.name;
      }
      setAccountFeedback("Account created successfully.", "success");
    } else {
      const credential = await client.signInWithEmailAndPassword(client.auth, values.email, values.password);
      firebaseAccountProfile = normalizeFirebaseUser(credential.user);
      setAccountFeedback("Signed in successfully.", "success");
    }

    hideUtilityPanel();
    emitStateChange();
    return;
  } catch (error) {
    setAccountFeedback(getAuthErrorMessage(error), "error");
  }

  renderUtilityPanel();
}

async function handleGoogleAuth() {
  try {
    const client = await ensureFirebaseAuthClient();
    if (!client) {
      setAccountFeedback("Google sign-in is not configured yet.", "error");
      renderUtilityPanel();
      return;
    }

    const provider = new client.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const credential = await client.signInWithPopup(client.auth, provider);
      googleAuthState = "ready";
      firebaseAccountProfile = normalizeFirebaseUser(credential.user);
      setAccountFeedback("Signed in with Google.", "success");
      hideUtilityPanel();
      emitStateChange();
      return;
    } catch (error) {
      if (typeof error?.code === "string" && error.code === "auth/popup-blocked") {
        setAccountFeedback("Popup blocked. Redirecting to Google sign-in.", "info");
        renderUtilityPanel();
        await client.signInWithRedirect(client.auth, provider);
        return;
      }

      const message = typeof error?.message === "string" ? error.message : "";
      if (message.includes("deleted_client") || message.includes("OAuth client was deleted")) {
        googleAuthState = "unavailable";
      }
      throw error;
    }
  } catch (error) {
    setAccountFeedback(getAuthErrorMessage(error), "error");
  }

  renderUtilityPanel();
}

async function handlePasswordReset(form) {
  const values = getAccountFormValues(form);
  if (!values.email) {
    setAccountFeedback("Enter your email address first, then request a password reset.", "error");
    renderUtilityPanel();
    return;
  }

  try {
    const client = await ensureFirebaseAuthClient();
    if (!client) {
      setAccountFeedback("Password reset is not configured yet.", "error");
      renderUtilityPanel();
      return;
    }

    await client.sendPasswordResetEmail(client.auth, values.email);
    setAccountFeedback("Password reset email sent. Check your inbox.", "success");
  } catch (error) {
    setAccountFeedback(getAuthErrorMessage(error), "error");
  }

  renderUtilityPanel();
}

function emitStateChange() {
  window.dispatchEvent(new CustomEvent("mrt:state-changed"));
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function isStripeCheckoutLink(value) {
  return typeof value === "string" && value.startsWith("https://buy.stripe.com/");
}

function createOrderId(productId = "item") {
  const stamp = Date.now();
  const rand = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  const slug = String(productId || "item").replace(/[^a-z0-9]+/gi, "").toLowerCase().slice(0, 10) || "item";
  return `mrt-${slug}-${stamp}-${rand}`;
}

function openStripeCheckoutOverlay(url, product) {
  const productName = (product && product.name) ? product.name : (typeof product === "string" ? product : "");
  const productPrice = (product && product.price) ? product.price : null;
  const productImage = (product && Array.isArray(product.images) && product.images[0]) ? product.images[0] : null;
  const productDesc = (product && product.description) ? product.description : null;
  const shipping = (product && typeof product.shippingBand === "string" && window._mrtStore) ? null : null;

  let overlay = document.getElementById("mrt-stripe-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "mrt-stripe-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Secure Checkout");
    overlay.innerHTML = `
      <div class="stripe-overlay__backdrop" id="mrt-stripe-backdrop"></div>
      <div class="stripe-overlay__card">
        <div class="stripe-overlay__header">
          <span class="stripe-overlay__title" id="mrt-stripe-overlay-title">Secure Checkout</span>
          <button class="stripe-overlay__close" id="mrt-stripe-close" type="button" aria-label="Close checkout">&times;</button>
        </div>
        <div class="stripe-overlay__body" id="mrt-stripe-body"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = () => {
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    overlay.querySelector("#mrt-stripe-backdrop").addEventListener("click", close);
    overlay.querySelector("#mrt-stripe-close").addEventListener("click", close);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) {
        close();
      }
    });
  }

  const title = overlay.querySelector("#mrt-stripe-overlay-title");
  const body = overlay.querySelector("#mrt-stripe-body");

  if (title) {
    title.textContent = productName ? `Checkout — ${productName}` : "Secure Checkout";
  }

  if (body) {
    const priceHtml = productPrice
      ? `<p class="stripe-overlay__price">${formatMoney(productPrice)}</p>`
      : "";
    const imgHtml = productImage
      ? `<img class="stripe-overlay__img" src="${productImage}" alt="${productName}" />`
      : "";
    const descHtml = productDesc
      ? `<p class="stripe-overlay__desc">${productDesc}</p>`
      : "";

    body.innerHTML = `
      ${imgHtml}
      <div class="stripe-overlay__info">
        <p class="stripe-overlay__item-name">${productName}</p>
        ${priceHtml}
        ${descHtml}
        <p class="stripe-overlay__trust">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Powered by Stripe &mdash; secure, encrypted payment
        </p>
        <a class="btn btn-primary stripe-overlay__cta" href="${url}" target="_blank" rel="noopener">
          Continue to Secure Payment &rarr;
        </a>
        <p class="stripe-overlay__note">Opens Stripe in a new tab. Your cart stays open here.</p>
      </div>
    `;
  }

  overlay.hidden = false;
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const closeBtn = overlay.querySelector("#mrt-stripe-close");
  if (closeBtn) {
    closeBtn.focus();
  }
}

export function startProductCheckout(product, options = {}) {
  if (!product || !product.id || !isStripeCheckoutLink(product.paymentLink)) {
    return false;
  }

  const quantity = Math.max(1, Number(options.quantity) || 1);
  const shouldAddToCart = options.addToCart === true;

  if (shouldAddToCart) {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: Array.isArray(product.images) ? (product.images[0] || "") : ""
    }, quantity);
  }

  const orderId = createOrderId(product.id);
  recordOrder({
    id: orderId,
    productId: product.id,
    productName: product.name || product.id,
    total: (Number(product.price) || 0) * quantity,
    status: "checkout_started",
    checkoutUrl: product.paymentLink,
    eventNote: options.eventNote || "Customer started Stripe checkout popup."
  });

  openStripeCheckoutOverlay(product.paymentLink, product);

  return true;
}

export function getCartItems() {
  const items = parseStoredJSON(CART_KEY, []);
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter((item) => item && item.id);
}

function saveCartItems(items) {
  writeStoredJSON(CART_KEY, items);
  emitStateChange();
}

export function getAccountProfile() {
  return firebaseAccountProfile;
}

export async function signOutAccount() {
  if (hasFirebaseAuthConfig()) {
    try {
      const client = await ensureFirebaseAuthClient();
      if (client) {
        await client.signOut(client.auth);
      }
      firebaseAccountProfile = null;
      setAccountFeedback("", "info");
    } catch {
      setAccountFeedback("Sign-out failed. Please try again.", "error");
    }
    emitStateChange();
    return;
  }
}

function getCurrentAccountOrders() {
  const ownerKey = getCurrentOrderOwnerKey();
  return getOrdersForOwner(ownerKey);
}

export function recordOrder(order) {
  const ownerKey = getCurrentOrderOwnerKey();
  if (!ownerKey) {
    const guestOrders = upsertOrderInList(getGuestOrders(), order || {});
    saveGuestOrders(guestOrders);
    emitStateChange();
    return;
  }

  const next = upsertOrderInList(getOrdersForOwner(ownerKey), order || {});
  saveOrdersForOwner(ownerKey, next);
  emitStateChange();
}

export function updateOrderStatus(orderId, status, eventNote = "") {
  if (!orderId) {
    return;
  }

  const ownerKey = getCurrentOrderOwnerKey();
  if (!ownerKey) {
    const nextGuestOrders = upsertOrderInList(getGuestOrders(), {
      id: orderId,
      status,
      eventNote
    });
    saveGuestOrders(nextGuestOrders);
    emitStateChange();
    return;
  }

  const next = upsertOrderInList(getOrdersForOwner(ownerKey), {
    id: orderId,
    status,
    eventNote
  });
  saveOrdersForOwner(ownerKey, next);
  emitStateChange();
}

function migrateGuestOrdersToAccount() {
  const ownerKey = getCurrentOrderOwnerKey();
  if (!ownerKey) {
    return;
  }

  const guestOrders = getGuestOrders();
  if (!guestOrders.length) {
    return;
  }

  let next = getOrdersForOwner(ownerKey);
  guestOrders.forEach((order) => {
    next = upsertOrderInList(next, {
      ...order,
      eventNote: order?.status === "checkout_started" ? "Recovered from guest session" : "Imported from guest session"
    });
  });
  saveOrdersForOwner(ownerKey, next);
  saveGuestOrders([]);
  emitStateChange();
}

export function addToCart(product, quantity = 1) {
  if (!product || !product.id) {
    return;
  }

  const qty = Math.max(1, Number(quantity) || 1);
  const items = getCartItems();
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity = (Number(existing.quantity) || 0) + qty;
  } else {
    items.push({
      id: product.id,
      name: product.name || product.id,
      price: Number(product.price) || 0,
      image: product.image || "",
      quantity: qty
    });
  }

  saveCartItems(items);
}

function removeCartItem(id) {
  const next = getCartItems().filter((item) => item.id !== id);
  saveCartItems(next);
}

function clearCartItems() {
  saveCartItems([]);
}

function getCartCount() {
  return getCartItems().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

function getCartTotal() {
  return getCartItems().reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return sum + (qty * price);
  }, 0);
}

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getAccountDisplayName(account) {
  if (!account) {
    return "";
  }

  const name = typeof account.name === "string" ? account.name.trim() : "";
  if (name) {
    return name;
  }

  const email = typeof account.email === "string" ? account.email.trim() : "";
  if (!email) {
    return "Customer";
  }

  return email.split("@")[0] || "Customer";
}

function getHeaderToolsTemplate(account) {
  const accountName = getAccountDisplayName(account);
  const orders = account ? getCurrentAccountOrders() : [];
  const activeOrderCount = orders.filter((order) => {
    const status = normalizeOrderStatus(order?.status);
    return ["checkout_started", "payment_submitted", "processing", "shipped"].includes(status);
  }).length;
  const recentOrders = orders.slice(0, 3);
  const recentOrdersMarkup = recentOrders.length
    ? recentOrders.map((order) => {
      const statusMeta = getOrderStatusMeta(order.status);
      return `
        <article class="header-account-menu__order-item">
          <div>
            <strong>${escapeHTML(order.productName || "Order")}</strong>
            <p>${escapeHTML(order.id || "-")} • ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span class="order-status-pill" data-tone="${statusMeta.tone}">${statusMeta.label}</span>
        </article>
      `;
    }).join("")
    : '<p class="scope-note">No orders yet. Your order history appears here after checkout.</p>';
  const accountButtonMarkup = account
    ? `
      <div class="header-account-status" data-account-status>
        <span class="header-account-status__label">User signed in:</span>
        <button class="header-account-status__button" type="button" data-account-menu-toggle aria-haspopup="menu" aria-expanded="false">
          <span class="header-account-status__name" data-account-display-name>${escapeHTML(accountName)}</span>
          <span class="header-account-status__caret" aria-hidden="true">▾</span>
        </button>
        <div class="header-account-menu" data-account-menu hidden>
          <div class="header-account-menu__summary">
            <p class="header-account-menu__eyebrow">Account Dashboard</p>
            <strong data-account-menu-name>${escapeHTML(accountName)}</strong>
            <p data-account-menu-email>${escapeHTML(account.email || "")}</p>
          </div>
          <div class="header-account-menu__metrics">
            <span class="header-account-menu__metric"><strong>${orders.length}</strong><small>Total Orders</small></span>
            <span class="header-account-menu__metric"><strong>${activeOrderCount}</strong><small>Active</small></span>
          </div>
          <div class="header-account-menu__orders">
            <p class="header-account-menu__eyebrow">Recent Orders</p>
            ${recentOrdersMarkup}
          </div>
          <div class="header-account-menu__actions">
            <button class="header-account-menu__action" type="button" data-account-menu-action="open-dashboard">Open Dashboard</button>
            <button class="header-account-menu__action" type="button" data-account-menu-action="logout">Log Out</button>
          </div>
        </div>
      </div>
    `
    : `<button class="header-account-btn" type="button" data-open-account>Sign In</button>`;

  return `
    <div class="header-account-shell" data-header-account-shell>
      ${accountButtonMarkup}
    </div>
    <button class="header-tool-btn" type="button" data-open-cart aria-label="Open cart">
      <span class="header-tool-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M3 4h2.2l1.1 1.8h13.9l-1.9 7.5H8.1L6.3 6.7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          <circle cx="10" cy="18.2" r="1.6" fill="currentColor"></circle>
          <circle cx="17" cy="18.2" r="1.6" fill="currentColor"></circle>
        </svg>
      </span>
      <span class="header-tool-label">Cart</span>
      <span class="header-tool-count" data-cart-count>0</span>
    </button>
    <a class="header-call-cta" href="tel:+18135551234" aria-label="Call or text us">
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.44 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      Call or Text
    </a>
  `;
}

function ensureUtilityPanel() {
  let panel = document.querySelector("[data-account-panel]");
  if (panel) {
    return panel;
  }

  panel = document.createElement("section");
  panel.className = "account-panel";
  panel.setAttribute("data-account-panel", "");
  panel.setAttribute("aria-hidden", "true");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="account-panel__backdrop" data-close-account-panel></div>
    <article class="account-panel__card" role="dialog" aria-modal="true" aria-labelledby="accountPanelTitle">
      <button class="account-panel__close" type="button" data-close-account-panel aria-label="Close account panel">&times;</button>
      <h2 id="accountPanelTitle" data-account-panel-title>Account and Cart</h2>
      <div class="account-panel__grid">
        <section data-panel-section="cart" data-cart-panel-section>
          <div class="checkout-window__header">
            <svg class="checkout-window__lock" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <h3 data-cart-panel-heading>Checkout</h3>
          </div>
          <div class="checkout-window__preview" data-cart-product-preview hidden></div>
          <div class="checkout-window__items" data-cart-items></div>
          <div class="checkout-window__total-row" data-cart-total-row hidden>
            <div class="checkout-window__total-line">
              <span class="checkout-window__total-label">Subtotal</span>
              <span class="checkout-window__line-amount" data-cart-subtotal></span>
            </div>
            <div class="checkout-window__total-line">
              <span class="checkout-window__total-label">Shipping</span>
              <span class="checkout-window__line-amount" data-cart-shipping></span>
            </div>
            <div class="checkout-window__total-line checkout-window__total-line--grand">
              <span class="checkout-window__total-label">Order Total</span>
              <span class="checkout-window__total-amount" data-cart-total></span>
            </div>
          </div>
          <div class="checkout-window__cta-zone">
            <a class="btn btn-primary checkout-window__pay-btn" href="#" data-cart-checkout rel="noopener noreferrer">
              Proceed to Secure Payment
            </a>
            <p class="checkout-window__trust-line">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Powered by Stripe &mdash; secure &amp; encrypted
            </p>
          </div>
          <div class="checkout-window__secondary-actions">
            <a class="checkout-window__continue-link" href="index.html#products">&larr; Continue Shopping</a>
            <button class="checkout-window__clear-btn" type="button" data-clear-cart>Clear Cart</button>
          </div>
        </section>
        <section data-panel-section="account">
          <h3 data-account-panel-heading>Account</h3>
          <div data-account-auth-shell>
            <p data-account-auth-note></p>
            <div class="account-panel__method-stack">
              <button class="account-panel__oauth-pill-btn" type="button" data-google-signin aria-label="Sign in with Google" title="Sign in with Google">
                <span class="account-panel__provider-icon" aria-hidden="true">
                  <svg viewBox="0 0 18 18" focusable="false">
                    <path fill="#EA4335" d="M9 7.2v3.72h5.18c-.22 1.2-.91 2.21-1.94 2.88l3.14 2.43c1.83-1.69 2.88-4.18 2.88-7.13 0-.69-.06-1.35-.18-1.99H9z"></path>
                    <path fill="#34A853" d="M3.64 10.71 2.93 13.4 0.29 15.45A8.98 8.98 0 0 0 9 18c2.43 0 4.47-.8 5.97-2.18l-3.14-2.43c-.87.59-1.98.94-3.83.94-2.33 0-4.31-1.57-5.01-3.68l-.35.03z"></path>
                    <path fill="#4A90E2" d="M0.29 2.55A8.98 8.98 0 0 0 0 9c0 2.15.77 4.12 2.05 5.66l3.35-2.6A5.4 5.4 0 0 1 3.99 9c0-.96.23-1.86.64-2.66L1.29 3.74z"></path>
                    <path fill="#FBBC05" d="M9 3.58c1.27 0 2.42.44 3.32 1.3l2.49-2.49C13.46 1.06 11.42 0 9 0 5.49 0 2.46 2.01.99 4.95l3.64 2.83C5.33 5.15 6.93 3.58 9 3.58z"></path>
                  </svg>
                </span>
                <span>Sign in with Google</span>
              </button>
            </div>
            <p class="account-panel__auth-divider" data-account-auth-divider>Or use your email</p>
            <form class="form-grid" data-signin-form>
              <label>
                Email
                <input type="email" name="email" placeholder="name@email.com" autocomplete="email" required />
              </label>
              <label data-account-password-field>
                Password
                <input type="password" name="password" placeholder="Password" autocomplete="current-password" />
              </label>
              <div class="account-panel__auth-actions">
                <button class="btn btn-primary" type="submit" data-account-action="signin">Sign In</button>
                <button class="btn btn-secondary" type="submit" data-account-action="signup">Create Account</button>
              </div>
              <button class="account-panel__text-action" type="button" data-password-reset>Forgot password?</button>
            </form>
            <p class="account-panel__feedback" data-account-feedback hidden></p>
          </div>

          <div class="account-panel__dashboard" data-panel-section="orders" data-account-dashboard hidden>
            <h3 style="margin-top:.2rem;">Order Dashboard</h3>
            <div class="account-panel__order-summary" data-order-summary></div>
            <div data-order-history></div>
            <p class="account-panel__policy-note">Refunds and cancellations are reviewed case-by-case. Once materials are purchased or production has started, only partial refunds may apply per policy.</p>
            <div class="hero-actions">
              <a class="btn btn-secondary" href="contact.html?topic=cancel_refund" data-dashboard-cancel>Request Refund / Cancel</a>
              <a class="btn btn-secondary" href="contact.html?topic=tracking" data-dashboard-tracking>Request Tracking Update</a>
            </div>
          </div>
        </section>
      </div>
    </article>
  `;

  document.body.appendChild(panel);
  panel.querySelectorAll("[data-close-account-panel]").forEach((node) => {
    node.addEventListener("click", hideUtilityPanel);
  });

  const signinForm = panel.querySelector("[data-signin-form]");
  if (signinForm) {
    signinForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const action = event.submitter instanceof HTMLElement ? event.submitter.getAttribute("data-account-action") || "signin" : "signin";

      if (hasFirebaseAuthConfig()) {
        await handleEmailAuthSubmit(signinForm, action);
        return;
      }

      setAccountFeedback("Sign-in is unavailable until Firebase config is connected for this site.", "error");
      renderUtilityPanel();
    });
  }

  const googleSignin = panel.querySelector("[data-google-signin]");
  if (googleSignin) {
    googleSignin.addEventListener("click", async () => {
      await handleGoogleAuth();
    });
  }

  const passwordReset = panel.querySelector("[data-password-reset]");
  if (passwordReset && signinForm) {
    passwordReset.addEventListener("click", async () => {
      await handlePasswordReset(signinForm);
    });
  }

  const signout = panel.querySelector("[data-signout]");
  if (signout) {
    signout.addEventListener("click", async () => {
      await signOutAccount();
      renderUtilityPanel();
    });
  }

  const clearCart = panel.querySelector("[data-clear-cart]");
  if (clearCart) {
    clearCart.addEventListener("click", () => {
      clearCartItems();
      renderUtilityPanel();
    });
  }

  const cartList = panel.querySelector("[data-cart-items]");
  if (cartList) {
    cartList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (target.matches("[data-remove-cart-item]")) {
        const id = target.getAttribute("data-remove-cart-item");
        if (id) {
          removeCartItem(id);
          renderUtilityPanel();
        }
      }
    });
  }

  const cartCheckout = panel.querySelector("[data-cart-checkout]");
  if (cartCheckout) {
    cartCheckout.addEventListener("click", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        return;
      }

      const productId = target.getAttribute("data-checkout-product-id") || "";
      const product = productId ? getProductById(productId) : null;
      const cartItem = productId ? getCartItems().find((item) => item.id === productId) : null;

      if (!product || !cartItem || !isStripeCheckoutLink(product.paymentLink)) {
        event.preventDefault();
        return;
      }

      // Record order before Stripe opens in new tab
      const qty = Math.max(1, Number(cartItem.quantity) || 1);
      const subtotal = (Number(product.price) || 0) * qty;
      const shippingTotal = (Number(getShippingRate(product)) || 0) * qty;
      const orderId = createOrderId(product.id);
      recordOrder({
        id: orderId,
        productId: product.id,
        productName: product.name || product.id,
        subtotal,
        shippingTotal,
        total: subtotal + shippingTotal,
        status: "checkout_started",
        checkoutUrl: product.paymentLink,
        eventNote: "Customer proceeded to Stripe checkout from cart checkout window."
      });
      // Link has target="_blank" — Stripe opens in new tab, panel stays open
    });
  }

  return panel;
}

function closeHeaderAccountMenus() {
  document.querySelectorAll("[data-account-menu]").forEach((menu) => {
    menu.hidden = true;
  });

  document.querySelectorAll("[data-account-menu-toggle]").forEach((toggle) => {
    toggle.setAttribute("aria-expanded", "false");
  });
}

function focusUtilityPanelSection(mode) {
  const panel = document.querySelector("[data-account-panel]");
  if (!panel) {
    return;
  }

  const sectionMap = {
    cart: '[data-panel-section="cart"]',
    account: '[data-panel-section="account"]',
    orders: '[data-panel-section="orders"]'
  };

  const selector = sectionMap[mode || "account"];
  const target = selector ? panel.querySelector(selector) : null;
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderHeaderTools() {
  const nodes = document.querySelectorAll("[data-header-tools]");
  const count = getCartCount();
  const account = getAccountProfile();

  nodes.forEach((node) => {
    node.innerHTML = getHeaderToolsTemplate(account);

    const countNode = node.querySelector("[data-cart-count]");
    if (countNode) {
      countNode.textContent = String(count);
    }

    const accountButton = node.querySelector("[data-open-account]");
    const accountMenuToggle = node.querySelector("[data-account-menu-toggle]");
    const accountMenu = node.querySelector("[data-account-menu]");

    if (accountButton) {
      accountButton.textContent = "Sign In";
      accountButton.addEventListener("click", () => showUtilityPanel("account"));
    }

    if (accountMenuToggle && accountMenu) {
      accountMenuToggle.addEventListener("click", () => {
        const isOpen = !accountMenu.hidden;
        closeHeaderAccountMenus();
        if (!isOpen) {
          accountMenu.hidden = false;
          accountMenuToggle.setAttribute("aria-expanded", "true");
        }
      });

      accountMenu.querySelectorAll("[data-account-menu-action]").forEach((actionNode) => {
        actionNode.addEventListener("click", async () => {
          const action = actionNode.getAttribute("data-account-menu-action");
          closeHeaderAccountMenus();

          if (action === "logout") {
            await signOutAccount();
            renderUtilityPanel();
            return;
          }

          if (action === "open-dashboard") {
            showUtilityPanel("orders");
            return;
          }

          showUtilityPanel(action === "orders" ? "orders" : "account");
        });
      });
    }

    const cartButton = node.querySelector("[data-open-cart]");
    if (cartButton) {
      cartButton.addEventListener("click", () => showUtilityPanel("cart"));
    }
  });
}

function renderUtilityPanel() {
  const panel = ensureUtilityPanel();
  const mode = panel.getAttribute("data-open-mode") || "account";
  const account = getAccountProfile();
  const orders = getCurrentAccountOrders();
  const cartItems = getCartItems();
  const titleNode = panel.querySelector("[data-account-panel-title]");
  const cartSection = panel.querySelector("[data-cart-panel-section]");
  const accountSection = panel.querySelector('[data-panel-section="account"]');
  const cartHeading = panel.querySelector("[data-cart-panel-heading]");
  const accountHeading = panel.querySelector("[data-account-panel-heading]");

  const form = panel.querySelector("[data-signin-form]");
  const authShell = panel.querySelector("[data-account-auth-shell]");
  const dashboardShell = panel.querySelector("[data-account-dashboard]");
  const authNote = panel.querySelector("[data-account-auth-note]");
  const authDivider = panel.querySelector("[data-account-auth-divider]");
  const googleButton = panel.querySelector("[data-google-signin]");
  const passwordField = panel.querySelector("[data-account-password-field]");
  const passwordInput = passwordField ? passwordField.querySelector('input[name="password"]') : null;
  const primaryAction = panel.querySelector('[data-account-action="signin"]');
  const createAction = panel.querySelector('[data-account-action="signup"]');
  const feedbackNode = panel.querySelector("[data-account-feedback]");
  const checkoutLink = panel.querySelector("[data-cart-checkout]");
  const firebaseReady = hasFirebaseAuthConfig();
  const cartMode = mode === "cart";
  const signInMode = mode === "account" && !account;
  const dashboardMode = (mode === "orders") || (mode === "account" && Boolean(account));

  panel.classList.toggle("account-panel--cart", cartMode);
  panel.classList.toggle("account-panel--signin", signInMode);
  panel.classList.toggle("account-panel--dashboard", dashboardMode);

  if (cartSection) {
    cartSection.hidden = !cartMode;
  }

  if (accountSection) {
    accountSection.hidden = cartMode;
  }

  if (titleNode) {
    titleNode.textContent = cartMode ? "Checkout" : (signInMode ? "Sign In" : "Order Dashboard");
  }

  if (cartHeading) {
    cartHeading.textContent = "Checkout";
  }

  if (accountHeading) {
    accountHeading.textContent = signInMode ? "Sign In" : "Order Dashboard";
  }

  if (authShell) {
    authShell.hidden = !signInMode;
  }

  if (dashboardShell) {
    dashboardShell.hidden = !(dashboardMode && account);
  }

  if (authNote) {
    if (authConfigState === "error") {
      authNote.textContent = "Account services are temporarily unavailable. Please try again shortly.";
    } else if (firebaseReady) {
      authNote.textContent = "Use Google or your email/password to sign in to your customer account.";
    } else {
      authNote.textContent = "Secure sign-in is not active yet for this site. Connect Firebase config to enable customer accounts.";
    }
  }

  if (googleButton) {
    googleButton.hidden = !firebaseReady;
    googleButton.disabled = !firebaseReady || googleAuthState === "unavailable";
    googleButton.setAttribute("aria-disabled", String(!firebaseReady || googleAuthState === "unavailable"));
  }

  if (authDivider) {
    authDivider.hidden = !firebaseReady;
  }

  if (passwordField) {
    passwordField.hidden = !firebaseReady;
  }

  if (passwordInput) {
    passwordInput.required = firebaseReady;
    if (!firebaseReady) {
      passwordInput.value = "";
    }
  }

  if (primaryAction) {
    primaryAction.textContent = "Sign In";
    primaryAction.disabled = !firebaseReady;
  }

  if (createAction) {
    createAction.hidden = !firebaseReady;
    createAction.disabled = !firebaseReady;
  }

  if (feedbackNode) {
    feedbackNode.hidden = !accountFeedback.message;
    feedbackNode.textContent = accountFeedback.message;
    feedbackNode.setAttribute("data-tone", accountFeedback.tone || "info");
  }

  const cartNode = panel.querySelector("[data-cart-items]");
  if (cartNode) {
    if (!cartItems.length) {
      cartNode.innerHTML = "<p class=\"scope-note\">Your cart is empty. Add pieces from Products or Product pages.</p>";
    } else {
      cartNode.innerHTML = cartItems.map((item) => `
        <article class="account-panel__line-item">
          <div>
            <strong>${item.name}</strong>
            <p>Qty ${item.quantity} • ${formatMoney(item.price)}</p>
          </div>
          <button type="button" class="btn btn-secondary" data-remove-cart-item="${item.id}">Remove</button>
        </article>
      `).join("");
    }
  }

  const totalRowNode = panel.querySelector("[data-cart-total-row]");
  const subtotalNode = panel.querySelector("[data-cart-subtotal]");
  const shippingNode = panel.querySelector("[data-cart-shipping]");
  const totalNode = panel.querySelector("[data-cart-total]");

  const previewNode = panel.querySelector("[data-cart-product-preview]");
  if (previewNode) {
    const firstItem = cartItems[0] || null;
    if (firstItem && firstItem.image) {
      previewNode.hidden = false;
      previewNode.innerHTML = `
        <img class="checkout-window__preview-img" src="${firstItem.image}" alt="${firstItem.name || ""}" />
        <div class="checkout-window__preview-info">
          <p class="checkout-window__preview-name">${firstItem.name || ""}</p>
          <p class="checkout-window__preview-price">${formatMoney(firstItem.price)}</p>
        </div>
      `;
    } else {
      previewNode.hidden = true;
      previewNode.innerHTML = "";
    }
  }

  const firstCartItem = cartItems[0] || null;
  const targetProduct = firstCartItem && firstCartItem.id ? getProductById(firstCartItem.id) : null;
  const checkoutQty = Math.max(1, Number(firstCartItem?.quantity) || 1);
  const checkoutSubtotal = targetProduct ? ((Number(targetProduct.price) || 0) * checkoutQty) : 0;
  const checkoutShipping = targetProduct ? ((Number(getShippingRate(targetProduct)) || 0) * checkoutQty) : 0;
  const checkoutTotal = checkoutSubtotal + checkoutShipping;

  if (totalRowNode) {
    totalRowNode.hidden = !targetProduct;
  }

  if (subtotalNode) {
    subtotalNode.textContent = targetProduct ? formatMoney(checkoutSubtotal) : "";
  }

  if (shippingNode) {
    shippingNode.textContent = targetProduct ? formatMoney(checkoutShipping) : "";
  }

  if (totalNode) {
    totalNode.textContent = targetProduct ? formatMoney(checkoutTotal) : "";
  }

  if (checkoutLink) {

    if (!firstCartItem || !firstCartItem.id || !targetProduct || !isStripeCheckoutLink(targetProduct.paymentLink)) {
      checkoutLink.setAttribute("aria-disabled", "true");
      checkoutLink.href = "#";
      checkoutLink.removeAttribute("data-checkout-product-id");
      checkoutLink.removeAttribute("target");
    } else {
      checkoutLink.removeAttribute("aria-disabled");
      checkoutLink.href = targetProduct.paymentLink;
      checkoutLink.setAttribute("data-checkout-product-id", targetProduct.id);
      checkoutLink.setAttribute("target", "_blank");
    }
  }

  const orderSummaryNode = panel.querySelector("[data-order-summary]");
  const orderNode = panel.querySelector("[data-order-history]");
  const activeOrderCount = orders.filter((order) => {
    const status = normalizeOrderStatus(order?.status);
    return ["checkout_started", "payment_submitted", "processing", "shipped"].includes(status);
  }).length;

  if (orderSummaryNode) {
    if (!account) {
      orderSummaryNode.innerHTML = "";
    } else {
      orderSummaryNode.innerHTML = `
        <span class="account-order-metric"><strong>${orders.length}</strong><small>Total</small></span>
        <span class="account-order-metric"><strong>${activeOrderCount}</strong><small>Active</small></span>
      `;
    }
  }

  if (orderNode) {
    if (!account) {
      orderNode.innerHTML = "<p class=\"scope-note\">Sign in to view your order history and status updates.</p>";
    } else if (!orders.length) {
      orderNode.innerHTML = "<p class=\"scope-note\">No orders yet. Once checkout starts, your history appears here.</p>";
    } else {
      orderNode.innerHTML = orders.slice(0, 6).map((order) => {
        const contactUrl = `contact.html?topic=order_support&body=${encodeURIComponent(`Order ID: ${order.id || ""}\nRequest: Please review this order for support.`)}`;
        return `
          <article class="account-panel__line-item">
            <div>
              <strong>${order.productName || "Order"}</strong>
              <p>Order ${order.id || "-"}</p>
              <p>
                <span class="order-status-pill" data-tone="${getOrderStatusMeta(order.status).tone}">${getOrderStatusMeta(order.status).label}</span>
                ${new Date(order.createdAt).toLocaleDateString()} • ${formatMoney(order.total)}
              </p>
            </div>
            <a class="btn btn-secondary" href="${contactUrl}">Support</a>
          </article>
        `;
      }).join("");
    }
  }

  const cancelLink = panel.querySelector("[data-dashboard-cancel]");
  if (cancelLink) {
    const targetOrder = orders[0] || null;
    const body = targetOrder
      ? `Order ID: ${targetOrder.id || ""}\nRequest: I would like to request a cancellation/refund review. I understand partial refunds may apply once materials are purchased or production has started.`
      : "Request: I would like to request a cancellation/refund review. I understand partial refunds may apply once materials are purchased or production has started.";
    cancelLink.href = `contact.html?topic=cancel_refund&body=${encodeURIComponent(body)}`;
  }

  const trackingLink = panel.querySelector("[data-dashboard-tracking]");
  if (trackingLink) {
    const targetOrder = orders[0] || null;
    const body = targetOrder
      ? `Order ID: ${targetOrder.id || ""}\nRequest: Please send my latest tracking update.`
      : "Request: Please send my latest tracking update.";
    trackingLink.href = `contact.html?topic=tracking&body=${encodeURIComponent(body)}`;
  }

  renderHeaderTools();
}

function showUtilityPanel(mode) {
  const panel = ensureUtilityPanel();
  closeHeaderAccountMenus();
  panel.hidden = false;
  panel.setAttribute("aria-hidden", "false");
  panel.setAttribute("data-open-mode", mode || "account");
  document.body.style.overflow = "hidden";
  renderUtilityPanel();
  focusUtilityPanelSection(mode);
}

function hideUtilityPanel() {
  const panel = document.querySelector("[data-account-panel]");
  if (!panel) {
    return;
  }
  panel.hidden = true;
  panel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function handleCheckoutSuccessMessage() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") !== "success") {
      return;
    }

    params.delete("checkout");
    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash || ""}`;
    window.history.replaceState({}, "", nextUrl);

    const overlay = document.createElement("div");
    overlay.className = "purchase-success-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Order confirmed");
    overlay.innerHTML = `
      <div class="purchase-success-modal">
        <button class="purchase-success-close" aria-label="Close">&times;</button>
        <div class="purchase-success-icon">
          <svg viewBox="0 0 52 52" aria-hidden="true" focusable="false">
            <circle cx="26" cy="26" r="25" fill="none" />
            <path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M14 27l8 8 16-16" />
          </svg>
        </div>
        <h2 class="purchase-success-title">Thank You!</h2>
        <p class="purchase-success-msg">Your order has been received. We&#8217;ll be in touch shortly with shipping details.</p>
        <div class="purchase-success-timer" aria-hidden="true"><span class="purchase-success-timer-bar"></span></div>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("purchase-success-overlay--visible"));

    let closeTimer;
    function closePurchaseModal() {
      clearTimeout(closeTimer);
      overlay.classList.remove("purchase-success-overlay--visible");
      overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
    }

    overlay.querySelector(".purchase-success-close").addEventListener("click", closePurchaseModal);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closePurchaseModal(); });
    closeTimer = setTimeout(closePurchaseModal, 3000);
  } catch (_error) {
    // Avoid blocking checkout return if rendering fails.
  }
}

function getSocialIconLinksMarkup() {
  return `
    <a href="#" aria-label="Facebook">
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.17 8.44 9.93v-7.03H7.9v-2.9h2.54V9.86c0-2.52 1.49-3.92 3.78-3.92 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.89h2.79l-.45 2.9h-2.34V22c4.78-.76 8.44-4.91 8.44-9.93z"></path>
      </svg>
    </a>
    <a href="#" aria-label="X">
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path d="M18.9 2h3.68l-8.04 9.19L24 22h-7.41l-5.8-6.58L4.99 22H1.3l8.6-9.84L0 2h7.6l5.24 5.96L18.9 2zm-1.29 17.8h2.04L6.49 4.1H4.3L17.61 19.8z"></path>
      </svg>
    </a>
    <a href="#" aria-label="LinkedIn">
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46a2.48 2.48 0 0 0-.02-4.96zM3 9h4v12H3V9zm7 0h3.83v1.64h.06c.53-1 1.84-2.06 3.8-2.06 4.07 0 4.82 2.68 4.82 6.16V21h-4v-5.48c0-1.31-.02-3-1.82-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9z"></path>
      </svg>
    </a>
  `;
}

function getFooterTrustBadgeMarkup() {
  return `
    <div class="footer-trust-badges" aria-label="Checkout and fulfillment trust badges">
      <span class="footer-trust-badge">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 0 1 3 3v1h1.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75H7.75a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 .75-.75H9V9a3 3 0 0 1 3-3zm-1.5 4h3V9a1.5 1.5 0 1 0-3 0v1z"></path></svg>
        Stripe-Powered Checkout
      </span>
      <span class="footer-trust-badge">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 8h-2.5L15 5H9L6.5 8H4a2 2 0 0 0-2 2v1h2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5h2v-1a2 2 0 0 0-2-2zm-9-1h2.9l1.2 1.5H9.9L11 7zm1 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path></svg>
        Insured Shipping Options
      </span>
    </div>
  `;
}

function ensureMobileMenuEnhancements() {
  const menu = document.querySelector("[data-mobile-menu]");
  if (!menu || menu.querySelector("[data-mobile-menu-extras]")) {
    return;
  }

  const extras = document.createElement("div");
  extras.className = "mobile-menu-extras";
  extras.setAttribute("data-mobile-menu-extras", "");
  extras.innerHTML = `
    <button class="mobile-menu-account" type="button" data-mobile-open-account>Sign In</button>
    <p class="mobile-menu-follow-label">Follow us here:</p>
    <div class="mobile-menu-socials" aria-label="Social links">
      ${getSocialIconLinksMarkup()}
    </div>
  `;

  menu.appendChild(extras);

  const mobileAccount = extras.querySelector("[data-mobile-open-account]");
  if (mobileAccount) {
    mobileAccount.addEventListener("click", () => {
      showUtilityPanel("account");
      menu.setAttribute("data-open", "false");
      const trigger = document.querySelector("[data-menu-trigger]");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }
}

function syncMobileMenuState() {
  const account = getAccountProfile();
  const mobileAccount = document.querySelector("[data-mobile-open-account]");
  if (mobileAccount) {
    mobileAccount.textContent = account ? "My Account" : "Sign In";
  }
}

function ensureFooterEnhancements() {
  const footerNavLinks = [
    { href: "about.html", text: "About" },
    { href: "contact.html", text: "Contact" },
    { href: "production-lead-times.html", text: "Lead Times" },
    { href: "privacy-policy.html", text: "Privacy Policy" },
    { href: "terms-of-service.html", text: "Terms of Service" },
    { href: "refund-policy.html", text: "Refund Policy" }
  ];

  document.querySelectorAll(".footer .footer-grid").forEach((grid) => {
    grid.classList.add("footer-grid--enhanced");

    const columns = Array.from(grid.children);
    const brandCol = columns[0];
    const linkCol = columns[1];
    const descCol = columns[2];

    // Brand col: add social icons
    if (brandCol && !brandCol.querySelector(".footer-social")) {
      brandCol.insertAdjacentHTML("beforeend", `
        <div class="footer-social" aria-label="Social links">
          ${getSocialIconLinksMarkup()}
        </div>
      `);
    }

    // Middle col: services and trust stack
    if (linkCol) {
      linkCol.classList.add("footer-services-col");
      linkCol.innerHTML = `
        <strong class="footer-col-heading">Services</strong>
        <ul class="footer-service-list">
          <li><span class="footer-service-icon">◆</span><span>One-of-one handcrafted tabletops</span></li>
          <li><span class="footer-service-icon">◆</span><span>Custom build planning and quoting</span></li>
          <li><span class="footer-service-icon">◆</span><span>Nationwide shipping from Florida</span></li>
          <li><span class="footer-service-icon">◆</span><span>24-48 hour commission response</span></li>
        </ul>
        ${getFooterTrustBadgeMarkup()}
        <a class="btn btn-secondary footer-services-cta" href="custom.html">Start Custom Build</a>
      `;
    }

    // 3rd col: replace with studio description
    if (descCol && !descCol.querySelector(".footer-desc")) {
      descCol.classList.add("footer-studio-col");
      descCol.innerHTML = `
        <strong class="footer-col-heading">The Studio</strong>
        <p class="footer-desc">Handcrafted resin and wood tabletops built one at a time in Safety Harbor, Florida. Every piece ships nationwide.</p>
        <p class="footer-desc footer-contact-line"><a href="tel:+18135551234">Call or Text: (813) 555-1234</a></p>
        <p class="footer-desc"><a href="mailto:hello@momsresintables.com">hello@momsresintables.com</a></p>
      `;
    }
  });

  // Footer bottom bar: full-width divider + policy links + copyright
  document.querySelectorAll(".footer").forEach((footer) => {
    const yr = new Date().getFullYear();
    let bottom = footer.querySelector(".footer-bottom");
    if (!bottom) {
      bottom = document.createElement("div");
      bottom.className = "footer-bottom";
      footer.appendChild(bottom);
    }

    bottom.className = "footer-bottom";
    bottom.innerHTML = `
      <hr class="footer-bottom-divider" />
      <div class="footer-bottom-inner">
        <nav class="footer-policy-nav" aria-label="Policy links">
          ${footerNavLinks.map((l) => `<a href="${l.href}">${l.text}</a>`).join("")}
        </nav>
        <p class="footer-copyright">\u00a9 ${yr} Mom\u2019s Resin Tables. All rights reserved.</p>
      </div>
    `;
  });
}

export function initHeaderUtilities() {
  handleCheckoutSuccessMessage();

  const nodes = document.querySelectorAll("[data-header-tools]");
  if (!nodes.length) {
    return;
  }

  initializeAccountAuth();
  ensureUtilityPanel();
  ensureMobileMenuEnhancements();
  ensureFooterEnhancements();
  renderUtilityPanel();
  syncMobileMenuState();

  if (!window.__mrtEscCloseListener) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeHeaderAccountMenus();
        hideUtilityPanel();
      }
    });
    window.__mrtEscCloseListener = true;
  }

  if (!window.__mrtHeaderMenuOutsideListener) {
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      const insideAccountShell = target instanceof Element ? target.closest("[data-header-account-shell]") : null;
      if (!insideAccountShell) {
        closeHeaderAccountMenus();
      }
    });
    window.__mrtHeaderMenuOutsideListener = true;
  }

  if (!window.__mrtHeaderStateListener) {
    window.addEventListener("mrt:state-changed", () => {
      renderUtilityPanel();
      syncMobileMenuState();
    });
    window.__mrtHeaderStateListener = true;
  }
}
