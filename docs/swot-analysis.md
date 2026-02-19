# SWOT Analysis

## Strengths
- Decision-first outputs, not metric dumps
- Multi-source reasoning across catalog, reviews, pricing, competitors, performance
- Explainability through structured evidence and uncertainty scoring
- Memory layer improves relevance over time
- API + CLI support for both analysts and product teams
- Webapp console enables non-technical users to run analyses

## Weaknesses
- Quality depends on source freshness and schema consistency
- Current heuristics are rule-based, not fully ML-trained
- Relative feature/theme extraction can miss nuanced semantics
- CSV upload flow can be heavy for very large datasets

## Opportunities
- Integrate with BI/warehouse platforms for live data
- Add LLM-based semantic clustering for richer complaint analysis
- Build proactive alerts (price drift, sentiment spikes, conversion drops)
- Add role-specific views (PM, growth, category owner)
- Expand to ad efficiency and inventory planning decisions

## Threats
- Data provider limits or API cost increases
- Competitors offering turnkey analytics suites
- Model drift from changing customer language or product trends
- Overreliance on incomplete inputs without governance
- Public exposure without auth/rate limiting if misconfigured

## Mitigations
- Confidence and completeness gates before high-stakes recommendations
- Schema validation and source quality monitoring
- Human-in-the-loop review for strategic decisions
- Continuous tuning from feedback and observed business outcomes
- Enforce `ECOM_AGENT_API_KEY`, add reverse-proxy rate limits, and monitor usage
