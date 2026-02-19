import os
from pathlib import Path
from typing import Any, Dict, Optional

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.research_agent import run_analysis, read_json, update_memory, write_json


PROJECT_ROOT = Path(__file__).resolve().parents[1]

app = FastAPI(
    title="E-Commerce Intelligence Research Agent API",
    version="1.0.0",
    description="Run Quick/Deep e-commerce intelligence analyses and return decision-ready reports.",
)

API_KEY = os.getenv("ECOM_AGENT_API_KEY", "").strip()
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ECOM_AGENT_CORS_ORIGINS", "*").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"]
)


class AnalyzeRequest(BaseModel):
    brief: Dict[str, Any]
    update_memory: bool = False
    memory_path: str = "data/domain_memory.json"
    source_base_dir: str = "datasets/processed"
    output_path: Optional[str] = Field(
        default=None,
        description="Optional report output path relative to project root or absolute path.",
    )


class AnalyzeResponse(BaseModel):
    status: str
    mode: str
    business_goal: str
    report: str
    memory_updated: bool
    output_path: Optional[str] = None


def normalize_scope(brief: Dict[str, Any]) -> Dict[str, Any]:
    scope = brief.get("scope")
    if isinstance(scope, dict):
        scope_type = scope.get("type")
        scope_value = scope.get("value")
        if scope_type or scope_value:
            return {
                "marketplaces": brief.get("marketplaces", ["Unknown"]),
                "category_or_product": scope_value or "Unknown",
                "region": brief.get("region", "Unknown"),
                "timeframe": brief.get("timeframe", "Unspecified"),
                "scope_type": scope_type or "Unknown",
            }
        return scope

    if isinstance(scope, str) and scope.strip():
        return {
            "marketplaces": brief.get("marketplaces", ["Unknown"]),
            "category_or_product": scope.strip(),
            "region": brief.get("region", "Unknown"),
            "timeframe": brief.get("timeframe", "Unspecified"),
            "scope_type": "Unknown",
        }

    return {
        "marketplaces": brief.get("marketplaces", ["Unknown"]),
        "category_or_product": "Unknown",
        "region": brief.get("region", "Unknown"),
        "timeframe": brief.get("timeframe", "Unspecified"),
        "scope_type": "Unknown",
    }


def normalize_data_sources(data_sources: Any) -> Dict[str, Any]:
    if isinstance(data_sources, dict):
        normalized = {}
        for key, value in data_sources.items():
            if isinstance(value, str):
                normalized[key] = {"path": value}
            else:
                normalized[key] = value
        return normalized

    if isinstance(data_sources, list):
        ordered_keys = ["catalog", "reviews", "pricing", "competitors", "performance_signals"]
        mapped = {}
        for key, value in zip(ordered_keys, data_sources):
            mapped[key] = {"path": value} if isinstance(value, str) else value
        return mapped

    return {}


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/auth-status")
def auth_status() -> Dict[str, bool]:
    return {"api_key_required": bool(API_KEY)}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest, x_api_key: Optional[str] = Header(default=None)) -> AnalyzeResponse:
    if API_KEY:
        if not x_api_key or x_api_key.strip() != API_KEY:
            raise HTTPException(status_code=401, detail="Unauthorized: invalid or missing API key")

    brief = dict(payload.brief)
    brief["scope"] = normalize_scope(brief)
    brief["data_sources"] = normalize_data_sources(brief.get("data_sources"))

    required = ["mode", "business_goal", "scope", "data_sources"]
    missing = [field for field in required if field not in brief]
    if missing:
        missing_text = ", ".join(missing)
        raise HTTPException(status_code=400, detail=f"Missing required brief fields: {missing_text}")

    memory_file = Path(payload.memory_path)
    memory_file = memory_file if memory_file.is_absolute() else PROJECT_ROOT / memory_file

    source_base = Path(payload.source_base_dir)
    source_base = source_base if source_base.is_absolute() else PROJECT_ROOT / source_base

    memory = read_json(memory_file) if memory_file.exists() else {}

    try:
        report = run_analysis(brief=brief, memory=memory, root_dir=source_base)
    except (ValueError, FileNotFoundError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unexpected analysis error: {exc}") from exc

    resolved_output_path: Optional[str] = None
    if payload.output_path:
        output_file = Path(payload.output_path)
        output_file = output_file if output_file.is_absolute() else PROJECT_ROOT / output_file
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text(report, encoding="utf-8")
        resolved_output_path = str(output_file)

    if payload.update_memory:
        updated = update_memory(memory, brief)
        write_json(memory_file, updated)

    return AnalyzeResponse(
        status="success",
        mode=str(brief["mode"]),
        business_goal=str(brief["business_goal"]),
        report=report,
        memory_updated=payload.update_memory,
        output_path=resolved_output_path,
    )
