import { STORE, WOOD_TYPES, formatCurrency } from "./products.js";
import { initHeaderUtilities, setYear, toggleMobileMenu } from "./common.js";

const EMBED_COSTS = {
  embed_figurines: 95,
  embed_natural: 75,
  embed_mixed: 125,
  embed_glow: 75,
  embed_photo: 100,
  embed_warmled: 85,
  embed_rgbled: 120,
  embed_water: 180
};

const BASE_STYLE_PRICES = {
  hairpin: 550, aframe: 650, boxframe: 625, xframe: 700, floating: 750,
  "steel-pipe": 800, trestle: 850, "live-edge-base": 1100, waterfall: 1500, pedestal: 1600,
  "drawer-single": 1050, "drawer-double": 1350, "drawer-triple": 1600, "drawer-double-sided": 1900
};

const form = document.querySelector("[data-custom-form]");
const woodContainer = document.querySelector("[data-wood-selectors]");
const requestLink = document.querySelector("[data-send-request]");
const requestOverlay = document.querySelector("[data-request-overlay]");
const overlayStepChoice = requestOverlay ? requestOverlay.querySelector('[data-overlay-step="choice"]') : null;
const overlayStepRequest = requestOverlay ? requestOverlay.querySelector('[data-overlay-step="request"]') : null;
const overlayPayNow = requestOverlay ? requestOverlay.querySelector("[data-overlay-pay-now]") : null;
const overlayPayWarning = requestOverlay ? requestOverlay.querySelector("[data-overlay-pay-warning]") : null;
const overlayMessage = requestOverlay ? requestOverlay.querySelector("[data-preview-message]") : null;
const previewForm = requestOverlay ? requestOverlay.querySelector("[data-preview-request-form]") : null;

const CUSTOM_BUILD_STRIPE_PAYMENT_LINK = "";

function isStripeCheckoutLink(value) {
  return typeof value === "string" && value.startsWith("https://buy.stripe.com/");
}

function woodOptionsTemplate(index) {
  const options = WOOD_TYPES.map(
    (wood) => `<option value="${wood.id}">${wood.name}</option>`
  ).join("");

  return `
    <div class="wood-selector-row" data-wood-row>
      <label>
        Wood Type ${index + 1}
        <select name="wood_${index}" class="wood-select">${options}</select>
      </label>
      <figure class="wood-preview">
        <img src="${WOOD_TYPES[0].image}" alt="${WOOD_TYPES[0].name} sample" data-wood-image />
        <figcaption data-wood-name>${WOOD_TYPES[0].name}</figcaption>
      </figure>
    </div>
  `;
}

function setWoodSelectors(count) {
  const safeCount = Math.min(6, Math.max(1, Number(count) || 1));
  woodContainer.innerHTML = "";

  for (let i = 0; i < safeCount; i += 1) {
    woodContainer.insertAdjacentHTML("beforeend", woodOptionsTemplate(i));
  }

  wireWoodPreviewHandlers();
}

function wireWoodPreviewHandlers() {
  const rows = woodContainer.querySelectorAll("[data-wood-row]");
  rows.forEach((row) => {
    const select = row.querySelector(".wood-select");
    const image = row.querySelector("[data-wood-image]");
    const name = row.querySelector("[data-wood-name]");

    const update = () => {
      const selected = WOOD_TYPES.find((wood) => wood.id === select.value) || WOOD_TYPES[0];
      image.src = selected.image;
      image.alt = `${selected.name} sample`;
      name.textContent = selected.name;
    };

    select.addEventListener("change", update);
    update();
  });
}

function getSelectedWoodNames(data, woodCount) {
  const selected = [];

  for (let index = 0; index < woodCount; index += 1) {
    const woodId = data.get(`wood_${index}`);
    const wood = WOOD_TYPES.find((item) => item.id === woodId);
    if (wood) {
      selected.push(wood);
    }
  }

  return selected;
}

function computeEstimate() {
  const data = new FormData(form);
  const width = Number(data.get("width")) || 48;
  const depth = Number(data.get("depth")) || 24;
  const thickness = Number(data.get("thickness")) || 1.5;
  const woodCount = Number(data.get("woodCount")) || 1;

  const area = (width * depth) / 144;
  const base = Math.round(180 + area * 55 + (thickness - 1.5) * 120);
  const selectedWoods = getSelectedWoodNames(data, woodCount);
  const effectiveWoods = selectedWoods.length ? selectedWoods : [WOOD_TYPES[0]];
  const uniqueWoodCount = new Set(effectiveWoods.map((wood) => wood.id)).size;
  const avgSpeciesPremium = effectiveWoods.reduce(
    (sum, wood) => sum + (wood.premiumPerSqFt || 0),
    0
  ) / effectiveWoods.length;
  const woodBlendFee = Math.max(0, uniqueWoodCount - 1) * 25;
  const woodPremium = Math.round(area * avgSpeciesPremium + woodBlendFee);

  let design = 0;
  const resinStyle = data.get("resinStyle");
  if (resinStyle === "river") design += 110;
  if (resinStyle === "pigmented") design += 90;
  if (resinStyle === "layered") design += 130;

  const pourDepth = data.get("pourDepth");
  if (pourDepth === "medium") design += 60;
  if (pourDepth === "deep") design += 110;
  if (pourDepth === "ultradeep") design += 200;

  const checkedEmbeds = [];
  Object.entries(EMBED_COSTS).forEach(([key, price]) => {
    if (data.get(key)) {
      design += price;
      checkedEmbeds.push(key.replace("embed_", ""));
    }
  });

  let finish = 0;
  const finishTier = data.get("finishTier");
  if (finishTier === "marine") finish += 95;
  if (finishTier === "museum") finish += 180;

  let structure = 0;
  const baseOption = data.get("baseOption");
  const baseStyle = data.get("baseStyle");
  if (baseOption === "base" && baseStyle && BASE_STYLE_PRICES[baseStyle] !== undefined) {
    structure = BASE_STYLE_PRICES[baseStyle];
  }

  const total = base + woodPremium + design + finish + structure;

  return {
    base, woodPremium, design, finish, structure, total,
    width, depth, thickness, woodCount,
    area: area.toFixed(1),
    selectedWoods: selectedWoods.map((wood) => wood.name),
    woodBlendFee,
    avgSpeciesPremium: avgSpeciesPremium.toFixed(2),
    resinStyle, pourDepth,
    checkedEmbeds, finishTier, baseOption, baseStyle,
    notes: String(data.get("notes") || "").trim()
  };
}

function renderEstimate() {
  const estimate = computeEstimate();

  const map = {
    "[data-est-base]": formatCurrency(estimate.base),
    "[data-est-wood]": formatCurrency(estimate.woodPremium),
    "[data-est-design]": formatCurrency(estimate.design),
    "[data-est-finish]": formatCurrency(estimate.finish),
    "[data-est-structure]": formatCurrency(estimate.structure),
    "[data-est-total]": formatCurrency(estimate.total)
  };

  Object.entries(map).forEach(([selector, value]) => {
    const node = document.querySelector(selector);
    if (node) {
      node.textContent = value;
    }
  });

  const notesLine = estimate.notes ? `Client notes: ${estimate.notes}` : "Client notes: None provided";
  const buildSummary = [
    `Store: ${STORE.name}`,
    `Top dimensions: ${estimate.width} x ${estimate.depth} in`,
    `Thickness: ${estimate.thickness} in`,
    `Pour depth: ${estimate.pourDepth || "standard"}`,
    `Estimated area: ${estimate.area} sq ft`,
    `Wood types requested: ${estimate.woodCount}`,
    `Selected woods: ${estimate.selectedWoods.join(", ") || "Not selected"}`,
    `Wood premium model: ${estimate.avgSpeciesPremium}/sq ft average species premium + ${formatCurrency(estimate.woodBlendFee)} blend fee`,
    `Resin style: ${estimate.resinStyle}`,
    `Decorative embeds & effects: ${estimate.checkedEmbeds.length ? estimate.checkedEmbeds.join(", ") : "none"}`,
    `Finish tier: ${estimate.finishTier}`,
    `Base option: ${estimate.baseOption === "base" ? estimate.baseStyle || "not selected" : "Tabletop only"}`,
    `Estimated subtotal: ${formatCurrency(estimate.total)}`,
    notesLine,
    "",
    "Requested woods are subject to availability. Alternatives may be proposed before final quote approval.",
    "Please review wood availability and quote shipping to my zip code."
  ].join("\n");

  if (overlayMessage) {
    overlayMessage.value = buildSummary;
  }

  if (previewForm) {
    const hidden = previewForm.querySelector('input[name="build_summary"]') || document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "build_summary";
    hidden.value = buildSummary;
    if (!hidden.parentNode) previewForm.appendChild(hidden);
  }

  if (overlayPayNow) {
    if (isStripeCheckoutLink(CUSTOM_BUILD_STRIPE_PAYMENT_LINK)) {
      overlayPayNow.href = CUSTOM_BUILD_STRIPE_PAYMENT_LINK;
      overlayPayNow.target = "_blank";
      overlayPayNow.rel = "noopener";
      overlayPayNow.setAttribute("aria-disabled", "false");
      overlayPayNow.classList.remove("is-disabled");
      if (overlayPayWarning) overlayPayWarning.hidden = true;
    } else {
      overlayPayNow.href = "#";
      overlayPayNow.removeAttribute("target");
      overlayPayNow.removeAttribute("rel");
      overlayPayNow.setAttribute("aria-disabled", "true");
      overlayPayNow.classList.add("is-disabled");
      if (overlayPayWarning) overlayPayWarning.hidden = false;
    }
  }
}

function showOverlay() {
  if (!requestOverlay) return;
  requestOverlay.hidden = false;
  requestOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (overlayStepChoice) overlayStepChoice.hidden = false;
  if (overlayStepRequest) overlayStepRequest.hidden = true;
}

function hideOverlay() {
  if (!requestOverlay) return;
  requestOverlay.hidden = true;
  requestOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function init() {
  toggleMobileMenu();
  initHeaderUtilities();
  setYear();

  if (!form || !woodContainer || !requestLink) {
    return;
  }

  setWoodSelectors(2);

  const baseSelect = form.querySelector("[data-base-select]");
  const baseOptionsDiv = document.querySelector("[data-base-options]");
  const allFrames = document.querySelector("[data-all-frames]");

  function updateBaseSubOptions() {
    const val = baseSelect ? baseSelect.value : "none";
    if (baseOptionsDiv) {
      baseOptionsDiv.hidden = val === "none";
      if (val === "base" && allFrames) {
        const first = allFrames.querySelector("input[type=radio]");
        if (first && !allFrames.querySelector("input[type=radio]:checked")) first.checked = true;
      }
    }
    renderEstimate();
  }

  if (baseSelect) {
    baseSelect.addEventListener("change", updateBaseSubOptions);
  }

  if (requestLink) {
    requestLink.addEventListener("click", (event) => {
      event.preventDefault();
      renderEstimate();
      showOverlay();
    });
  }

  if (requestOverlay) {
    requestOverlay.querySelectorAll("[data-overlay-close]").forEach((node) => {
      node.addEventListener("click", hideOverlay);
    });

    const showRequest = requestOverlay.querySelector("[data-overlay-show-request]");
    if (showRequest) {
      showRequest.addEventListener("click", () => {
        if (overlayStepChoice) overlayStepChoice.hidden = true;
        if (overlayStepRequest) overlayStepRequest.hidden = false;
      });
    }

    const backChoice = requestOverlay.querySelector("[data-overlay-back-choice]");
    if (backChoice) {
      backChoice.addEventListener("click", () => {
        if (overlayStepChoice) overlayStepChoice.hidden = false;
        if (overlayStepRequest) overlayStepRequest.hidden = true;
      });
    }

    if (overlayPayNow) {
      overlayPayNow.addEventListener("click", (event) => {
        if (overlayPayNow.getAttribute("aria-disabled") === "true") {
          event.preventDefault();
        }
      });
    }
  }

  renderEstimate();

  form.addEventListener("input", (event) => {
    if (event.target && event.target.name === "woodCount") {
      setWoodSelectors(event.target.value);
    }
    renderEstimate();
  });

  form.addEventListener("change", renderEstimate);
}

init();
