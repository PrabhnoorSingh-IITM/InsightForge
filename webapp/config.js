// ====================================
// INSIGHTFORGE CONFIGURATION
// ====================================

// Environment detection
// Railway production API is currently offline/404, default forcing the live traffic to the localhost Python uvicorn instance
const apiBaseUrl = "https://stale-kiwis-knock.loca.lt";

const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

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
