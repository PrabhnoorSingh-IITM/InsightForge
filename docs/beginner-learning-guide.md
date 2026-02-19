# Beginner Learning Guide

This guide teaches the project from scratch for an absolute beginner.

You will learn both:
1. **Concepts** (what things mean)
2. **Practice** (where they exist in this project)

---

## 0) What you are building (in plain English)

You built an **AI research backend** plus a **webapp console** for e-commerce teams.

Input:
- product/review/pricing/competitor/performance data
- a business brief (goal, scope, mode)

Output:
- a decision-ready report (not just raw metrics)

In simple terms:
- "Give me my commerce data + business objective"
- "Tell me what I should do next, and why"

---

## 1) Big-picture architecture (mental model)

Think of the system as 6 boxes:

1. **Raw Data Box**
   - CSV files from Kaggle
   - folder: [datasets/raw](../datasets/raw)

2. **Data Preparation Box**
   - cleans/transforms raw data into a standard format
   - script: [src/prepare_datasets.py](../src/prepare_datasets.py)
   - output folder: [datasets/processed](../datasets/processed)

3. **Research Engine Box**
   - computes insights, risk flags, confidence, recommendations
   - script: [src/research_agent.py](../src/research_agent.py)

4. **Memory Box**
   - stores preferences from previous runs (KPIs, marketplaces, categories)
   - file: [data/domain_memory.json](../data/domain_memory.json)

5. **API Box**
   - exposes endpoints so tools/apps can call your engine
   - file: [api/main.py](../api/main.py)

6. **Webapp Console Box**
   - visual UI for non-technical users
   - folder: [webapp](../webapp)

---

## 2) Core concepts you should know first

## 2.1 API (Application Programming Interface)

An API is a way software talks to software.

Your API endpoints:
- `GET /health` → "is server alive?"
- `GET /auth-status` → "is API key required?"
- `POST /analyze` → "run analysis and return report"

Reference: [api/main.py](../api/main.py)

---

## 2.2 JSON

JSON is a structured text format like key-value objects.

Your project uses JSON for:
- processed datasets
- request briefs
- memory store
- API request/response payloads

Examples:
- [datasets/processed/brief_deep_kaggle.json](../datasets/processed/brief_deep_kaggle.json)
- [data/domain_memory.json](../data/domain_memory.json)

---

## 2.3 ETL (Extract, Transform, Load)

ETL means:
- **Extract**: read raw CSV
- **Transform**: clean/normalize schema
- **Load**: write standardized JSON files

Your ETL script:
- [src/prepare_datasets.py](../src/prepare_datasets.py)

---

## 2.4 Business analytics vs decision intelligence

- Analytics: "here are numbers"
- Decision intelligence: "here are numbers + action recommendation + risk"

Your project does the second one using mode-aware report generation.

Reference:
- [src/research_agent.py](../src/research_agent.py)

---

## 3) Quick Mode vs Deep Mode (what changes conceptually)

## Quick Mode
Use when speed matters.
- focused insights
- key metrics
- immediate actions

## Deep Mode
Use when strategic depth matters.
- broader synthesis
- structured sections
- confidence + completeness + risk flags

Where this is implemented:
- mode parsing and report generation in [src/research_agent.py](../src/research_agent.py)

---

## 4) Understanding each main file (project as textbook)

## 4.1 [src/prepare_datasets.py](../src/prepare_datasets.py)
What it teaches:
- reading CSV in Python
- data cleaning helpers (price/rating parsing)
- schema mapping to analysis-friendly JSON
- generating derived fields when source data is missing

What to inspect first:
- parsing helpers
- `build_catalog`
- `build_reviews`
- `build_pricing`
- `build_competitors`
- `build_performance`

---

## 4.2 [src/research_agent.py](../src/research_agent.py)
What it teaches:
- input validation
- metric computation from multi-source data
- reliability scoring
- recommendation synthesis
- output report formatting

Key learning parts:
- source loading (`load_source`)
- data quality checks (`detect_noise`, completeness)
- analysis modules (reviews/pricing/performance)
- confidence scoring
- quick vs deep report builders

---

## 4.3 [api/main.py](../api/main.py)
What it teaches:
- building FastAPI endpoints
- request/response models
- auth guard using environment variable
- turning engine logic into a deployable service

Key concepts:
- Pydantic model validation
- HTTP status handling
- optional API key checks

---

## 4.4 [data/domain_memory.json](../data/domain_memory.json)
What it teaches:
- persistent state in ML/AI workflows
- personalization over time

Why it matters:
- recommendations become aligned with user priorities (e.g., margin-first)

---

## 4.5 [webapp/](../webapp/)
What it teaches:
- client-side CSV parsing
- basic API calls via Fetch
- how a UI collects analysis inputs

## 4.6 [datasets/README.md](../datasets/README.md)
What it teaches:
- data contract documentation
- onboarding instructions for new datasets

---

## 5) End-to-end data flow (step-by-step)

1. Drop raw Kaggle CSV into [datasets/raw](../datasets/raw)
2. Run ETL script to produce standardized JSON in [datasets/processed](../datasets/processed)
3. Prepare brief JSON (mode, goal, scope, paths)
4. Run analysis via CLI or API
5. Engine reads data + memory
6. Engine computes findings/risk/confidence
7. Output report written to [out](../out)

---

## 6) Hands-on labs (best way to learn)

## Lab 1: Run ETL and inspect outputs
Goal: understand transformation.

Command:
```bash
python3 src/prepare_datasets.py --raw datasets/raw/amazon.csv --out-dir datasets/processed --limit 8000
```

Then open:
- [datasets/processed/summary.json](../datasets/processed/summary.json)
- [datasets/processed/catalog.json](../datasets/processed/catalog.json)

What to observe:
- record counts
- standardized keys
- derived fields

---

## Lab 2: Run Deep analysis from processed data
Goal: see decision intelligence output.

Command:
```bash
python3 src/research_agent.py --brief datasets/processed/brief_deep_kaggle.json --output out/deep_report_kaggle.md --update-memory
```

Open output:
- [out/deep_report_kaggle.md](../out/deep_report_kaggle.md)

What to observe:
- section structure
- confidence score
- risk flags
- recommendation quality

---

## Lab 3: Use the Webapp Console
Goal: run analysis without touching code.

Start API:
```bash
uvicorn api.main:app --reload
```

Run webapp:
```bash
cd webapp
python3 -m http.server 5500
```

Open UI:
- http://127.0.0.1:5500

What to observe:
- dataset upload + mapping
- report rendering and confidence badges

## Lab 4: Call API directly
Goal: understand backend serving.

Start API:
```bash
uvicorn api.main:app --reload
```

Health check:
```bash
curl http://127.0.0.1:8000/health
```

API docs:
- http://127.0.0.1:8000/docs

What to observe:
- request schema
- response format
- behavior when required fields are missing

---

## Lab 5: Test authentication behavior
Goal: understand secure API gating.

Start with key:
```bash
export ECOM_AGENT_API_KEY="my-secret-key"
uvicorn api.main:app --reload
```

Check auth mode:
```bash
curl http://127.0.0.1:8000/auth-status
```

Try analyze without key (should fail 401), then with key (should pass).

---

## 7) Concepts mapped to project files (quick lookup)

- API design → [api/main.py](../api/main.py)
- Data engineering (ETL) → [src/prepare_datasets.py](../src/prepare_datasets.py)
- AI/report logic → [src/research_agent.py](../src/research_agent.py)
- Prompt engineering (optional) → [src/build_research_prompt.py](../src/build_research_prompt.py)
- Memory/personalization → [data/domain_memory.json](../data/domain_memory.json)
- Deployment basics → [docs/hosting.md](hosting.md)
- Web UI basics → [webapp](../webapp)

---

## 8) Why your answers improve with better datasets

Your current processed files work and are valid.

But stronger quality comes from:
- real competitor feed (instead of derived proxy)
- real performance telemetry (views/clicks/conversions/returns)
- fresher timestamps
- unified SKU IDs across all sources

This improves:
- confidence score quality
- risk flag precision
- recommendation reliability

---

## 9) Beginner glossary

- **SKU**: unique product identifier
- **Conversion Rate**: purchases divided by views/sessions
- **CAC**: customer acquisition cost
- **LTV**: customer lifetime value
- **Margin**: revenue minus cost percentage/value
- **Confidence Score**: trust estimate of analysis given data quality and volume
- **Risk Flag**: warning about missing/noisy/weak evidence
- **Endpoint**: URL path for API function
- **Payload**: data sent to an API endpoint

---

## 10) Common beginner mistakes and fixes

1. Wrong file paths in brief
- Fix: verify `source_base_dir` + file names

2. Missing required brief keys
- Fix: include `mode`, `business_goal`, `scope`, `data_sources`

3. Expecting UI route after UI removal
- Fix: use API docs at `/docs` and endpoint calls

4. Confusing raw and processed datasets
- Fix: run ETL first; analyze only processed schema

5. 401 unauthorized error
- Fix: pass `x-api-key` when server key is enabled

---

## 11) A 7-day beginner learning plan (using this repo)

Day 1: Read [README.md](../README.md) and run health check.
Day 2: Study [src/prepare_datasets.py](../src/prepare_datasets.py) and run ETL.
Day 3: Study [src/research_agent.py](../src/research_agent.py) and run CLI analysis.
Day 4: Study [api/main.py](../api/main.py) and call endpoints manually.
Day 5: Modify one metric rule and observe report changes.
Day 6: Replace derived competitor/performance files with real data.
Day 7: Deploy backend using [docs/hosting.md](hosting.md).

---

## 12) What to build next after mastering this

- Add strict schema validator before analysis
- Add test suite for ETL and report sections
- Add database-backed memory store
- Add role-specific report variants (PM vs growth vs category owner)
- Add semantic clustering for review themes

---

## 13) Final beginner takeaway

If you remember only one thing, remember this:

**This project is a full pipeline from messy commerce data to clear business decisions.**

You are not building just analytics.
You are building a system that tells teams what action to take next—with evidence and risk transparency.
