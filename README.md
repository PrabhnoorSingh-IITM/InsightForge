# E-Commerce Intelligence Research Agent

From catalogs to business decisions.

## Quick Answers

- API key needed? **Only if you enable it** using `ECOM_AGENT_API_KEY`.
- Firebase needed for hosting? **No**. Deploy the FastAPI backend directly.
- Can it be assessed from just website? **No** (website removed). Use API endpoints and generated reports.

This project delivers a production-style research workflow for E-Commerce teams with:

- Quick Mode (<2 min): fast, high-signal insights
- Deep Mode (<10 min): structured strategic research with confidence and uncertainty
- Domain-aware memory for KPI, marketplace, and category personalization
- Interactive-safe behavior with clarification prompts when brief context is missing

## Core Files

- Agent prompt: `prompts/ecommerce_research_agent_prompt.md`
- Research engine (report generation): `src/research_agent.py`
- Prompt builder (optional): `src/build_research_prompt.py`
- Persistent memory: `data/domain_memory.json`
- Output templates:
  - `templates/quick_mode_output.md`
  - `templates/deep_mode_output.md`
- Sample datasets: `examples/datasets/*.json`
- Sample briefs:
  - `examples/brief_quick_underperforming.json`
  - `examples/brief_deep_gap_analysis.json`
  - `examples/brief_next_category.json`

## What the Agent Analyzes

- Product catalog
- Customer reviews and ratings
- Pricing matches
- Competitor listings
- Performance signals

## Research Brief Schema (`--brief`)

Required:

- `mode`: `quick` or `deep`
- `business_goal`: `growth`, `retention`, `profitability`, `market expansion`
- `scope`:
  - `marketplaces`: list
  - `category_or_product`: string
  - `region`: string
  - `timeframe`: string
- `data_sources`:
  - `catalog`, `reviews`, `pricing`, `competitors`, `performance_signals`
  - each source supports `{ "path": "relative/or/absolute/path.json|csv" }` or inline list data

Optional:

- `query`
- `query_type` (supports `next_category`)
- `kpi_priority`
- `constraints` (e.g. negative reviews only, premium competitors only, optimize margins)
- `analysis_theme`

## Run the Agent

From the workspace root:

### Quick Mode: Underperformance Diagnosis

```bash
python3 src/research_agent.py \
  --brief examples/brief_quick_underperforming.json \
  --output out/quick_report.md \
  --update-memory
```

### Deep Mode: Competitive Gap Analysis

```bash
python3 src/research_agent.py \
  --brief examples/brief_deep_gap_analysis.json \
  --output out/deep_report.md \
  --update-memory
```

### Deep Mode: Next Category Recommendation from Memory

```bash
python3 src/research_agent.py \
  --brief examples/brief_next_category.json \
  --output out/next_category_report.md \
  --update-memory
```

## Run as API (FastAPI)

Install dependencies:

```bash
pip install -r requirements.txt
```

Start server:

```bash
uvicorn api.main:app --reload
```

Enable API key auth (recommended for public deployment):

```bash
export ECOM_AGENT_API_KEY="your-strong-key"
uvicorn api.main:app --reload
```

Endpoints:

- `GET /health`
- `GET /auth-status`
- `POST /analyze`

Swagger docs:

- `http://127.0.0.1:8000/docs`

Minimal `POST /analyze` payload:

```json
{
  "brief": {
    "mode": "quick",
    "business_goal": "profitability",
    "scope": {
      "marketplaces": ["Amazon"],
      "category_or_product": "Bluetooth Earbuds",
      "region": "India",
      "timeframe": "Last 30 days"
    },
    "data_sources": {
      "catalog": { "path": "datasets/catalog.json" },
      "reviews": { "path": "datasets/reviews.json" },
      "pricing": { "path": "datasets/pricing.json" },
      "competitors": { "path": "datasets/competitors.json" },
      "performance_signals": { "path": "datasets/performance_signals.json" }
    }
  },
  "source_base_dir": "examples",
  "output_path": "out/api_report.md",
  "update_memory": true
}
```

## Easy Hosting

### Docker

```bash
docker build -t ecommerce-intel-agent .
docker run -p 8000:8000 ecommerce-intel-agent
```

### Cloud (Render/Railway/Fly.io)

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
- Health check: `/health`

Deployment manifests included:

- `render.yaml`
- `railway.json`
- `.env.example`

## Output Guarantees

### Quick Mode

- Bullet Insights
- Key Metrics
- Immediate Recommendations
- Clear “What should the business do next — and why?” action

### Deep Mode

- Executive Summary
- Key Findings
- Supporting Evidence
- Competitive Insights
- Risks & Opportunities
- Strategic Recommendations
- Confidence Level
  - Confidence Score (0–100)
  - Data Completeness Assessment
  - Risk Flags

## Production Behavior

- Missing/noisy data detection with explicit risk flags
- Confidence scoring weighted by data completeness and evidence volume
- Deep mode partial downgrade when completeness is low
- Memory updates for KPI and marketplace personalization
- Clarification questions when key brief fields are ambiguous

## Optional Prompt-Only Flow

If you need prompt generation instead of report generation:

```bash
python3 src/build_research_prompt.py \
  --request examples/request_deep.json \
  --output out/deep_prompt.txt \
  --update-memory
```
