# InsightForge – E-Commerce Intelligence Research Agent

**From Catalogs to Business Decisions**

Decision-ready research for e-commerce teams. Analyze product catalogs, customer reviews, pricing data, and competitor listings to generate actionable business insights.

Built for product managers, growth teams, and category owners. Give it a brief, upload data or use samples, and get a structured report you can actually act on. Quick mode delivers answers in seconds; deep mode provides comprehensive strategy in minutes.

## Why this matters

E-commerce teams often sit on fragmented data. This agent turns that into a clear report, and calls out when the data is thin so you know what to trust and what to re-check.

If you want to see it work, run the CLI quickstart first. The API and web UI are the same flow with a more product-like wrapper.

## Features

- **Quick mode** (<2 min) for fast answers
- **Deep mode** (<10 min) when you want strategy
- **Actionable recommendations** grounded in evidence and confidence
- **Data completeness checks** and noise flags
- **Persistent memory** so reports improve over time
- **Production-ready**: rate limiting, structured logging, schema validation, error handling
- **API-first** with FastAPI + OpenAPI documentation
- **Web UI** for non-technical users with demo data

## Project Structure

- Research engine: `src/research_agent.py`
- API with safety features: `api/main.py`, `api/rate_limiter.py`, `api/logger.py`, `api/validators.py`
- Web UI: `webapp/`
- Prompt builder (optional): `src/build_research_prompt.py`
- Memory store: `data/domain_memory.json`
- Output templates: `templates/`
- Sample briefs: `examples/`
- Processed datasets: `datasets/processed/`
- Unit tests: `tests/`

## Quick Start (CLI)

Install dependencies:

```bash
pip install -r requirements.txt
```

Run quick mode:

```bash
python3 src/research_agent.py \
  --brief examples/brief_quick_underperforming.json \
  --output out/quick_report.md \
  --update-memory
```

Run deep mode:

```bash
python3 src/research_agent.py \
  --brief examples/brief_deep_gap_analysis.json \
  --output out/deep_report.md \
  --update-memory
```

Run unit tests:

```bash
pip install pytest
pytest tests/ -v
```

Reports are written to `out/`.

## API Usage (FastAPI)

Start the server:

```bash
uvicorn api.main:app --reload
```

Open API docs:

- http://127.0.0.1:8000/docs

Minimal request example:

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
      "catalog": { "path": "datasets/processed/catalog.json" },
      "reviews": { "path": "datasets/processed/reviews.json" },
      "pricing": { "path": "datasets/processed/pricing.json" },
      "competitors": { "path": "datasets/processed/competitors.json" },
      "performance_signals": { "path": "datasets/processed/performance_signals.json" }
    }
  },
  "source_base_dir": ".",
  "output_path": "out/api_report.md",
  "update_memory": true
}
```

### Optional API Key

Enable API key authentication:

```bash
export ECOM_AGENT_API_KEY="your-secure-key-here"
uvicorn api.main:app --reload
```

When enabled, requests must include header:

```
X-API-Key: your-secure-key-here
```

### Production Safety Features

**Rate Limiting**: 30 requests per minute per client IP (prevents abuse).

**Structured Logging**: All API calls logged as JSON for audit and monitoring:

```json
{
  "timestamp": "2026-02-21T10:30:45.123456",
  "event_type": "api_request",
  "client_id": "192.168.1.1",
  "endpoint": "/analyze",
  "method": "POST",
  "mode": "quick",
  "business_goal": "profitability"
}
```

**Request Validation**: Pydantic schema enforcement ensures data integrity.

**Error Handling**: Clear error messages with security event logging.

## Web UI (Demo)

1) Start API:

```bash
uvicorn api.main:app --reload
```

2) Serve frontend:

```bash
cd webapp
python3 -m http.server 5500
```

3) Open: http://127.0.0.1:5500

Click "Load demo values" to fill the form with a Bluetooth Earbuds analysis example.

## Datasets

- Default runs use `datasets/processed/*.json` (lightweight, ready-to-use).
- Raw CSVs live in `datasets/raw/` and are tracked with Git LFS.

To access raw CSVs:

```bash
git lfs install
git lfs pull
```

## Report Output

### Quick Mode

- Bullet insights and key takeaways
- Aggregated metrics (ratings, gaps, conversions)
- Immediate action items

### Deep Mode

- Executive summary with context
- Detailed findings and evidence
- Competitive intelligence
- Risk assessment and opportunities
- Strategic recommendations
- Confidence score and data quality flags

## Deployment

### Docker

```bash
docker build -t ecommerce-intel-agent .
docker run -p 8000:8000 ecommerce-intel-agent
```

### Cloud (Render, Railway, Fly.io)

Build command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn api.main:app --host 0.0.0.0 --port $PORT
```

Health check endpoint:

```
GET /health
```

Deployment manifests included: `render.yaml`, `railway.json`

## System Architecture

### Data Processing Pipeline

1. **Data Loading** – Load JSON/CSV datasets from processed or raw directories
2. **Normalization** – Standardize field names and data types
3. **Metric Computation** – Calculate ratings, gaps, conversions, feature alignment
4. **Noise Detection** – Flag missing data, outliers, and data quality issues
5. **Confidence Scoring** – Weight confidence by completeness and evidence volume
6. **Report Generation** – Create structured Markdown with findings and recommendations
7. **Memory Update** – Store user preferences for future personalization

### API Layer Architecture

- **FastAPI** backend provides REST endpoints with auto-generated OpenAPI docs
- **Rate Limiter** enforces 30 req/min per IP using in-memory token bucket
- **Logger** outputs all events as JSON for centralized log aggregation
- **Validators** use Pydantic to enforce strict request schema
- **Authentication** (optional) via API key header

### Memory System

User preferences persist in `data/domain_memory.json`:

- KPI priorities and marketplace focus
- Category and product history
- Past analysis themes

Memory influences future report bias and personalization.

## Known Limitations & Future Roadmap

### Current Limitations

- Memory is file-based JSON (not concurrent-safe)
- No vector semantic retrieval for deep review analysis
- No live marketplace API integration
- API key is optional (not multi-tenant or RBAC)

### Recommended Enhancements

1. **Vector DB** – Integrate Qdrant for semantic review retrieval
2. **Database Memory** – Replace JSON with PostgreSQL for scalability
3. **Advanced Auth** – OAuth 2.0, role-based access control, audit trail
4. **Real-time Feeds** – Marketplace API connectors for live pricing/inventory
5. **Observability** – Prometheus metrics, APM, dashboard integration
6. **Caching** – Redis layer for frequently accessed analyses

## Notes for Evaluators

- The agent is **deterministic** for a given brief and dataset
- Use sample briefs in `examples/` for immediate reproduction
- Reports are **business-focused**, not raw model output
- All API requests are logged; security events trigger separate audit logs
- Rate limiting and validation prevent API abuse
- Structured logging enables production monitoring and debugging

## License

MIT
