# Full System Explanation

## 1. System Overview

The E-Commerce Intelligence Research Agent is an API-first backend system designed to convert raw commerce datasets into structured, decision-ready business reports.

The system ingests normalized commerce data and generates either Quick or Deep analytical reports.

---

## 2. End-to-End Data Flow

1. User sends research brief via API
2. API validates request schema
3. Engine loads relevant datasets
4. Engine computes metrics
5. Reliability and confidence scoring applied
6. Structured report generated
7. Optional memory update executed
8. Report returned as Markdown

---

## 3. Core Engine Logic

### Data Loading
Supports JSON and CSV inputs from processed directory.

### Metric Computation
- Average ratings
- Negative review share
- Price gaps
- Conversion and return metrics
- Feature gaps vs competitors

### Constraint Parsing
Interprets constraints such as:
- Margin focus
- Negative reviews only
- Premium competitor filtering

### Reliability Layer
Calculates:
- Data completeness percentage
- Noise flags
- Confidence score

---

## 4. Output Generation

Quick Mode:
- Bullet insights
- Key metrics
- Immediate actions

Deep Mode:
- Executive Summary
- Findings
- Competitive Insights
- Risks & Opportunities
- Strategic Recommendations
- Confidence Score

---

## 5. Memory System

Stores user preferences including:
- KPI priorities
- Marketplace focus
- Category interest

Memory influences future analysis bias.

---

## 6. API Layer

Endpoints:
- Health check
- Auth status
- Analyze

Supports optional API key validation.

---

## 7. Deployment Model

Backend can run:
- Locally
- Docker container
- Cloud platform (Render, Railway)

---

## 8. System Strengths

- Structured strategic output
- Risk-aware reporting
- Modular architecture
- Deployment-ready configuration

---

## 9. Architectural Limitations

- No vector semantic retrieval
- File-based memory
- No live marketplace integration

---

## 10. Strategic Positioning

The system bridges the gap between dashboards and decision intelligence by providing contextualized, evidence-based strategic recommendations rather than raw metric visualizations.

