"use strict";
const DEFAULT_SITE_CONFIG = {
  brand: "IC Impressoras & Cia",
  heroTitle: "Impressoras prontas.",
  heroAccent: "Negócios em movimento.",
  heroDescription: "Assistência técnica, venda de impressoras, tintas e informática.",
  whatsapp: "5599984805415",
  primary: "#ffc400",
  background: "#111214",
  card: "#1b1d20"
};

function readSiteConfig() {
  try {
    return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(localStorage.getItem("topcell-site-config") || "{}") };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

const printerSlides = [...document.querySelectorAll("[data-printer]")];
const printerDots = [...document.querySelectorAll(".printer-dots button")];

if (printerSlides.length) {
  let printerIndex = 0;
  const showPrinter = index => {
    printerIndex = index;
    printerSlides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === index));
    printerDots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
  };

  printerDots.forEach((dot, index) => dot.addEventListener("click", () => showPrinter(index)));
  window.setInterval(() => showPrinter((printerIndex + 1) % printerSlides.length), 4000);
}

function applySiteConfig(config) {
  document.documentElement.style.setProperty("--primary", config.primary);
  document.documentElement.style.setProperty("--background", config.background);
  document.documentElement.style.setProperty("--card", config.card);

  document.querySelectorAll("[data-site-config]").forEach(element => {
    const key = element.dataset.siteConfig;
    if (config[key] !== undefined) element.textContent = config[key];
  });

  document.querySelectorAll("[data-whatsapp-link]").forEach(link => {
    link.href = `https://wa.me/${config.whatsapp.replace(/\D/g, "")}`;
  });
}

const DEFAULT_CATALOG = [
  { section: "tela", items: [
    ["samsung-a", "Samsung linha A (A05, A15, A35...)", "a partir de R$ 150"],
    ["samsung-s", "Samsung linha S", "a partir de R$ 350"],
    ["iphone-8-se", "iPhone 8 / SE", "a partir de R$ 200"],
    ["iphone-x-12", "iPhone X / 11 / 12", "a partir de R$ 300"],
    ["iphone-13-15", "iPhone 13 / 14 / 15", "a partir de R$ 450"],
    ["xiaomi-redmi-poco", "Xiaomi Redmi / Poco", "a partir de R$ 180"],
    ["motorola-moto-g-e", "Motorola Moto G / E", "a partir de R$ 160"]
  ]},
  { section: "bateria", items: [
    ["samsung-a-m", "Samsung linha A / M", "a partir de R$ 129"],
    ["samsung-s-bateria", "Samsung linha S", "a partir de R$ 180"],
    ["iphone-8-se-bateria", "iPhone 8 / SE", "a partir de R$ 150"],
    ["iphone-x-12-bateria", "iPhone X / 11 / 12", "a partir de R$ 180"],
    ["iphone-13-15-bateria", "iPhone 13 / 14 / 15", "a partir de R$ 220"],
    ["xiaomi-redmi-poco-bateria", "Xiaomi Redmi / Poco", "a partir de R$ 140"],
    ["motorola-moto-g-e-bateria", "Motorola Moto G / E", "a partir de R$ 130"]
  ]},
  { section: "conector", items: [
    ["samsung-usb-c", "Samsung (USB-C)", "a partir de R$ 90"],
    ["iphone-lightning", "iPhone (Lightning)", "a partir de R$ 120"],
    ["iphone-15-usb-c", "iPhone 15 (USB-C)", "a partir de R$ 140"],
    ["xiaomi-usb-c", "Xiaomi (USB-C)", "a partir de R$ 90"],
    ["motorola-usb-c", "Motorola (USB-C)", "a partir de R$ 90"],
    ["limpeza-conector", "Limpeza do conector", "a partir de R$ 40"]
  ]}
];

window.TOPCELL_CATALOG_DEFAULTS = DEFAULT_CATALOG;

function readCatalogConfig() {
  try {
    return JSON.parse(localStorage.getItem("topcell-catalog-config") || "{}");
  } catch {
    return {};
  }
}

function applyCatalogConfig(overrides = readCatalogConfig()) {
  DEFAULT_CATALOG.forEach(section => {
    const cards = document.querySelectorAll(`#${section.section} .card`);
    section.items.forEach((item, index) => {
      const [id, defaultName, defaultPrice] = item;
      const card = cards[index];
      if (!card) return;
      const name = overrides[id]?.name ?? defaultName;
      const price = overrides[id]?.price ?? defaultPrice;
      const nameElement = card.querySelector("h3");
      const priceElement = card.querySelector(".price");
      if (nameElement) nameElement.textContent = name;
      if (priceElement) priceElement.textContent = price;
    });
  });
}

if (document.querySelector(".catalog-section")) applyCatalogConfig();

const DEFAULT_UNLOCK_CATALOG = [
  ["samsung-frp", "Samsung", "Remoção de conta Google (FRP)", "R$ 80"],
  ["samsung-carrier", "Samsung", "Desbloqueio de operadora", "R$ 60"],
  ["samsung-password", "Samsung", "Senha / padrão esquecido", "R$ 70"],
  ["apple-carrier", "Apple", "Desbloqueio de operadora", "R$ 120"],
  ["apple-password", "Apple", "Senha de tela esquecida", "R$ 100"],
  ["apple-bypass", "Apple", "Bypass de ativação", "sob consulta"],
  ["xiaomi-mi", "Xiaomi", "Remoção de conta Mi", "R$ 90"],
  ["xiaomi-frp", "Xiaomi", "Remoção de conta Google (FRP)", "R$ 80"],
  ["xiaomi-password", "Xiaomi", "Senha / padrão esquecido", "R$ 70"]
];
window.TOPCELL_UNLOCK_DEFAULTS = DEFAULT_UNLOCK_CATALOG;

function readUnlockCatalogConfig() {
  try {
    return JSON.parse(localStorage.getItem("topcell-unlock-catalog-config") || "{}");
  } catch {
    return {};
  }
}

function applyUnlockCatalogConfig(overrides = readUnlockCatalogConfig()) {
  if (!document.querySelector(".unlock-list")) return;
  document.querySelectorAll(".unlock-list li").forEach((row, index) => {
    if (index >= DEFAULT_UNLOCK_CATALOG.length) return;
    const [id, , defaultName, defaultPrice] = DEFAULT_UNLOCK_CATALOG[index];
    row.querySelector("span").textContent = overrides[id]?.name ?? defaultName;
    row.querySelector("strong").textContent = overrides[id]?.price ?? defaultPrice;
  });
}

applyUnlockCatalogConfig();

const DEFAULT_APPLE_MODELS = [
  ["iphone-11", "iPhone 11", "online", "assets/iphone-11.jpg"],
  ["iphone-12", "iPhone 12", "online", "assets/iphone-12.jpg"],
  ["iphone-12-pro", "iPhone 12 Pro", "online", "assets/iphone-12-pro.png"],
  ["iphone-13", "iPhone 13", "online", "assets/iphone-13.jpg"],
  ["iphone-15", "iPhone 15", "online", "assets/iphone-15.jpg"]
];
window.TOPCELL_APPLE_MODELS_DEFAULTS = DEFAULT_APPLE_MODELS;

function readAppleModelsConfig() {
  try {
    return JSON.parse(localStorage.getItem("topcell-apple-models-config") || "{}");
  } catch {
    return {};
  }
}

function applyAppleModelsConfig(overrides = readAppleModelsConfig()) {
  const appleCard = [...document.querySelectorAll(".grid > .card")].find(card =>
    card.querySelector("h2")?.textContent.trim() === "Apple"
  );
  if (!appleCard) return;

  let modelList = appleCard.querySelector(".unlock-models");
  if (!modelList) {
    appleCard.querySelector("ul.unlock-list")?.after(document.createElement("div"));
    modelList = document.createElement("div");
    modelList.className = "unlock-models";
    modelList.hidden = true;
    appleCard.insertBefore(modelList, appleCard.querySelector(".button.primary"));
  }

  modelList.replaceChildren();
  DEFAULT_APPLE_MODELS.forEach(([id, defaultName, defaultStatus, image]) => {
    const status = overrides[id]?.status ?? defaultStatus;
    const name = overrides[id]?.name ?? defaultName;
    const row = document.createElement("div");
    row.className = "unlock-model";
    row.innerHTML = `<span class="unlock-model-name"><img class="phone-photo" src="${image}" alt="${name}"><span>${name}</span></span><strong class="model-status ${status}">${status === "online" ? "Online" : "Offline"}</strong>`;
    modelList.appendChild(row);
  });

  const brandHeading = appleCard.querySelector("h2");
  brandHeading.classList.add("unlock-brand-toggle");
  brandHeading.setAttribute("role", "button");
  brandHeading.setAttribute("tabindex", "0");
  brandHeading.dataset.unlockBrandToggle = "apple";

  brandHeading.onclick = () => {
    modelList.hidden = !modelList.hidden;
    brandHeading.classList.toggle("open", !modelList.hidden);
  };
  brandHeading.onkeydown = event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      brandHeading.click();
    }
  };
}

applyAppleModelsConfig();

const siteConfig = readSiteConfig();
applySiteConfig(siteConfig);
window.addEventListener("storage", event => {
  if (event.key === "topcell-site-config") applySiteConfig(readSiteConfig());
});
window.addEventListener("message", event => {
  if (event.data && event.data.type === "TOPCELL_CONFIG") applySiteConfig(event.data.config);
  if (event.data && event.data.type === "TOPCELL_CATALOG") applyCatalogConfig(event.data.config);
  if (event.data && event.data.type === "TOPCELL_UNLOCK_CATALOG") applyUnlockCatalogConfig(event.data.config);
  if (event.data && event.data.type === "TOPCELL_APPLE_MODELS") applyAppleModelsConfig(event.data.config);
});

document.querySelectorAll("[data-password-toggle]").forEach(toggle => {
  const password = document.getElementById(toggle.dataset.passwordToggle);
  if (!password) return;

  toggle.addEventListener("click", () => {
    const showPassword = password.type === "password";
    password.type = showPassword ? "text" : "password";
    toggle.textContent = showPassword ? "Ocultar" : "Mostrar";
    toggle.setAttribute("aria-label", showPassword ? "Ocultar senha" : "Mostrar senha");
    toggle.setAttribute("aria-pressed", String(showPassword));
  });
});

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const menuToggle = document.querySelector(".menu-toggle");
const siteSidebar = document.getElementById("site-sidebar");
const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
if (menuToggle && siteSidebar && sidebarBackdrop) {
  const closeSidebar = () => {
    document.body.classList.remove("sidebar-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu lateral");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("sidebar-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu lateral" : "Abrir menu lateral");
  });
  sidebarBackdrop.addEventListener("click", closeSidebar);
  siteSidebar.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
      siteSidebar.querySelectorAll("nav a").forEach(item => item.classList.toggle("active", item === link));
      closeSidebar();
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSidebar();
  });
}

const printerProcedureDefinitions = [
  { key: "limpeza-maquina", label: "Limpeza da máquina", group: "Manutenção e reset" },
  { key: "procedimento-cabecote", label: "Limpeza do cabeçote", group: "Manutenção e reset", optionsLabel: "Cor com defeito", options: ["Preto", "Amarelo", "Vermelho", "Azul"] },
  { key: "reset", label: "Reset", group: "Manutenção e reset" },
  { key: "troca-bulk-ink", label: "Troca do Bulking", group: "Tintas e abastecimento", optionsLabel: "Cor", options: ["Preto", "Amarelo", "Vermelho", "Azul"] },
  { key: "troca-dump", label: "Troca de dump", group: "Tintas e abastecimento", optionsLabel: "Cor", options: ["Preto", "Amarelo", "Vermelho", "Azul"] },
  { key: "tinta", label: "Tinta", group: "Tintas e abastecimento", optionsLabel: "Tipo de tinta", options: ["X-FULL", "PREMIUM"] },
  { key: "troca-tinta", label: "Troca da tinta", group: "Tintas e abastecimento", optionsLabel: "Cor", options: ["Preto", "Amarelo", "Vermelho", "Azul"] },
  { key: "troca-carcaca", label: "Troca da carcaça", group: "Peças e componentes" },
  { key: "troca-lixeira", label: "Troca da lixeira", group: "Peças e componentes" },
  { key: "troca-bomba", label: "Troca da bomba", group: "Peças e componentes" },
  { key: "revisao", label: "Revisão", group: "Peças e componentes", optionsLabel: "Serviços", options: ["Raspagem da bomba", "Limpeza da fita", "Limpeza do disco", "Lubrificação"] },
  { key: "troca-painel", label: "Troca do painel", group: "Peças e componentes" },
  { key: "troca-placa", label: "Troca da placa", group: "Peças e componentes" },
  { key: "borracha-cima", label: "Borracha de cima", group: "Peças e componentes" },
  { key: "borracha-baixo", label: "Borracha de baixo", group: "Peças e componentes" },
  { key: "troca-cabo", label: "Troca do cabo", group: "Peças e componentes", optionsLabel: "Tipo de cabo", options: ["Cabo do cabeçote", "Cabo do carrinho"] },
  { key: "motor-painel", label: "Troca do motor do painel", group: "Peças e componentes" },
  { key: "cabo-painel", label: "Troca do cabo do painel", group: "Peças e componentes" },
  { key: "troca-fonte", label: "Troca da fonte", group: "Peças e componentes" },
  { key: "motor-carrinho", label: "Troca do motor do carrinho", group: "Peças e componentes" },
  { key: "troca-fita", label: "Troca da fita", group: "Peças e componentes" },
  { key: "troca-wifi", label: "Troca do Wi-Fi", group: "Peças e componentes" },
  { key: "troca-scanner", label: "Troca do Scanner", group: "Peças e componentes" }
];

const printerForm = document.getElementById("printer-form");
if (printerForm) {
  const feedback = document.getElementById("printer-form-feedback");
  const modelSelect = document.getElementById("printer-model");
  const modelOtherField = document.querySelector(".model-other-field");
  const modelOtherInput = document.getElementById("printer-model-other");
  const supportedBrandValues = new Set([...printerForm.elements.brand.options].map(option => option.value));
  const resetInput = document.getElementById("printer-reset");
  const resetValue = document.getElementById("printer-reset-value");
  const uploadInput = document.getElementById("test-page-upload");
  const preview = document.getElementById("test-page-preview");
  const previewImage = document.getElementById("test-page-image");
  const removeImageButton = document.getElementById("remove-test-page");
  const printerPhotoInput = document.getElementById("printer-photo-upload");
  const printerPhotoPreview = document.getElementById("printer-photo-preview");
  const printerPhotoPreviewImage = document.getElementById("printer-photo-image");
  const removePrinterPhotoButton = document.getElementById("remove-printer-photo");
  const printerResetInput = document.getElementById("printer-reset-upload");
  const printerResetPreview = document.getElementById("printer-reset-preview");
  const printerResetPreviewImage = document.getElementById("printer-reset-image");
  const removePrinterResetButton = document.getElementById("remove-printer-reset");
  const machineCleaningPhotoInput = document.getElementById("machine-cleaning-photo-upload");
  const machineCleaningPhotoPreview = document.getElementById("machine-cleaning-photo-preview");
  const machineCleaningPhotoPreviewImage = document.getElementById("machine-cleaning-photo-image");
  const removeMachineCleaningPhotoButton = document.getElementById("remove-machine-cleaning-photo");
  const recordStorageKey = "ic-printer-service-records";
  const legacyStorageKey = "ic-printer-service-record";
  const savedPrinterList = document.getElementById("saved-printer-list");
  const savedPrinterEmpty = document.getElementById("saved-printer-empty");
  const savedPrinterCount = document.getElementById("saved-printer-count");
  const detailsDialog = document.getElementById("printer-details-dialog");
  const procedureChecklist = document.getElementById("printer-procedure-checklist");
  const detailProcedureChecklist = document.getElementById("detail-procedure-checklist");
  const procedureTotalCount = document.getElementById("procedure-total-count");
  const procedureTotalProgress = document.getElementById("procedure-total-progress");
  const photoViewerDialog = document.getElementById("photo-viewer-dialog");
  const photoViewerImage = document.getElementById("photo-viewer-image");
  const photoViewerTitle = document.getElementById("photo-viewer-title");
  const formTitle = document.getElementById("printer-form-title");
  const submitButton = printerForm.querySelector('button[type="submit"]');
  const cancelEditButton = printerForm.querySelector("[data-cancel-edit]");
  let editingRecordId = null;
  const removedImages = new Set();
  let pendingTestPage = null;
  let pendingPrinterPhoto = null;
  let pendingPrinterReset = null;
  let pendingMachineCleaningPhoto = null;
  let previewUrl = "";
  let printerPhotoPreviewUrl = "";
  let printerResetPreviewUrl = "";
  let machineCleaningPhotoPreviewUrl = "";
  let detailTestPageUrl = "";
  let detailPrinterPhotoUrl = "";
  let detailPrinterResetUrl = "";
  let detailMachineCleaningPhotoUrl = "";
  let photoViewerUrl = "";
  let currentDetailTestPage = null;
  let currentDetailPrinterPhoto = null;
  let currentDetailPrinterReset = null;
  let currentDetailMachineCleaningPhoto = null;
  let savedCardImageUrls = [];

  modelSelect.addEventListener("change", () => {
    const isOther = modelSelect.value === "Outro";
    modelOtherField.hidden = !isOther;
    modelOtherInput.disabled = !isOther;
    modelOtherInput.required = isOther;
    if (!isOther) modelOtherInput.value = "";
  });

  const setFeedback = (message, isError = false) => {
    feedback.textContent = message;
    feedback.classList.toggle("error", isError);
  };

  const appendProcedureCheckbox = (container, definition, option) => {
    const label = document.createElement("label");
    label.className = option ? "procedure-option" : "procedure-done";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    if (option) {
      checkbox.dataset.procedureOption = definition.key;
      checkbox.value = option;
    } else {
      checkbox.dataset.procedureDone = definition.key;
    }
    if (option && definition.optionsLabel.startsWith("Cor")) {
      label.dataset.inkColor = option.toLowerCase();
    }
    const text = document.createElement("span");
    text.textContent = option || "Feito";
    label.append(checkbox, text);
    container.appendChild(label);
  };

  const renderProcedureChecklist = savedProcedures => {
    procedureChecklist.replaceChildren();
    const groups = [...new Set(printerProcedureDefinitions.map(definition => definition.group))];
    groups.forEach((groupName, groupIndex) => {
      const group = document.createElement("details");
      group.className = "procedure-group";
      group.dataset.procedureGroup = groupName;
      const heading = document.createElement("summary");
      heading.className = "procedure-group-heading";
      const number = document.createElement("span");
      number.className = "procedure-group-number";
      number.textContent = String(groupIndex + 1).padStart(2, "0");
      const title = document.createElement("h4");
      title.textContent = groupName;
      const count = document.createElement("span");
      count.className = "procedure-group-count";
      const definitions = printerProcedureDefinitions.filter(definition => definition.group === groupName);
      const progressTrack = document.createElement("span");
      progressTrack.className = "procedure-group-progress-track";
      progressTrack.setAttribute("role", "progressbar");
      progressTrack.setAttribute("aria-label", `Conclusão: ${groupName}`);
      progressTrack.setAttribute("aria-valuemin", "0");
      progressTrack.setAttribute("aria-valuemax", String(definitions.length));
      progressTrack.setAttribute("aria-valuenow", "0");
      const progressFill = document.createElement("span");
      progressFill.className = "procedure-group-progress-fill";
      progressTrack.appendChild(progressFill);
      const status = document.createElement("span");
      status.className = "procedure-group-status";
      const groupProgress = document.createElement("span");
      groupProgress.className = "procedure-group-progress";
      groupProgress.append(count, progressTrack, status);
      const chevron = document.createElement("span");
      chevron.className = "procedure-group-chevron";
      chevron.setAttribute("aria-hidden", "true");
      heading.append(number, title, groupProgress, chevron);
      const items = document.createElement("div");
      items.className = "procedure-group-items";
      definitions.forEach(definition => {
        const item = document.createElement("div");
        item.className = "procedure-item";
        const itemHeading = document.createElement("div");
        itemHeading.className = "procedure-item-heading";
        const title = document.createElement("h5");
        title.className = "procedure-item-title";
        title.textContent = definition.label;
        const done = document.createElement("label");
        done.className = "procedure-done";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.procedureDone = definition.key;
        const doneText = document.createElement("span");
        doneText.textContent = "Feito";
        done.append(checkbox, doneText);
        itemHeading.append(title, done);
        item.appendChild(itemHeading);
        if (definition.options) {
          const options = document.createElement("div");
          options.className = "procedure-options";
          options.setAttribute("role", "group");
          options.setAttribute("aria-label", `${definition.optionsLabel} - ${definition.label}`);
          definition.options.forEach(option => appendProcedureCheckbox(options, definition, option));
          item.appendChild(options);
        }
        const saved = savedProcedures?.[definition.key];
        if (saved?.done) checkbox.checked = true;
        (saved?.options || []).forEach(option => {
          const optionCheckbox = [...item.querySelectorAll(`[data-procedure-option="${definition.key}"]`)]
            .find(input => input.value === option);
          if (optionCheckbox) optionCheckbox.checked = true;
        });
        items.appendChild(item);
      });
      group.append(heading, items);
      procedureChecklist.appendChild(group);
    });
    updateProcedureProgress();
  };

  const updateProcedureProgress = () => {
    const completed = procedureChecklist.querySelectorAll("[data-procedure-done]:checked").length;
    const total = printerProcedureDefinitions.length;
    procedureTotalCount.textContent = `${completed} de ${total} concluídos`;
    procedureTotalProgress.style.width = `${(completed / total) * 100}%`;
    procedureTotalProgress.parentElement.setAttribute("aria-valuenow", String(completed));

    procedureChecklist.querySelectorAll(".procedure-group").forEach(group => {
      const groupDefinitions = printerProcedureDefinitions.filter(definition => definition.group === group.dataset.procedureGroup);
      const groupCompleted = group.querySelectorAll("[data-procedure-done]:checked").length;
      const progress = group.querySelector(".procedure-group-progress");
      progress.querySelector(".procedure-group-count").textContent = `${groupCompleted} / ${groupDefinitions.length}`;
      progress.querySelector(".procedure-group-status").textContent = "concluídos";
      const track = progress.querySelector(".procedure-group-progress-track");
      track.setAttribute("aria-valuenow", String(groupCompleted));
      track.querySelector(".procedure-group-progress-fill").style.width = `${(groupCompleted / groupDefinitions.length) * 100}%`;
    });
  };

  const getProcedureSelections = () => Object.fromEntries(
    printerProcedureDefinitions.map(definition => [
      definition.key,
      {
        done: Boolean(procedureChecklist.querySelector(`[data-procedure-done="${definition.key}"]`).checked),
        options: [...procedureChecklist.querySelectorAll(`[data-procedure-option="${definition.key}"]:checked`)]
          .map(input => input.value)
      }
    ])
  );

  const selectedProcedureEntries = procedures => printerProcedureDefinitions.flatMap(definition => {
    const selection = procedures?.[definition.key];
    if (!selection || (!selection.done && !selection.options?.length)) return [];
    const details = [];
    if (selection.done) details.push("Feito");
    if (selection.options?.length) details.push(`${definition.optionsLabel}: ${selection.options.join(", ")}`);
    return [{ label: definition.label, details: details.join(" · ") }];
  });

  const renderProcedureDetails = procedures => {
    detailProcedureChecklist.replaceChildren();
    const entries = selectedProcedureEntries(procedures);
    if (!entries.length) {
      const empty = document.createElement("li");
      empty.textContent = "Nenhum procedimento marcado.";
      detailProcedureChecklist.appendChild(empty);
      return;
    }
    entries.forEach(entry => {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = entry.label;
      const details = document.createElement("span");
      details.textContent = entry.details;
      item.append(title, details);
      detailProcedureChecklist.appendChild(item);
    });
  };

  const releasePreviewUrl = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = "";
  };

  const showImagePreview = (blob, targetPreview, targetImage, releaseUrl, setUrl) => {
    releaseUrl();
    if (!blob) {
      targetPreview.hidden = true;
      targetImage.removeAttribute("src");
      return;
    }
    const url = URL.createObjectURL(blob);
    setUrl(url);
    targetImage.src = url;
    targetPreview.hidden = false;
  };

  const showTestPagePreview = blob => {
    showImagePreview(blob, preview, previewImage, releasePreviewUrl, url => { previewUrl = url; });
  };

  const releasePrinterPhotoPreviewUrl = () => {
    if (printerPhotoPreviewUrl) URL.revokeObjectURL(printerPhotoPreviewUrl);
    printerPhotoPreviewUrl = "";
  };

  const showPrinterPhotoPreview = blob => {
    showImagePreview(blob, printerPhotoPreview, printerPhotoPreviewImage, releasePrinterPhotoPreviewUrl, url => {
      printerPhotoPreviewUrl = url;
    });
  };

  const releasePrinterResetPreviewUrl = () => {
    if (printerResetPreviewUrl) URL.revokeObjectURL(printerResetPreviewUrl);
    printerResetPreviewUrl = "";
  };

  const showPrinterResetPreview = blob => {
    showImagePreview(blob, printerResetPreview, printerResetPreviewImage, releasePrinterResetPreviewUrl, url => {
      printerResetPreviewUrl = url;
    });
  };

  const releaseMachineCleaningPhotoPreviewUrl = () => {
    if (machineCleaningPhotoPreviewUrl) URL.revokeObjectURL(machineCleaningPhotoPreviewUrl);
    machineCleaningPhotoPreviewUrl = "";
  };

  const showMachineCleaningPhotoPreview = blob => {
    showImagePreview(blob, machineCleaningPhotoPreview, machineCleaningPhotoPreviewImage, releaseMachineCleaningPhotoPreviewUrl, url => {
      machineCleaningPhotoPreviewUrl = url;
    });
  };

  const openTestPageDatabase = () => new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("Este navegador não oferece armazenamento local para a imagem."));
      return;
    }
    const request = indexedDB.open("ic-impressoras-assistencia", 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("uploads")) request.result.createObjectStore("uploads");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Não foi possível abrir o armazenamento da imagem."));
  });

  const storeUpload = async (key, blob) => {
    const database = await openTestPageDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("uploads", "readwrite");
      const store = transaction.objectStore("uploads");
      if (blob) store.put(blob, key);
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onerror = () => { database.close(); reject(transaction.error || new Error("Não foi possível salvar a imagem.")); };
      transaction.onabort = () => { database.close(); reject(transaction.error || new Error("O salvamento da imagem foi cancelado.")); };
    });
  };

  const deleteUpload = async key => {
    const database = await openTestPageDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("uploads", "readwrite");
      transaction.objectStore("uploads").delete(key);
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onerror = () => { database.close(); reject(transaction.error || new Error("Não foi possível remover a imagem.")); };
      transaction.onabort = () => { database.close(); reject(transaction.error || new Error("A remoção da imagem foi cancelada.")); };
    });
  };

  const loadUpload = async key => {
    const database = await openTestPageDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("uploads", "readonly");
      const request = transaction.objectStore("uploads").get(key);
      request.onsuccess = () => { database.close(); resolve(request.result || null); };
      request.onerror = () => { database.close(); reject(request.error || new Error("Não foi possível carregar a imagem salva.")); };
    });
  };

  const loadRecordImages = async record => {
    const [printerPhoto, testPage, printerReset, machineCleaningPhoto, legacyTestPage] = await Promise.all([
      loadUpload(`${record.id}:printer-photo`),
      loadUpload(`${record.id}:test-page`),
      loadUpload(`${record.id}:printer-reset`),
      loadUpload(`${record.id}:machine-cleaning-photo`),
      loadUpload(record.id)
    ]);
    const resolveImage = async (type, image) => {
      if (image || !window.icFirebaseSync) return image;
      const cloudImage = await window.icFirebaseSync.loadImage(record.id, type);
      if (cloudImage) await storeUpload(`${record.id}:${type}`, cloudImage);
      return cloudImage;
    };
    const resolvedPrinterPhoto = await resolveImage("printer-photo", printerPhoto);
    const resolvedTestPage = await resolveImage("test-page", testPage || legacyTestPage);
    const resolvedPrinterReset = await resolveImage("printer-reset", printerReset);
    const resolvedMachineCleaningPhoto = await resolveImage("machine-cleaning-photo", machineCleaningPhoto);
    return {
      printerPhoto: resolvedPrinterPhoto,
      printerReset: resolvedPrinterReset,
      machineCleaningPhoto: resolvedMachineCleaningPhoto,
      testPage: resolvedTestPage || (record.legacyTestPage ? await loadUpload("test-page") : null)
    };
  };

  const loadLocalRecordImages = async record => {
    const [printerPhoto, testPage, printerReset, machineCleaningPhoto, legacyTestPage] = await Promise.all([
      loadUpload(`${record.id}:printer-photo`),
      loadUpload(`${record.id}:test-page`),
      loadUpload(`${record.id}:printer-reset`),
      loadUpload(`${record.id}:machine-cleaning-photo`),
      loadUpload(record.id)
    ]);
    return {
      printerPhoto,
      printerReset,
      machineCleaningPhoto,
      testPage: testPage || legacyTestPage || (record.legacyTestPage ? await loadUpload("test-page") : null)
    };
  };

  const openPhotoViewer = (image, title) => {
    if (photoViewerUrl) URL.revokeObjectURL(photoViewerUrl);
    photoViewerUrl = URL.createObjectURL(image);
    photoViewerImage.src = photoViewerUrl;
    photoViewerTitle.textContent = title;
    photoViewerDialog.showModal();
  };

  const getSavedRecords = () => {
    const storedValue = localStorage.getItem(recordStorageKey);
    if (storedValue !== null) {
      const storedRecords = JSON.parse(storedValue);
      if (Array.isArray(storedRecords)) return storedRecords;
      throw new Error("O histórico salvo possui um formato inválido.");
    }

    const legacyRecord = JSON.parse(localStorage.getItem(legacyStorageKey) || "null");
    if (!legacyRecord || typeof legacyRecord !== "object" || !legacyRecord.name) return [];

    const migratedRecord = {
      ...legacyRecord,
      id: `legacy-${Date.now()}`,
      savedAt: legacyRecord.savedAt || new Date().toISOString(),
      legacyTestPage: true
    };
    localStorage.setItem(recordStorageKey, JSON.stringify([migratedRecord]));
    localStorage.removeItem(legacyStorageKey);
    return [migratedRecord];
  };

  const formatSavedDate = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Data indisponível";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
  };

  const appendPrintField = (container, label, value) => {
    const field = document.createElement("div");
    field.className = "record-print-field";
    const term = document.createElement("span");
    term.textContent = label;
    const description = document.createElement("strong");
    description.textContent = value || "Não informado";
    field.append(term, description);
    container.appendChild(field);
  };

  const blobToDataUrl = blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Não foi possível preparar uma foto para o PDF."));
    reader.readAsDataURL(blob);
  });

  const encodeTextBase64 = value => {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary);
  };

  const decodeTextBase64 = value => {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  const preparePdfImage = async blob => {
    let bitmap;
    try {
      bitmap = await createImageBitmap(blob);
      let scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
      const qualities = [0.76, 0.62, 0.48, 0.34];
      while (scale >= 0.2) {
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Não foi possível preparar uma foto para o PDF.");
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        for (const quality of qualities) {
          const compressed = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
          if (compressed && compressed.size <= 260000) return await blobToDataUrl(compressed);
        }
        scale *= 0.75;
      }
      throw new Error("Não foi possível reduzir uma foto o suficiente para incluir no PDF.");
    } finally {
      bitmap?.close();
    }
  };

  const downloadRecordPdf = async (record, button) => {
    button.disabled = true;
    const originalLabel = button.textContent;
    button.textContent = "Preparando PDF...";
    let printRoot;
    let imageUrls = [];
    let previousTitle = document.title;
    const cleanup = () => {
      document.body.classList.remove("printing-record");
      if (printRoot?.isConnected) printRoot.remove();
      imageUrls.forEach(url => URL.revokeObjectURL(url));
      imageUrls = [];
      document.title = previousTitle;
      window.removeEventListener("afterprint", cleanup);
    };

    try {
      const images = await loadRecordImages(record);
      const photoData = {};
      for (const [type, image] of Object.entries(images)) {
        if (image) photoData[type] = await preparePdfImage(image);
      }
      const importableRecord = {
        ...record,
        procedure: typeof record.procedure === "string" ? record.procedure : "",
        procedures: record.procedures && typeof record.procedures === "object" && !Array.isArray(record.procedures)
          ? record.procedures
          : {}
      };
      const importPayload = encodeTextBase64(JSON.stringify({
        format: "ic-impressoras-record",
        version: 1,
        record: importableRecord,
        photos: photoData
      }));
      printRoot = document.createElement("main");
      printRoot.className = "record-print-document";

      const header = document.createElement("header");
      header.className = "record-print-header";
      const brand = document.createElement("span");
      brand.className = "record-print-brand";
      brand.textContent = "IC IMPRESSORAS & CIA";
      const title = document.createElement("h1");
      title.textContent = "Ficha de serviço técnico";
      const savedDate = document.createElement("p");
      savedDate.textContent = `Salvo em ${formatSavedDate(record.savedAt)}`;
      header.append(brand, title, savedDate);
      printRoot.appendChild(header);

      const dataSection = document.createElement("section");
      dataSection.className = "record-print-section";
      const dataTitle = document.createElement("h2");
      dataTitle.textContent = "Dados do atendimento";
      const dataGrid = document.createElement("div");
      dataGrid.className = "record-print-grid";
      appendPrintField(dataGrid, "Cliente", record.name);
      appendPrintField(dataGrid, "Marca", record.brand);
      appendPrintField(dataGrid, "Modelo", record.model);
      appendPrintField(dataGrid, "Progresso do reset", `${Number(record.reset) || 0}%`);
      dataSection.append(dataTitle, dataGrid);
      printRoot.appendChild(dataSection);

      const descriptionSection = document.createElement("section");
      descriptionSection.className = "record-print-section";
      const descriptionTitle = document.createElement("h2");
      descriptionTitle.textContent = "Procedimento realizado";
      const description = document.createElement("p");
      description.className = "record-print-description";
      description.textContent = record.procedure || "Nenhuma descrição informada.";
      descriptionSection.append(descriptionTitle, description);
      printRoot.appendChild(descriptionSection);

      const procedureSection = document.createElement("section");
      procedureSection.className = "record-print-section";
      const procedureTitle = document.createElement("h2");
      procedureTitle.textContent = "Procedimentos da ficha";
      const procedureList = document.createElement("ul");
      procedureList.className = "record-print-procedures";
      const selectedProcedures = selectedProcedureEntries(record.procedures);
      if (selectedProcedures.length) {
        selectedProcedures.forEach(entry => {
          const item = document.createElement("li");
          const label = document.createElement("strong");
          label.textContent = entry.label;
          const details = document.createElement("span");
          details.textContent = entry.details;
          item.append(label, details);
          procedureList.appendChild(item);
        });
      } else {
        const item = document.createElement("li");
        item.textContent = "Nenhum procedimento marcado.";
        procedureList.appendChild(item);
      }
      procedureSection.append(procedureTitle, procedureList);
      printRoot.appendChild(procedureSection);

      const photoEntries = [
        { image: images.printerPhoto, label: "Foto da impressora" },
        { image: images.testPage, label: "Página de teste" },
        { image: images.printerReset, label: "Foto do reset" },
        { image: images.machineCleaningPhoto, label: "Condição da máquina ao chegar" }
      ].filter(entry => entry.image);
      if (photoEntries.length) {
        const photoSection = document.createElement("section");
        photoSection.className = "record-print-section";
        const photoTitle = document.createElement("h2");
        photoTitle.textContent = "Fotos do atendimento";
        const photoGrid = document.createElement("div");
        photoGrid.className = "record-print-photos";
        photoEntries.forEach(({ image, label }) => {
          const figure = document.createElement("figure");
          const imageUrl = URL.createObjectURL(image);
          imageUrls.push(imageUrl);
          const photo = document.createElement("img");
          photo.src = imageUrl;
          photo.alt = label;
          const caption = document.createElement("figcaption");
          caption.textContent = label;
          figure.append(photo, caption);
          photoGrid.appendChild(figure);
        });
        photoSection.append(photoTitle, photoGrid);
        printRoot.appendChild(photoSection);
      }

      const importData = document.createElement("span");
      importData.className = "record-print-import-data";
      const wrappedImportPayload = importPayload.match(/.{1,2048}/g)?.join("\n") || "";
      importData.textContent = `ICFICHEV1BEGIN${wrappedImportPayload}ICFICHEV1END`;
      printRoot.appendChild(importData);
      document.body.appendChild(printRoot);
      await Promise.all([...printRoot.querySelectorAll("img")].map(image => image.decode()));
      previousTitle = document.title;
      document.title = `Ficha - ${String(record.name || "Atendimento").replace(/[\\/:*?"<>|]/g, "-")}`;
      window.addEventListener("afterprint", cleanup, { once: true });
      document.body.classList.add("printing-record");
      button.textContent = "Salvar como PDF...";
      window.print();
      setFeedback("Na janela de impressão, escolha “Salvar como PDF” para baixar esta ficha.");
    } catch (error) {
      cleanup();
      setFeedback(`Não foi possível preparar o PDF: ${error.message}`, true);
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  };

  const renderSavedRecords = async () => {
    try {
      const records = getSavedRecords().sort((first, second) =>
        new Date(second.savedAt || 0).getTime() - new Date(first.savedAt || 0).getTime()
      );
      savedCardImageUrls.forEach(url => URL.revokeObjectURL(url));
      savedCardImageUrls = [];
      savedPrinterList.replaceChildren();
      savedPrinterEmpty.hidden = records.length > 0;
      savedPrinterCount.textContent = `${records.length} ${records.length === 1 ? "registro" : "registros"}`;

      for (const record of records) {
        const card = document.createElement("article");
        card.className = "saved-printer-card";
        card.dataset.recordId = record.id;
        const recordInfo = document.createElement("button");
        recordInfo.className = "saved-printer-info";
        recordInfo.type = "button";
        const name = document.createElement("strong");
        name.textContent = record.name;
        const savedDate = document.createElement("time");
        savedDate.dateTime = record.savedAt || "";
        savedDate.textContent = formatSavedDate(record.savedAt);
        const metadata = document.createElement("span");
        metadata.className = "saved-printer-metadata";
        metadata.textContent = `${record.brand || "Marca não informada"} · ${record.model || "Modelo não informado"}`;
        const procedure = document.createElement("span");
        procedure.className = "saved-printer-procedure";
        procedure.textContent = record.procedure || "Procedimento não informado";
        const selectedProcedures = selectedProcedureEntries(record.procedures);
        const checkedProcedures = document.createElement("span");
        checkedProcedures.className = "saved-printer-procedure-count";
        checkedProcedures.textContent = `${selectedProcedures.length} procedimento(s) marcado(s)`;
        const reset = document.createElement("span");
        reset.className = "saved-printer-reset";
        reset.textContent = `Reset: ${Number(record.reset) || 0}%`;
        recordInfo.append(name, metadata, procedure, checkedProcedures, reset, savedDate);
        recordInfo.addEventListener("click", () => openRecordDetails(record));
        card.appendChild(recordInfo);
        const actions = document.createElement("div");
        actions.className = "saved-printer-actions";
        const editButton = document.createElement("button");
        editButton.className = "saved-printer-edit";
        editButton.type = "button";
        editButton.textContent = "Editar ficha";
        editButton.addEventListener("click", () => startEditingRecord(record));
        const pdfButton = document.createElement("button");
        pdfButton.className = "saved-printer-edit saved-printer-pdf";
        pdfButton.type = "button";
        pdfButton.textContent = "Baixar PDF";
        pdfButton.addEventListener("click", () => downloadRecordPdf(record, pdfButton));
        const deleteButton = document.createElement("button");
        deleteButton.className = "saved-printer-delete";
        deleteButton.type = "button";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", `Excluir ficha de ${record.name}`);
        deleteButton.title = "Excluir ficha";
        deleteButton.addEventListener("click", async () => {
          const password = window.prompt("Digite a senha para excluir esta ficha:");
          if (password === null) return;
          if (password !== "2020") {
            setFeedback("Senha incorreta. A ficha não foi excluída.", true);
            return;
          }
          if (!window.confirm(`Deseja excluir a ficha de ${record.name}? Esta ação não pode ser desfeita.`)) return;

          deleteButton.disabled = true;
          try {
            if (window.icFirebaseSync) await window.icFirebaseSync.deleteRecord(record.id);
            const remainingRecords = getSavedRecords().filter(saved => saved.id !== record.id);
            localStorage.setItem(recordStorageKey, JSON.stringify(remainingRecords));
            if (editingRecordId === record.id) resetEditingState();
            await renderSavedRecords();
            const uploadTypes = ["printer-photo", "test-page", "printer-reset", "machine-cleaning-photo"];
            const cleanupResults = await Promise.allSettled([
              ...uploadTypes.map(type => deleteUpload(`${record.id}:${type}`)),
              deleteUpload(record.id)
            ]);
            const cleanupError = cleanupResults.find(result => result.status === "rejected");
            if (cleanupError) {
              setFeedback(`Ficha excluída, mas não foi possível limpar todas as fotos locais: ${cleanupError.reason.message}`, true);
            } else {
              setFeedback(window.icFirebaseSync
                ? "Ficha excluída deste aparelho e da nuvem."
                : "Ficha excluída deste aparelho.");
            }
          } catch (error) {
            setFeedback(`Não foi possível concluir a exclusão: ${error.message}`, true);
            deleteButton.disabled = false;
          }
        });
        actions.append(editButton, pdfButton, deleteButton);
        card.appendChild(actions);

        try {
          const images = await loadRecordImages(record);
          const photos = document.createElement("div");
          photos.className = "saved-printer-photos";
          [
            { image: images.printerPhoto, label: "Foto da impressora" },
            { image: images.testPage, label: "Foto da página de teste" },
            { image: images.printerReset, label: "Reset da impressora" },
            { image: images.machineCleaningPhoto, label: "Foto da limpeza da máquina" }
          ].forEach(({ image, label }) => {
            if (!image) return;
            const photoButton = document.createElement("button");
            photoButton.className = "saved-printer-photo";
            photoButton.type = "button";
            photoButton.setAttribute("aria-label", `Abrir ${label.toLowerCase()}`);
            const thumbnail = document.createElement("img");
            const url = URL.createObjectURL(image);
            savedCardImageUrls.push(url);
            thumbnail.src = url;
            thumbnail.alt = "";
            const photoLabel = document.createElement("span");
            photoLabel.textContent = label;
            photoButton.append(thumbnail, photoLabel);
            photoButton.addEventListener("click", () => openPhotoViewer(image, label));
            photos.appendChild(photoButton);
          });
          if (photos.childElementCount) card.appendChild(photos);
        } catch (error) {
          setFeedback(`A ficha foi carregada, mas não foi possível exibir suas fotos: ${error.message}`, true);
        }
        savedPrinterList.appendChild(card);
      }
    } catch (error) {
      setFeedback(`Não foi possível carregar as fichas salvas: ${error.message}`, true);
    }
  };

  window.icPrinterRecords = {
    readLocalRecords: getSavedRecords,
    loadRecordImages,
    loadLocalRecordImages,
    importRecord: async (record, images) => {
      const records = getSavedRecords();
      const existingIndex = records.findIndex(saved => saved.id === record.id);
      if (existingIndex >= 0 && !window.confirm("Já existe uma ficha com este código. Deseja substituir a ficha salva?")) {
        return false;
      }

      const importedRecord = { ...record };
      const photoTypes = ["printer-photo", "test-page", "printer-reset", "machine-cleaning-photo"];
      for (const type of photoTypes) {
        if (images[type]) await storeUpload(`${importedRecord.id}:${type}`, images[type]);
        else if (existingIndex >= 0) await deleteUpload(`${importedRecord.id}:${type}`);
      }
      if (existingIndex >= 0) records[existingIndex] = importedRecord;
      else records.push(importedRecord);
      localStorage.setItem(recordStorageKey, JSON.stringify(records));
      await renderSavedRecords();

      if (!window.icFirebaseSync) {
        return { synced: false, error: new Error("A conexão com a nuvem não foi iniciada.") };
      }
      try {
        await window.icFirebaseSync.saveRecord(importedRecord, images, photoTypes);
        return { synced: true };
      } catch (error) {
        return { synced: false, error };
      }
    },
    applyCloudRecords: async cloudRecords => {
      const merged = new Map(getSavedRecords().map(record => [record.id, record]));
      cloudRecords.forEach(record => merged.set(record.id, record));
      localStorage.setItem(recordStorageKey, JSON.stringify([...merged.values()]));
      await renderSavedRecords();
    }
  };

  const importPdfButton = document.getElementById("import-record-pdf");
  const importPdfInput = document.getElementById("import-record-pdf-file");
  if (importPdfButton && importPdfInput) {
    importPdfButton.addEventListener("click", () => importPdfInput.click());
    importPdfInput.addEventListener("change", async () => {
      const file = importPdfInput.files?.[0];
      importPdfInput.value = "";
      if (!file) return;
      importPdfButton.disabled = true;
      const originalLabel = importPdfButton.textContent;
      importPdfButton.textContent = "Importando...";
      try {
        if (file.size > 20 * 1024 * 1024) throw new Error("O PDF deve ter no máximo 20 MB.");
        if (!window.pdfjsLib) throw new Error("O leitor de PDF não carregou. Verifique a conexão e tente novamente.");
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
        if (pdf.numPages > 40) throw new Error("Este PDF tem páginas demais para importar.");
        const pageText = [];
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          pageText.push(content.items.map(item => item.str || "").join(""));
        }
        const text = pageText.join("").replace(/\s+/g, "");
        const match = text.match(/ICFICHEV1BEGIN([A-Za-z0-9+/=]+)ICFICHEV1END/);
        if (!match) {
          throw new Error("Este PDF não contém dados importáveis. Importe um PDF baixado novamente do site após esta atualização.");
        }
        const payload = JSON.parse(decodeTextBase64(match[1]));
        if (payload.format !== "ic-impressoras-record" || payload.version !== 1) {
          throw new Error("A versão dos dados deste PDF não é compatível.");
        }
        const record = payload.record;
        if (!record
          || typeof record.id !== "string"
          || !/^[A-Za-z0-9_-]{1,128}$/.test(record.id)
          || typeof record.name !== "string"
          || !record.name.trim()
          || record.name.length > 200
          || (record.procedure != null && (typeof record.procedure !== "string" || record.procedure.length > 10000))
          || (record.procedures != null
            && (typeof record.procedures !== "object" || Array.isArray(record.procedures)))) {
          throw new Error("O PDF não contém uma ficha válida.");
        }
        record.procedure = record.procedure || "";
        record.procedures = record.procedures || {};
        const allowedPhotoTypes = ["printer-photo", "test-page", "printer-reset", "machine-cleaning-photo"];
        const photoData = payload.photos || {};
        if (typeof photoData !== "object" || Array.isArray(photoData)) {
          throw new Error("O PDF contém dados de fotos inválidos.");
        }
        const images = Object.fromEntries(allowedPhotoTypes.map(type => [type, null]));
        for (const [type, dataUrl] of Object.entries(photoData)) {
          if (!allowedPhotoTypes.includes(type) || typeof dataUrl !== "string" || dataUrl.length > 500000) {
            throw new Error("O PDF contém dados de foto inválidos ou acima do limite.");
          }
          const imageMatch = dataUrl.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/i);
          if (!imageMatch) throw new Error("Uma das fotos do PDF tem formato inválido.");
          const binary = atob(imageMatch[2]);
          const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
          images[type] = new Blob([bytes], { type: `image/${imageMatch[1].toLowerCase()}` });
        }
        const imported = await window.icPrinterRecords.importRecord(record, images);
        if (imported === false) return;
        if (imported.synced) {
          setFeedback("Ficha completa importada, com fotos e procedimentos, e sincronizada.");
        } else {
          setFeedback(`Ficha importada e salva neste aparelho, mas não sincronizada: ${imported.error.message}`, true);
        }
      } catch (error) {
        setFeedback(`Não foi possível importar a ficha: ${error.message}`, true);
      } finally {
        importPdfButton.disabled = false;
        importPdfButton.textContent = originalLabel;
      }
    });
  }

  const openRecordDetails = async record => {
    document.getElementById("detail-printer-name").textContent = record.name || "—";
    document.getElementById("detail-printer-model").textContent = record.model || "—";
    document.getElementById("detail-printer-brand").textContent = record.brand || "—";
    document.getElementById("detail-printer-procedure").textContent = record.procedure || "Não informado";
    renderProcedureDetails(record.procedures);
    document.getElementById("detail-printer-reset").textContent = `${Number(record.reset) || 0}%`;
    document.getElementById("detail-printer-date").textContent = formatSavedDate(record.savedAt);
    const detailTestPage = document.getElementById("detail-test-page");
    const detailTestPageImage = document.getElementById("detail-test-page-image");
    const detailPrinterPhoto = document.getElementById("detail-printer-photo");
    const detailPrinterPhotoImage = document.getElementById("detail-printer-photo-image");
    const detailPrinterReset = document.getElementById("detail-reset-photo");
    const detailPrinterResetImage = document.getElementById("detail-printer-reset-image");
    const detailMachineCleaningPhoto = document.getElementById("detail-machine-cleaning-photo");
    const detailMachineCleaningPhotoImage = document.getElementById("detail-machine-cleaning-photo-image");
    if (detailTestPageUrl) URL.revokeObjectURL(detailTestPageUrl);
    if (detailPrinterPhotoUrl) URL.revokeObjectURL(detailPrinterPhotoUrl);
    if (detailPrinterResetUrl) URL.revokeObjectURL(detailPrinterResetUrl);
    if (detailMachineCleaningPhotoUrl) URL.revokeObjectURL(detailMachineCleaningPhotoUrl);
    detailTestPageUrl = "";
    detailPrinterPhotoUrl = "";
    detailPrinterResetUrl = "";
    detailMachineCleaningPhotoUrl = "";
    detailTestPage.hidden = true;
    detailPrinterPhoto.hidden = true;
    detailPrinterReset.hidden = true;
    detailMachineCleaningPhoto.hidden = true;
    detailsDialog.showModal();
    try {
      const {
        printerPhoto: savedPrinterPhoto,
        testPage: savedTestPage,
        printerReset: savedPrinterReset,
        machineCleaningPhoto: savedMachineCleaningPhoto
      } = await loadRecordImages(record);
      currentDetailPrinterPhoto = savedPrinterPhoto;
      currentDetailTestPage = savedTestPage;
      currentDetailPrinterReset = savedPrinterReset;
      currentDetailMachineCleaningPhoto = savedMachineCleaningPhoto;
      if (savedPrinterPhoto) {
        detailPrinterPhotoUrl = URL.createObjectURL(savedPrinterPhoto);
        detailPrinterPhotoImage.src = detailPrinterPhotoUrl;
        detailPrinterPhoto.hidden = false;
      }
      if (savedTestPage) {
        detailTestPageUrl = URL.createObjectURL(savedTestPage);
        detailTestPageImage.src = detailTestPageUrl;
        detailTestPage.hidden = false;
      }
      if (savedPrinterReset) {
        detailPrinterResetUrl = URL.createObjectURL(savedPrinterReset);
        detailPrinterResetImage.src = detailPrinterResetUrl;
        detailPrinterReset.hidden = false;
      }
      if (savedMachineCleaningPhoto) {
        detailMachineCleaningPhotoUrl = URL.createObjectURL(savedMachineCleaningPhoto);
        detailMachineCleaningPhotoImage.src = detailMachineCleaningPhotoUrl;
        detailMachineCleaningPhoto.hidden = false;
      }
    } catch (error) {
      setFeedback(`A ficha abriu, mas não foi possível carregar uma das imagens: ${error.message}`, true);
    }
  };

  const resetEditingState = () => {
    editingRecordId = null;
    removedImages.clear();
    pendingTestPage = null;
    pendingPrinterPhoto = null;
    pendingPrinterReset = null;
    pendingMachineCleaningPhoto = null;
    HTMLFormElement.prototype.reset.call(printerForm);
    [uploadInput, printerPhotoInput, printerResetInput, machineCleaningPhotoInput].forEach(input => { input.value = ""; });
    showTestPagePreview(null);
    showPrinterPhotoPreview(null);
    showPrinterResetPreview(null);
    showMachineCleaningPhotoPreview(null);
    resetValue.value = "0%";
    modelOtherField.hidden = true;
    modelOtherInput.disabled = true;
    modelOtherInput.required = false;
    [...printerForm.elements.brand.options]
      .filter(option => option.dataset.legacyBrand)
      .forEach(option => option.remove());
    renderProcedureChecklist();
    formTitle.textContent = "Novo atendimento";
    submitButton.textContent = "Salvar procedimento";
    cancelEditButton.hidden = true;
  };

  const startEditingRecord = async record => {
    editingRecordId = record.id;
    removedImages.clear();
    pendingTestPage = null;
    pendingPrinterPhoto = null;
    pendingPrinterReset = null;
    pendingMachineCleaningPhoto = null;
    printerForm.elements.name.value = record.name || "";
    printerForm.elements.procedure.value = record.procedure || "";
    resetInput.value = String(Number(record.reset) || 0);
    resetValue.value = `${resetInput.value}%`;
    const knownModel = [...modelSelect.options].some(option => option.value === record.model);
    modelSelect.value = knownModel ? record.model : "Outro";
    modelOtherField.hidden = knownModel;
    modelOtherInput.disabled = knownModel;
    modelOtherInput.required = !knownModel;
    modelOtherInput.value = knownModel ? "" : record.model || "";
    const brandValue = String(record.brand || "").toUpperCase();
    const knownBrand = supportedBrandValues.has(brandValue);
    if (!knownBrand && brandValue) {
      const legacyBrand = document.createElement("option");
      legacyBrand.value = brandValue;
      legacyBrand.textContent = brandValue;
      legacyBrand.dataset.legacyBrand = "true";
      printerForm.elements.brand.appendChild(legacyBrand);
    }
    printerForm.elements.brand.value = brandValue;
    renderProcedureChecklist(record.procedures);
    formTitle.textContent = "Editar ficha";
    submitButton.textContent = "Salvar alterações";
    cancelEditButton.hidden = false;
    printerForm.querySelector(".data-accordion").open = true;
    printerForm.scrollIntoView({ behavior: "smooth", block: "start" });
    setFeedback("Editando ficha salva. As fotos atuais serão mantidas se não forem alteradas.");
    try {
      const images = await loadRecordImages(record);
      showPrinterPhotoPreview(images.printerPhoto);
      showTestPagePreview(images.testPage);
      showPrinterResetPreview(images.printerReset);
      showMachineCleaningPhotoPreview(images.machineCleaningPhoto);
    } catch (error) {
      setFeedback(`A ficha foi carregada, mas não foi possível exibir as fotos: ${error.message}`, true);
    }
  };

  cancelEditButton.addEventListener("click", resetEditingState);

  document.querySelectorAll("[data-close-details]").forEach(button => {
    button.addEventListener("click", () => detailsDialog.close());
  });
  document.querySelectorAll("#detail-printer-photo-image, #detail-test-page-image, #detail-printer-reset-image, #detail-machine-cleaning-photo-image").forEach(image => {
    image.addEventListener("click", () => {
      const photoDetails = {
        "detail-printer-photo-image": [currentDetailPrinterPhoto, "Foto da impressora"],
        "detail-test-page-image": [currentDetailTestPage, "Foto da página de teste"],
        "detail-printer-reset-image": [currentDetailPrinterReset, "Reset da impressora"],
        "detail-machine-cleaning-photo-image": [currentDetailMachineCleaningPhoto, "Foto da limpeza da máquina"]
      };
      const [photo, title] = photoDetails[image.id];
      if (photo) openPhotoViewer(photo, title);
    });
  });
  detailsDialog.addEventListener("click", event => {
    if (event.target === detailsDialog) detailsDialog.close();
  });
  detailsDialog.addEventListener("close", () => {
    if (detailTestPageUrl) URL.revokeObjectURL(detailTestPageUrl);
    if (detailPrinterPhotoUrl) URL.revokeObjectURL(detailPrinterPhotoUrl);
    if (detailPrinterResetUrl) URL.revokeObjectURL(detailPrinterResetUrl);
    if (detailMachineCleaningPhotoUrl) URL.revokeObjectURL(detailMachineCleaningPhotoUrl);
    detailTestPageUrl = "";
    detailPrinterPhotoUrl = "";
    detailPrinterResetUrl = "";
    detailMachineCleaningPhotoUrl = "";
    currentDetailTestPage = null;
    currentDetailPrinterPhoto = null;
    currentDetailPrinterReset = null;
    currentDetailMachineCleaningPhoto = null;
    document.getElementById("detail-test-page-image").removeAttribute("src");
    document.getElementById("detail-printer-photo-image").removeAttribute("src");
    document.getElementById("detail-printer-reset-image").removeAttribute("src");
    document.getElementById("detail-machine-cleaning-photo-image").removeAttribute("src");
  });
  document.querySelectorAll("[data-close-photo-viewer]").forEach(button => {
    button.addEventListener("click", () => photoViewerDialog.close());
  });
  photoViewerDialog.addEventListener("click", event => {
    if (event.target === photoViewerDialog) photoViewerDialog.close();
  });
  photoViewerDialog.addEventListener("close", () => {
    if (photoViewerUrl) URL.revokeObjectURL(photoViewerUrl);
    photoViewerUrl = "";
    photoViewerImage.removeAttribute("src");
  });

  renderSavedRecords();
  renderProcedureChecklist();
  procedureChecklist.addEventListener("change", updateProcedureProgress);
  printerForm.addEventListener("invalid", event => {
    const dataAccordion = event.target.closest(".data-accordion");
    if (dataAccordion) dataAccordion.open = true;
  }, true);
  printerForm.addEventListener("toggle", event => {
    const accordion = event.target;
    if (accordion.tagName !== "DETAILS" || !accordion.open) return;
    const accordionClass = accordion.classList.contains("form-accordion")
      ? "form-accordion"
      : accordion.classList.contains("procedure-group") ? "procedure-group" : "";
    if (!accordionClass) return;
    [...accordion.parentElement.children].forEach(sibling => {
      if (sibling !== accordion && sibling.classList.contains(accordionClass)) sibling.open = false;
    });
  }, true);
  resetInput.addEventListener("input", () => { resetValue.value = `${resetInput.value}%`; });
  const handleImageUpload = (input, onSelect, onPreview) => {
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      input.value = "";
      setFeedback("Escolha um arquivo de imagem.", true);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      input.value = "";
      setFeedback("A imagem deve ter no máximo 10 MB.", true);
      return;
    }
    onSelect(file);
    onPreview(file);
    setFeedback("Imagem carregada. Salve a ficha para guardar as alterações.");
  };
  uploadInput.addEventListener("change", () => {
    handleImageUpload(uploadInput, file => {
      pendingTestPage = file;
      removedImages.delete("test-page");
    }, showTestPagePreview);
  });
  printerPhotoInput.addEventListener("change", () => {
    handleImageUpload(printerPhotoInput, file => {
      pendingPrinterPhoto = file;
      removedImages.delete("printer-photo");
    }, showPrinterPhotoPreview);
  });
  printerResetInput.addEventListener("change", () => {
    handleImageUpload(printerResetInput, file => {
      pendingPrinterReset = file;
      removedImages.delete("printer-reset");
    }, showPrinterResetPreview);
  });
  machineCleaningPhotoInput.addEventListener("change", () => {
    handleImageUpload(machineCleaningPhotoInput, file => {
      pendingMachineCleaningPhoto = file;
      removedImages.delete("machine-cleaning-photo");
    }, showMachineCleaningPhotoPreview);
  });
  removeImageButton.addEventListener("click", () => {
    pendingTestPage = null;
    uploadInput.value = "";
    if (editingRecordId) removedImages.add("test-page");
    showTestPagePreview(null);
    setFeedback(editingRecordId ? "Imagem será removida ao salvar as alterações." : "Imagem removida da nova ficha.");
  });
  removePrinterPhotoButton.addEventListener("click", () => {
    pendingPrinterPhoto = null;
    printerPhotoInput.value = "";
    if (editingRecordId) removedImages.add("printer-photo");
    showPrinterPhotoPreview(null);
    setFeedback(editingRecordId ? "Foto será removida ao salvar as alterações." : "Foto da impressora removida da nova ficha.");
  });
  removePrinterResetButton.addEventListener("click", () => {
    pendingPrinterReset = null;
    printerResetInput.value = "";
    if (editingRecordId) removedImages.add("printer-reset");
    showPrinterResetPreview(null);
    setFeedback(editingRecordId ? "Foto será removida ao salvar as alterações." : "Foto do reset removida da nova ficha.");
  });
  removeMachineCleaningPhotoButton.addEventListener("click", () => {
    pendingMachineCleaningPhoto = null;
    machineCleaningPhotoInput.value = "";
    if (editingRecordId) removedImages.add("machine-cleaning-photo");
    showMachineCleaningPhotoPreview(null);
    setFeedback(editingRecordId ? "Foto da limpeza será removida ao salvar as alterações." : "Foto da limpeza removida da nova ficha.");
  });
  printerForm.addEventListener("submit", async event => {
    event.preventDefault();
    let records;
    try {
      records = getSavedRecords();
    } catch (error) {
      setFeedback(`Não foi possível acessar as fichas salvas: ${error.message}`, true);
      return;
    }
    const existingRecord = editingRecordId ? records.find(saved => saved.id === editingRecordId) : null;
    if (editingRecordId && !existingRecord) {
      setFeedback("A ficha que você está editando não foi encontrada no histórico.", true);
      return;
    }
    const record = {
      ...existingRecord,
      id: existingRecord?.id || `printer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: printerForm.elements.name.value.trim(),
      model: modelSelect.value === "Outro" ? modelOtherInput.value.trim() : modelSelect.value,
      brand: printerForm.elements.brand.value.trim(),
      procedure: printerForm.elements.procedure.value.trim(),
      procedures: getProcedureSelections(),
      reset: Number(resetInput.value),
      savedAt: new Date().toISOString()
    };

    const uploads = [
      ["printer-photo", pendingPrinterPhoto],
      ["test-page", pendingTestPage],
      ["printer-reset", pendingPrinterReset],
      ["machine-cleaning-photo", pendingMachineCleaningPhoto]
    ];
    try {
      for (const [type, image] of uploads) {
        if (image) await storeUpload(`${record.id}:${type}`, image);
      }
    } catch (error) {
      setFeedback(`Não foi possível salvar uma imagem: ${error.message}`, true);
      return;
    }

    try {
      const recordIndex = records.findIndex(saved => saved.id === record.id);
      if (recordIndex >= 0) records[recordIndex] = record;
      else records.push(record);
      localStorage.setItem(recordStorageKey, JSON.stringify(records));
    } catch (error) {
      setFeedback(`Não foi possível salvar os dados da ficha: ${error.message}`, true);
      return;
    }
    try {
      if (removedImages.has("printer-photo")) await deleteUpload(`${record.id}:printer-photo`);
      if (removedImages.has("printer-reset")) await deleteUpload(`${record.id}:printer-reset`);
      if (removedImages.has("machine-cleaning-photo")) await deleteUpload(`${record.id}:machine-cleaning-photo`);
      if (removedImages.has("test-page")) {
        await deleteUpload(`${record.id}:test-page`);
        await deleteUpload(record.id);
        if (record.legacyTestPage) await deleteUpload("test-page");
        record.legacyTestPage = false;
        const savedRecords = getSavedRecords();
        const savedRecordIndex = savedRecords.findIndex(saved => saved.id === record.id);
        if (savedRecordIndex >= 0) {
          savedRecords[savedRecordIndex] = record;
          localStorage.setItem(recordStorageKey, JSON.stringify(savedRecords));
        }
      }
    } catch (error) {
      setFeedback(`Ficha salva, mas não foi possível remover uma imagem: ${error.message}`, true);
      return;
    }
    const removedImagesToSync = [...removedImages];
    if (!window.icFirebaseSync) {
      renderSavedRecords();
      resetEditingState();
      setFeedback("Ficha salva neste aparelho, mas a conexão segura com a nuvem não foi iniciada.", true);
      return;
    }
    try {
      const images = await loadLocalRecordImages(record);
      await window.icFirebaseSync.saveRecord(record, images, removedImagesToSync);
    } catch (error) {
      renderSavedRecords();
      resetEditingState();
      setFeedback(`Ficha salva neste aparelho, mas não sincronizou: ${error.message}`, true);
      return;
    }
    renderSavedRecords();
    resetEditingState();
    setFeedback(existingRecord
      ? "Ficha atualizada e sincronizada com os outros celulares."
      : "Procedimento salvo e sincronizado com os outros celulares.");
  });
}

const secureLoginDialog = document.getElementById("secure-login-dialog");
if (secureLoginDialog) {
  document.querySelector("[data-secure-admin-login]")?.addEventListener("click", () => {
    secureLoginDialog.showModal();
    document.getElementById("email")?.focus();
  });
  document.querySelector("[data-secure-admin-close]")?.addEventListener("click", () => secureLoginDialog.close());
  secureLoginDialog.addEventListener("click", event => {
    if (event.target === secureLoginDialog) secureLoginDialog.close();
  });
}

const form = document.getElementById("auth-form");
if (form) {
  const developerPasswordHash = "d057fe2a31b78744ef93af10301d74ab351286a8cc9d18fd60441a402ac8d6fd";
  const passwordHash = async value => {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
  };
  let signup = false;
  const toggle = document.getElementById("auth-switch");
  const title = document.getElementById("auth-title");
  const submit = document.getElementById("auth-submit");
  const fields = document.getElementById("signup-fields");
  const message = document.getElementById("auth-message");
  toggle?.addEventListener("click", () => {
    signup = !signup;
    title.textContent = submit.textContent = signup ? "Criar conta" : "Entrar";
    fields.hidden = !signup;
    fields?.querySelectorAll("input").forEach(input => { input.required = signup; input.disabled = !signup; });
    document.getElementById("password").autocomplete = signup ? "new-password" : "current-password";
    toggle.textContent = signup ? "Já tem conta? Entrar" : "Não tem conta? Criar conta";
    message.textContent = "";
  });
  fields?.querySelectorAll("input").forEach(input => { input.disabled = true; });
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  try {
    emailInput.value = localStorage.getItem("topcell-login-email") || "";
    passwordInput.value = localStorage.getItem("topcell-login-password") || "";
    document.getElementById("remember-login").checked =
      localStorage.getItem("topcell-save-login") === "true";
  } catch {}

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (signup) {
      message.textContent = "A criação de contas está disponível apenas para contas autorizadas.";
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    if (email !== "ssllfelipe@gmail.com" || await passwordHash(password) !== developerPasswordHash) {
      message.textContent = "E-mail ou senha incorretos.";
      message.style.color = "#ff8b91";
      return;
    }

    const finishLogin = shouldRemember => {
      try {
        localStorage.setItem("topcell-save-login", String(shouldRemember));
        if (shouldRemember) {
          localStorage.setItem("topcell-login-email", email);
          localStorage.setItem("topcell-login-password", password);
        } else {
          localStorage.removeItem("topcell-login-email");
          localStorage.removeItem("topcell-login-password");
        }
      } catch {}
      sessionStorage.setItem("topcell-developer-session", "authorized");
      window.location.href = "developer.html";
    };

    if (document.getElementById("remember-login").checked) finishLogin(true);
    else {
      const dialog = document.getElementById("save-login-dialog");
      dialog.showModal();
      document.getElementById("save-login-yes").onclick = () => { dialog.close(); finishLogin(true); };
      document.getElementById("save-login-no").onclick = () => { dialog.close(); finishLogin(false); };
    }
  });
}

const googleButton = document.getElementById("google-signin-button");
if (googleButton) {
  const clientId = document.querySelector('meta[name="google-signin-client_id"]')?.content?.trim();
  const googleMessage = document.getElementById("google-auth-message");
  let googleInitialized = false;

  window.handleGoogleCredential = response => {
    try {
      if (!response?.credential) throw new Error("Credencial não recebida.");

      const base64 = response.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      if (String(payload.email || "").toLowerCase() !== "ssllfelipe@gmail.com") {
        googleMessage.textContent = "Esta conta Google não está autorizada.";
        return;
      }
      sessionStorage.setItem("topcell-developer-session", "authorized");
      window.location.href = "developer.html";
    } catch {
      googleMessage.textContent = "Não foi possível validar o login do Google.";
    }
  };

  const initializeGoogleLogin = () => {
    if (googleInitialized || !window.google?.accounts?.id) return;
    if (!clientId) {
      googleMessage.textContent = "O login do Google não está configurado.";
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: window.handleGoogleCredential,
        ux_mode: "popup",
        context: "signin"
      });
      google.accounts.id.renderButton(googleButton, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: googleButton.offsetWidth || 320
      });
      googleInitialized = true;
    } catch {
      googleMessage.textContent = "O Google bloqueou esta origem. Acesse por HTTPS autorizado ou localhost.";
    }
  };

  window.addEventListener("load", () => {
    if (window.google?.accounts?.id) initializeGoogleLogin();
    else window.setTimeout(() => {
      if (window.google?.accounts?.id) initializeGoogleLogin();
      else googleMessage.textContent = "Não foi possível carregar o login do Google.";
    }, 2500);
  });
}
