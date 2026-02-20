# Technology Stack Document

## 1. Backend

### Language
- Python 3.10+

### Framework
- FastAPI (REST API service layer)

### Server
- Uvicorn (ASGI server)

### Data Processing
- Native Python data parsing
- JSON & CSV handling

---

## 2. Data Architecture

### Raw Data Layer
- CSV files stored under datasets/raw/

### Processed Data Layer
- Normalized JSON files under datasets/processed/

### Memory Storage
- File-based JSON store (data/domain_memory.json)

---

## 3. API Layer

Endpoints:
- GET /health
- GET /auth-status
- POST /analyze

Authentication:
- Optional API key via environment variable

---

## 4. Frontend (Planned / Optional)

### Option 1: Vanilla Web Stack
- HTML5
- CSS3
- JavaScript (Fetch API)
- Marked.js (Markdown rendering)

### Option 2: React (Optional Upgrade)
- React + Vite
- TailwindCSS

---

## 5. Deployment

### Containerization
- Docker

### Cloud Options
- Render
- Railway
- Any ASGI-compatible host

---

## 6. Development Tooling

- GitHub (Version Control)
- Virtual Environment (venv)
- Environment Variables (.env)

---

## 7. Future Technical Enhancements

- Qdrant (Vector DB)
- PostgreSQL (Memory store replacement)
- Redis (Caching layer)
- Structured logging middleware
- Rate limiting and API monitoring

