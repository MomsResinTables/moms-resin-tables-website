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
const ACCOUNT_KEY = "mrt_account";
const ORDERS_KEY = "mrt_orders";

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
  const profile = parseStoredJSON(ACCOUNT_KEY, null);
  if (!profile || typeof profile !== "object") {
    return null;
  }
  if (!profile.email) {
    return null;
  }
  return profile;
}

function saveAccountProfile(profile) {
  writeStoredJSON(ACCOUNT_KEY, profile);
  emitStateChange();
}

export function signOutAccount() {
  localStorage.removeItem(ACCOUNT_KEY);
  emitStateChange();
}

function getOrders() {
  const orders = parseStoredJSON(ORDERS_KEY, []);
  if (!Array.isArray(orders)) {
    return [];
  }
  return orders;
}

export function recordOrder(order) {
  const orders = getOrders();
  orders.unshift({
    id: order.id || `mrt-${Date.now()}`,
    createdAt: order.createdAt || new Date().toISOString(),
    productId: order.productId || "",
    productName: order.productName || "",
    total: Number(order.total) || 0,
    status: order.status || "pending"
  });
  writeStoredJSON(ORDERS_KEY, orders.slice(0, 40));
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

function getHeaderToolsTemplate() {
  return `
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
    <button class="header-account-btn" type="button" data-open-account>Sign In</button>
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
      <h2 id="accountPanelTitle">Account and Cart</h2>
      <div class="account-panel__grid">
        <section>
          <h3>Your Cart</h3>
          <div data-cart-items></div>
          <p class="scope-note" data-cart-total></p>
          <div class="hero-actions">
            <a class="btn btn-secondary" href="index.html#products">Continue Shopping</a>
            <button class="btn btn-secondary" type="button" data-clear-cart>Clear Cart</button>
          </div>
        </section>
        <section>
          <h3>Account</h3>
          <form class="form-grid" data-signin-form>
            <label>
              Name
              <input type="text" name="name" placeholder="Your name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="name@email.com" required />
            </label>
            <label>
              Password
              <input type="password" name="password" placeholder="Password" required />
            </label>
            <button class="btn btn-primary" type="submit">Sign In</button>
          </form>

          <div data-account-summary hidden>
            <p><strong data-account-name></strong></p>
            <p data-account-email></p>
            <button class="btn btn-secondary" type="button" data-signout>Sign Out</button>
          </div>

          <h3 style="margin-top:.9rem;">Order History</h3>
          <div data-order-history></div>
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
    signinForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(signinForm);
      const profile = {
        name: String(formData.get("name") || "Customer").trim(),
        email: String(formData.get("email") || "").trim()
      };
      if (!profile.email) {
        return;
      }
      saveAccountProfile(profile);
      renderUtilityPanel();
    });
  }

  const signout = panel.querySelector("[data-signout]");
  if (signout) {
    signout.addEventListener("click", () => {
      signOutAccount();
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

  return panel;
}

function renderHeaderTools() {
  const nodes = document.querySelectorAll("[data-header-tools]");
  const count = getCartCount();
  const account = getAccountProfile();

  nodes.forEach((node) => {
    node.innerHTML = getHeaderToolsTemplate();

    const countNode = node.querySelector("[data-cart-count]");
    if (countNode) {
      countNode.textContent = String(count);
    }

    const accountButton = node.querySelector("[data-open-account]");
    if (accountButton) {
      accountButton.textContent = account ? "My Account" : "Sign In";
      accountButton.addEventListener("click", () => showUtilityPanel("account"));
    }

    const cartButton = node.querySelector("[data-open-cart]");
    if (cartButton) {
      cartButton.addEventListener("click", () => showUtilityPanel("cart"));
    }
  });
}

function renderUtilityPanel() {
  const panel = ensureUtilityPanel();
  const account = getAccountProfile();
  const orders = getOrders();
  const cartItems = getCartItems();

  const form = panel.querySelector("[data-signin-form]");
  const summary = panel.querySelector("[data-account-summary]");

  if (form && summary) {
    form.hidden = Boolean(account);
    summary.hidden = !account;
  }

  const accountName = panel.querySelector("[data-account-name]");
  const accountEmail = panel.querySelector("[data-account-email]");
  if (accountName) {
    accountName.textContent = account ? account.name || "Customer" : "";
  }
  if (accountEmail) {
    accountEmail.textContent = account ? account.email || "" : "";
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

  const totalNode = panel.querySelector("[data-cart-total]");
  if (totalNode) {
    const count = getCartCount();
    const total = getCartTotal();
    totalNode.textContent = count ? `${count} item(s) • Est. total ${formatMoney(total)}` : "";
  }

  const orderNode = panel.querySelector("[data-order-history]");
  if (orderNode) {
    if (!orders.length) {
      orderNode.innerHTML = "<p class=\"scope-note\">No orders yet. Once checkout starts, history appears here.</p>";
    } else {
      orderNode.innerHTML = orders.slice(0, 6).map((order) => `
        <article class="account-panel__line-item">
          <div>
            <strong>${order.productName || "Order"}</strong>
            <p>${new Date(order.createdAt).toLocaleDateString()} • ${order.status} • ${formatMoney(order.total)}</p>
          </div>
          <a class="btn btn-secondary" href="contact.html">Support</a>
        </article>
      `).join("");
    }
  }

  renderHeaderTools();
}

function showUtilityPanel(mode) {
  const panel = ensureUtilityPanel();
  panel.hidden = false;
  panel.setAttribute("aria-hidden", "false");
  panel.setAttribute("data-open-mode", mode || "account");
  document.body.style.overflow = "hidden";
  renderUtilityPanel();
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
  const nodes = document.querySelectorAll("[data-header-tools]");
  if (!nodes.length) {
    return;
  }

  ensureUtilityPanel();
  ensureMobileMenuEnhancements();
  ensureFooterEnhancements();
  renderUtilityPanel();
  syncMobileMenuState();

  if (!window.__mrtEscCloseListener) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideUtilityPanel();
      }
    });
    window.__mrtEscCloseListener = true;
  }

  if (!window.__mrtHeaderStateListener) {
    window.addEventListener("mrt:state-changed", () => {
      renderUtilityPanel();
      syncMobileMenuState();
    });
    window.__mrtHeaderStateListener = true;
  }
}
