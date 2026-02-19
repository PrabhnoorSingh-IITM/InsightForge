# Workflow

## 1) Input Brief
Team submits a structured brief:
- Mode: quick/deep
- Business goal: growth/retention/profitability/market expansion
- Scope: marketplaces, category, region, timeframe
- Data sources: catalog, reviews, pricing, competitors, performance
- Constraints: e.g. negative reviews only, premium competitors only

## 2) Data Ingestion
Agent loads JSON/CSV sources and normalizes records.

## 3) Reliability Checks
- Data completeness score
- Noise detection (missing ratings, invalid prices, incomplete performance fields)
- Risk flag generation

## 4) Multi-Source Reasoning
Agent correlates:
- Complaint themes ↔ conversion and returns
- Price gaps ↔ competitive pressure
- Feature gaps ↔ opportunity to win share
- KPI priorities ↔ recommendation ranking

## 5) Memory Personalization
Agent applies persistent memory:
- Preferred KPIs
- Preferred marketplaces
- Historical categories/themes

## 6) Structured Output
- Quick Mode: concise metrics + immediate actions
- Deep Mode: executive summary, evidence, risks/opportunities, recommendations, confidence

## 7) Action Loop
Teams run follow-ups:
- Optimize for margins
- Focus on negative reviews
- Premium competitor comparison
- Next category to explore

## 8) Access Layer
- Webapp console submits requests to `/analyze` for non-technical users.
- Developers can call `/analyze` directly with structured briefs.
- Health and auth are available via `/health` and `/auth-status`.
- Optional API key is passed in `x-api-key` when auth is enabled.
