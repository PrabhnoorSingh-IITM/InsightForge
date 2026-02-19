import { CONFIG } from "./config.js";

let confidenceChart = null;

export function setHealthStatus(isOk) {
  const badge = document.getElementById("healthBadge");
  badge.textContent = isOk ? "API: online" : "API: offline";
  badge.className = `badge ${isOk ? "badge-good" : "badge-bad"}`;
}

export function setAuthStatus(isRequired) {
  const badge = document.getElementById("authBadge");
  badge.textContent = isRequired ? "Auth: required" : "Auth: open";
  badge.className = `badge ${isRequired ? "badge-warn" : "badge-good"}`;
}

export function setLoading(isLoading) {
  const button = document.getElementById("runBtn");
  button.disabled = isLoading;
  if (isLoading) {
    button.classList.add("loading");
  } else {
    button.classList.remove("loading");
  }
}

export function showAlert(message) {
  const alert = document.getElementById("alert");
  alert.textContent = message;
  alert.classList.remove("hidden");
}

export function clearAlert() {
  const alert = document.getElementById("alert");
  alert.textContent = "";
  alert.classList.add("hidden");
}

export function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2400);
}

export function updateStatusText(text) {
  document.getElementById("runStatus").textContent = text;
}

export function updateMappingStatus(mapping) {
  const mappingLabels = {
    catalog: "mapCatalog",
    reviews: "mapReviews",
    pricing: "mapPricing",
    competitors: "mapCompetitors",
    performance_signals: "mapPerformance",
  };

  Object.entries(mappingLabels).forEach(([key, elementId]) => {
    const element = document.getElementById(elementId);
    if (mapping[key]) {
      element.textContent = "Mapped";
      element.style.color = "#58d1a3";
    } else {
      element.textContent = "Not mapped";
      element.style.color = "#aab6d8";
    }
  });
}

export function renderReport(reportMarkdown) {
  const reportEl = document.getElementById("report");
  reportEl.innerHTML = window.marked.parse(reportMarkdown || "");
}

export function extractMeta(report) {
  const confidenceMatch = report.match(/Confidence Score:\s*(\d+)%/i);
  const completenessMatch = report.match(/Data Completeness(?: Assessment)?:\s*([A-Za-z]+)(?:\s*\((\d+)%\))?/i);

  const confidence = confidenceMatch ? Number(confidenceMatch[1]) : null;
  const completenessLabel = completenessMatch ? completenessMatch[1] : null;
  const completenessScore = completenessMatch && completenessMatch[2] ? Number(completenessMatch[2]) : null;

  return { confidence, completenessLabel, completenessScore };
}

export function updateBadges(meta) {
  const confidenceBadge = document.getElementById("confidenceBadge");
  const completenessBadge = document.getElementById("completenessBadge");

  if (meta.confidence !== null) {
    const { label, className } = scoreToBadge(meta.confidence);
    confidenceBadge.textContent = `Confidence: ${meta.confidence}% (${label})`;
    confidenceBadge.className = `badge ${className}`;
  }

  if (meta.completenessLabel) {
    completenessBadge.textContent = meta.completenessScore
      ? `Completeness: ${meta.completenessLabel} (${meta.completenessScore}%)`
      : `Completeness: ${meta.completenessLabel}`;
    completenessBadge.className = "badge badge-muted";
  }
}

export function updateRiskList(report) {
  const riskList = document.getElementById("riskList");
  const risks = extractSection(report, "Risk Flags");
  renderList(riskList, risks.length ? risks : ["No explicit risk flags found."]);
}

export function updateRecommendations(report) {
  const recList = document.getElementById("recommendations");
  const recs = extractSection(report, "Strategic Recommendations");
  renderList(recList, recs.length ? recs : ["No recommendations extracted."]);
}

export function updateChart(confidence) {
  const canvas = document.getElementById("confidenceChart");
  if (!window.Chart) {
    return;
  }

  const dataValue = confidence ?? 0;
  const remaining = 100 - dataValue;
  const chartData = {
    labels: ["Confidence", "Remaining"],
    datasets: [
      {
        data: [dataValue, remaining],
        backgroundColor: ["#5da3ff", "rgba(255,255,255,0.12)"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  if (confidenceChart) {
    confidenceChart.destroy();
  }

  confidenceChart = new window.Chart(canvas, {
    type: "doughnut",
    data: chartData,
    options: {
      plugins: { legend: { display: false } },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

export function getFormValues() {
  return {
    mode: document.getElementById("mode").value,
    goal: document.getElementById("goal").value,
    scopeType: document.getElementById("scopeType").value,
    scopeValue: document.getElementById("scopeValue").value.trim(),
    apiBaseUrl: document.getElementById("apiBaseUrl").value.trim() || CONFIG.API_BASE_URL,
    apiKey: document.getElementById("apiKey").value.trim(),
    constraints: Array.from(document.querySelectorAll(".constraint:checked")).map((input) => input.value),
  };
}

export function setDefaultValues() {
  document.getElementById("apiBaseUrl").value = CONFIG.API_BASE_URL;
}

export function scoreToBadge(score) {
  if (score >= 75) {
    return { label: "High", className: "badge-good" };
  }
  if (score >= 50) {
    return { label: "Medium", className: "badge-warn" };
  }
  return { label: "Low", className: "badge-bad" };
}

function extractSection(report, sectionTitle) {
  const pattern = new RegExp(`${sectionTitle}\\n([\\s\\S]*?)(?:\\n##|$)`, "i");
  const match = report.match(pattern);
  if (!match) {
    return [];
  }

  return match[1]
    .split("\n")
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter((line) => line && !line.startsWith("#"));
}

function renderList(element, items) {
  element.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}
