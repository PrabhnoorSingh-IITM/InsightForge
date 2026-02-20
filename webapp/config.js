// ====================================
// INSIGHTFORGE CONFIGURATION
// ====================================

// Environment detection
const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// API Base URL
// If running locally, assume the backend is on port 8000 and frontend is 5500/8000
const apiBaseUrl = isDevelopment
  ? "http://127.0.0.1:8000"
  : "https://geekroomhackathon.up.railway.app";

export const CONFIG = {
  // API Configuration
  API_BASE_URL: apiBaseUrl,
  API_TIMEOUT: 30000,
  MAX_RETRIES: 2,

  // Environment
  isDevelopment,
  isProduction: !isDevelopment,

  // Feature Flags
  USE_MOCK_DATA_FALLBACK: true,
  ENABLE_LOGGING: true,

  // Default Values
  DEFAULT_BRIEF: {
    mode: "quick",
    businessGoal: "growth",
    scopeType: "SKU",
    scopeValue: "SKU-472",
    marketplace: "Amazon",
    region: "India",
    timeframe: "Last 30 days",
  },

  DEFAULT_SOURCES: {
    catalog: "catalog.json",
    reviews: "reviews.json",
    pricing: "pricing.json",
    competitors: "competitors.json",
    performance_signals: "performance_signals.json",
  },
};

// Log configuration on load
if (CONFIG.ENABLE_LOGGING) {
  console.log("%c⚙️  InsightForge Configured", "color: #41b883; font-weight: bold;");
  console.log(`Environment: ${CONFIG.isDevelopment ? "Development" : "Production"}`);
  console.log(`API: ${CONFIG.API_BASE_URL}`);
}
