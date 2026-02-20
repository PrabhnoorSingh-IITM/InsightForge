// Environment detection
const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const apiBaseUrl = isDevelopment 
  ? "http://127.0.0.1:8000"
  : "https://insightforge-api.onrender.com";  // Update this with your deployed backend URL

export const CONFIG = {
  API_BASE_URL: apiBaseUrl,
  isDevelopment,
  DEFAULT_BRIEF: {
    mode: "quick",
    businessGoal: "profitability",
    scopeType: "Category",
    scopeValue: "Bluetooth Earbuds",
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
