# Hosting Guide

This project serves a FastAPI backend plus a standalone webapp console.

## FAQ

### Do I need to provide an API key?

- Not mandatory by default.
- Required only when `ECOM_AGENT_API_KEY` is configured on the server.

### Do I need Firebase for hosting?

- No. Firebase is optional and not required.
- Recommended: Render, Railway, Fly.io, or any Docker-capable host.

### Can it be accessed with just a URL?

- Yes, by hosting the static webapp and API together.
- The webapp makes calls to `/analyze` over HTTP.

## Option 1: Local/Public with `uvicorn`

```bash
pip install -r requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

With API key protection:

```bash
export ECOM_AGENT_API_KEY="your-strong-key"
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

- Swagger API docs: `http://127.0.0.1:8000/docs`

### Run the webapp locally

```bash
cd webapp
python3 -m http.server 5500
```

Open the UI:
- `http://127.0.0.1:5500`

If serving frontend from a different origin, allow CORS:

```bash
export ECOM_AGENT_CORS_ORIGINS="http://127.0.0.1:5500"
uvicorn api.main:app --reload
```

## Option 2: Docker (recommended for deployment)

Build image:

```bash
docker build -t ecommerce-intel-agent .
```

Run container:

```bash
docker run -p 8000:8000 ecommerce-intel-agent
```

- Open docs: `http://localhost:8000/docs`

## Option 3: Render/Railway/Fly.io

Use these settings:

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/health`

Project already includes:

- Render blueprint: `render.yaml`
- Railway config: `railway.json`
- Env template: `.env.example`

### Render One-Click Style

1. Push repo to GitHub.
2. In Render: **New +** → **Blueprint**.
3. Select repo (Render reads `render.yaml`).
4. Set env var `ECOM_AGENT_API_KEY` (optional but recommended).
5. Deploy and open generated URL.

### Railway Quick Deploy

1. Create new project from GitHub repo.
2. Railway uses `railway.json` start command.
3. Add `ECOM_AGENT_API_KEY` env var if needed.
4. Deploy and share generated URL.

## Hosting Notes

- Ensure write permissions for `out/` and `data/domain_memory.json` if memory updates are enabled.
- For strict production, route memory to a database/object storage instead of local filesystem.
- API auth is supported via `ECOM_AGENT_API_KEY`; require this for public deployments.
- If hosting publicly, also add rate limiting and HTTPS-only access.
- When UI and API are on different domains, configure `ECOM_AGENT_CORS_ORIGINS`.
