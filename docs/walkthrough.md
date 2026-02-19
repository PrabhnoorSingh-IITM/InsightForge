# Walkthrough

## Goal

Run and deploy the backend plus webapp console so evaluators can access analysis visually.

## Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

## Step 2: Run Quick Mode Analysis
```bash
python3 src/research_agent.py \
  --brief examples/brief_quick_underperforming.json \
  --output out/quick_report.md \
  --update-memory
```

Expected outcome:
- Top complaint clusters
- Price pressure snapshot
- Immediate recommendations with confidence

## Step 3: Run Deep Mode Analysis
```bash
python3 src/research_agent.py \
  --brief examples/brief_deep_gap_analysis.json \
  --output out/deep_report.md \
  --update-memory
```

Expected outcome:
- Strategic diagnosis with evidence citations
- Competitive feature and pricing gaps
- Risks, opportunities, and prioritized actions

## Step 4: Run Memory-Driven Next Category Query
```bash
python3 src/research_agent.py \
  --brief examples/brief_next_category.json \
  --output out/next_category_report.md \
  --update-memory
```

Expected outcome:
- Category exploration recommendation aligned with prior KPI focus

## Step 5: Start FastAPI Service
```bash
uvicorn api.main:app --reload
```

Open API docs at:
- http://127.0.0.1:8000/docs

If auth is enabled, set key first:

```bash
export ECOM_AGENT_API_KEY="your-strong-key"
uvicorn api.main:app --reload
```

## Step 6: Run the Webapp Console

```bash
cd webapp
python3 -m http.server 5500
```

Open the UI:
- http://127.0.0.1:5500

If UI and API are on different origins, set CORS:

```bash
export ECOM_AGENT_CORS_ORIGINS="http://127.0.0.1:5500"
uvicorn api.main:app --reload
```

## Step 7: Call API Endpoint
`POST /analyze` request body format:
```json
{
  "brief": { "mode": "quick", "business_goal": "profitability", "scope": {}, "data_sources": {} },
  "update_memory": false,
  "memory_path": "data/domain_memory.json",
  "source_base_dir": "examples",
  "output_path": "out/api_report.md"
}
```

## Step 8: Deploy for UI + API Access

### Render

- Push code to GitHub.
- Create service via Blueprint (`render.yaml`).
- Deploy API and host `webapp/` on a static host (or the same host if supported).

### Railway

- Create project from GitHub.
- Deploy using `railway.json`.
- Share the webapp URL for evaluation; keep API URL in `config.js`.

Result: judges/users can use the UI to run analysis, while API handles execution.
