import { CONFIG } from "./config.js";
import { runAnalysis } from "./api.js";
import {
  clearAlert,
  extractMeta,
  getFormValues,
  renderReport,
  setDefaultValues,
  setLoading,
  showAlert,
  showToast,
  updateBadges,
  updateChart,
  updateMappingStatus,
  updateRecommendations,
  updateRiskList,
  updateStatusText,
} from "./ui.js";

const datasetState = {
  files: [],
  parsed: {},
  mapping: {},
  mode: "sample",
};

const dataSourceKeys = [
  "catalog",
  "reviews",
  "pricing",
  "competitors",
  "performance_signals",
];

const REQUIRED_HEADERS = {
  catalog: ["sku", "category", "price"],
  reviews: ["sku", "rating", "text"],
  pricing: ["sku", "our_price", "competitor_price"],
  competitors: ["competitor", "sku", "features"],
  performance_signals: ["sku", "views", "conversions"],
};

const COLUMN_ALIASES = {
  catalog: {
    sku: ["sku", "product_id", "ProductId", "StockCode", "id"],
    category: ["category", "Category", "categories"],
    price: ["price", "UnitPrice", "actual_price", "discounted_price", "Unit_Price_INR"],
    stock: ["stock", "Quantity"],
    features: ["features", "about_product", "Description"],
  },
  reviews: {
    sku: ["sku", "product_id", "ProductId", "asin", "asins"],
    rating: ["rating", "Score", "reviews.rating"],
    text: ["text", "review_text", "review_content", "Text", "reviews.text", "Summary"],
  },
  pricing: {
    sku: ["sku", "product_id", "ProductId"],
    our_price: ["our_price", "discounted_price", "UnitPrice", "Unit_Price_INR"],
    competitor_price: ["competitor_price", "actual_price", "UnitPrice", "Unit_Price_INR"],
    competitor: ["competitor", "merchant", "seller"],
    tier: ["tier"],
  },
  competitors: {
    competitor: ["competitor", "brand", "manufacturer"],
    sku: ["sku", "competitor_sku", "product_id", "ProductId"],
    features: ["features", "about_product", "Description"],
    price: ["price", "UnitPrice", "actual_price", "discounted_price"],
  },
  performance_signals: {
    sku: ["sku", "product_id", "ProductId", "StockCode"],
    views: ["views", "product_views_per_day", "sessions"],
    conversions: ["conversions", "purchase_conversion_rate", "Quantity"],
    returns: ["returns", "return_rate"],
  },
};

const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const runBtn = document.getElementById("runBtn");
const demoBtn = document.getElementById("demoBtn");
const uploadField = document.getElementById("uploadField");
const mappingPanel = document.getElementById("mappingPanel");
const dataModeInputs = document.querySelectorAll("input[name='dataMode']");

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    rows.push(row);
  }

  return rows;
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function addFileCard(file) {
  const wrapper = document.createElement("div");
  wrapper.className = "file-card";

  const name = document.createElement("div");
  name.textContent = file.name;

  const warning = document.createElement("div");
  warning.className = "file-warning";

  const select = document.createElement("select");
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Map dataset";
  select.appendChild(defaultOption);

  dataSourceKeys.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key.replace(/_/g, " ");
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    datasetState.mapping[select.value] = file.name;
    updateMappingStatus(datasetState.mapping);
    normalizeAndValidate(select.value, file.name, warning);
  });

  wrapper.appendChild(name);
  wrapper.appendChild(warning);
  wrapper.appendChild(select);
  fileList.appendChild(wrapper);
}

async function handleFiles(files) {
  if (datasetState.mode !== "upload") {
    return;
  }
  datasetState.files = Array.from(files);
  datasetState.parsed = {};
  datasetState.mapping = {};
  fileList.innerHTML = "";

  for (const file of datasetState.files) {
    addFileCard(file);
    const text = await file.text();
    datasetState.parsed[file.name] = parseCsv(text);
  }

  updateMappingStatus(datasetState.mapping);
}

function validateMappingSchema(mappedKey, fileName, warningEl) {
  if (!mappedKey || !fileName) {
    warningEl.textContent = "";
    return;
  }

  const rows = datasetState.parsed[fileName] || [];
  if (rows.length === 0) {
    warningEl.textContent = "File has no rows to validate.";
    return;
  }

  const headers = Object.keys(rows[0]);
  const required = REQUIRED_HEADERS[mappedKey] || [];
  const missing = required.filter((col) => !headers.includes(col));

  if (missing.length > 0) {
    warningEl.textContent = `Missing columns for ${mappedKey}: ${missing.join(", ")}`;
  } else {
    warningEl.textContent = "";
  }
}

function normalizeAndValidate(mappedKey, fileName, warningEl) {
  const rows = datasetState.parsed[fileName] || [];
  if (!rows.length) {
    validateMappingSchema(mappedKey, fileName, warningEl);
    return;
  }

  const normalized = normalizeRows(rows, mappedKey);
  datasetState.parsed[fileName] = normalized;
  validateMappingSchema(mappedKey, fileName, warningEl);
}

function normalizeRows(rows, mappedKey) {
  const aliases = COLUMN_ALIASES[mappedKey] || {};
  if (!Object.keys(aliases).length) {
    return rows;
  }

  return rows.map((row) => {
    const normalized = { ...row };
    Object.entries(aliases).forEach(([target, candidates]) => {
      if (normalized[target] !== undefined) {
        return;
      }
      const match = candidates.find((candidate) => row[candidate] !== undefined);
      if (match) {
        normalized[target] = row[match];
      }
    });
    return normalized;
  });
}

function buildDataSources() {
  if (datasetState.mode === "sample") {
    return { ...CONFIG.DEFAULT_SOURCES };
  }

  const dataSources = {};

  dataSourceKeys.forEach((key) => {
    const mappedFile = datasetState.mapping[key];
    if (mappedFile) {
      dataSources[key] = datasetState.parsed[mappedFile] || [];
    } else {
      dataSources[key] = CONFIG.DEFAULT_SOURCES[key];
    }
  });

  return dataSources;
}

function validateInputs(values, dataSources) {
  clearFieldErrors();
  const errors = [];

  if (!values.mode) {
    setFieldError("mode", "modeError", "Select a mode.");
    errors.push("Mode is required.");
  }

  if (!values.goal) {
    setFieldError("goal", "goalError", "Select a business goal.");
    errors.push("Business goal is required.");
  }

  if (!values.scopeValue) {
    setFieldError("scopeValue", "scopeValueError", "Scope value is required.");
    errors.push("Scope value is required (SKU or Category). ");
  }

  if (!values.apiBaseUrl) {
    setFieldError("apiBaseUrl", "apiBaseUrlError", "API base URL is required.");
    errors.push("API base URL is required.");
  }

  if (datasetState.mode === "upload") {
    const missingSources = dataSourceKeys.filter((key) => dataSources[key] === undefined);
    if (missingSources.length > 0) {
      errors.push(`Missing data sources: ${missingSources.join(", ")}.`);
    }

    const emptySources = dataSourceKeys.filter((key) => Array.isArray(dataSources[key]) && dataSources[key].length === 0);
    if (emptySources.length > 0) {
      errors.push(`Uploaded datasets are empty: ${emptySources.join(", ")}.`);
    }
  }

  if (errors.length > 0) {
    showAlert(errors.join(" "));
    return false;
  }

  return true;
}

function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) {
    input.classList.add("input-error");
  }
  if (error) {
    error.textContent = message;
  }
}

function clearFieldErrors() {
  const fields = [
    { input: "mode", error: "modeError" },
    { input: "goal", error: "goalError" },
    { input: "scopeValue", error: "scopeValueError" },
    { input: "apiBaseUrl", error: "apiBaseUrlError" },
  ];

  fields.forEach(({ input, error }) => {
    const inputEl = document.getElementById(input);
    const errorEl = document.getElementById(error);
    if (inputEl) {
      inputEl.classList.remove("input-error");
    }
    if (errorEl) {
      errorEl.textContent = "";
    }
  });
}

async function run() {
  clearAlert();
  updateStatusText("Running analysis...");
  setLoading(true);

  const values = getFormValues();
  const dataSources = buildDataSources();

  if (!validateInputs(values, dataSources)) {
    setLoading(false);
    updateStatusText("Fix issues and retry.");
    return;
  }

  const payload = {
    brief: {
      mode: values.mode,
      business_goal: values.goal,
      marketplaces: values.marketplace ? [values.marketplace] : [],
      region: values.region || "Unknown",
      timeframe: values.timeframe || "Unspecified",
      scope: {
        type: values.scopeType,
        value: values.scopeValue,
      },
      constraints: values.constraints,
      data_sources: dataSources,
    },
    update_memory: true,
  };

  try {
    const response = await runAnalysis(payload);
    renderReport(response.report);

    const meta = extractMeta(response.report);
    updateBadges(meta);
    updateChart(meta.confidence ?? 0);
    updateRiskList(response.report);
    updateRecommendations(response.report);

    updateStatusText("Report ready.");
    showToast("Report loaded successfully.");
  } catch (error) {
    showAlert(error.message);
    updateStatusText("Failed to run analysis.");
  } finally {
    setLoading(false);
  }
}

async function init() {
  setDefaultValues();
  updateMappingStatus(datasetState.mapping);
  setDataMode(getSelectedDataMode());
}

function getSelectedDataMode() {
  const selected = Array.from(dataModeInputs).find((input) => input.checked);
  return selected ? selected.value : "sample";
}

function setDataMode(mode) {
  datasetState.mode = mode;
  const showUploads = mode === "upload";
  uploadField.classList.toggle("hidden", !showUploads);
  fileList.classList.toggle("hidden", !showUploads);
  mappingPanel.classList.toggle("hidden", !showUploads);

  if (!showUploads) {
    datasetState.mapping = {};
    updateMappingStatus(datasetState.mapping);
  }
}

fileInput.addEventListener("change", (event) => handleFiles(event.target.files));
runBtn.addEventListener("click", run);
demoBtn.addEventListener("click", () => {
  setDefaultValues();
  updateStatusText("Demo values loaded.");
});
dataModeInputs.forEach((input) => {
  input.addEventListener("change", () => setDataMode(getSelectedDataMode()));
});

document.getElementById("startTourBtn").addEventListener("click", () => {
  const dashboardSection = document.querySelector(".grid");
  dashboardSection.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => setDefaultValues(), 600);
});

init();
