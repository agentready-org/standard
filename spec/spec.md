# Make your site readable by AI agents

> A practical guide to making your website work for the agents that now read it — grounded in real agent runs and a controlled experiment.

**Version:** v1.0 · last updated August 2026
**Full spec:** https://agentready.org ← the canonical, complete text
**Authors:** the [ora.ai](https://ora.ai) research lab, in collaboration with the [Vercel](https://vercel.com) team
**Dataset:** [`data/`](../data/)

---

This file is a condensed outline of the spec. **The full text — with every measured finding, worked example, and configuration snippet — lives at [agentready.org](https://agentready.org).** This repo carries the outline alongside the [dataset](../data/) so the numbers behind the spec can be reproduced or challenged.

## What the spec covers

AI agents visit websites on users' behalf to answer questions, integrate APIs, and complete tasks. The spec measures which site features help them succeed, and follows the order in which agents encounter a site — **find, read, then act**. Each stage depends on the previous one.

In the studies, only two changes caused agents to fail outright: hiding answers behind JavaScript and blocking access. Everything else shaped where agents went and which pages their answers were built from.

### 1. Be reachable and citable — *find*

Agents can cite only pages they can discover and fetch.

- Publish answers as first-party docs — 82% of answers traced back to a fetched page, most often a docs page.
- Allow agents and crawlers in `robots.txt`, with one wildcard rule rather than an allowlist of named crawlers.
- List your pages in a `sitemap.xml`.

### 2. Put the answer where agents read — *read*

Agents use the same homepage and docs pages as human visitors; agent-specific files help them find and use those same answers.

- Serve the answer in the initial HTML — server-rendered or prerendered, not injected by JavaScript after load.
- Write docs pages that answer, with fenced, language-tagged code blocks.
- Link the files that describe your site — `llms.txt`, `.well-known/*`, `openapi.json`, `AGENTS.md` — from content agents already visit; unlinked files go unfound.
- Offer a markdown mirror via `<link rel="alternate" type="text/markdown">`.
- Return accurate HTTP status codes — a real `404` for missing pages, `429` + `Retry-After` when throttling.

### 3. Let agents act, not just read — *act*

To complete a task an agent needs an operable interface and authentication it can get through.

- Self-serve auth with documented scopes; OAuth 2.0 with discoverable `/.well-known` metadata for user-delegated access.
- A public API with a machine-readable OpenAPI contract.
- An MCP server over Streamable HTTP, plus MCP Apps where your product has a UI.
- SDKs and a CLI, with install and first call shown in the docs.

## How we know

Every measured number in the spec derives from research by the ora.ai research lab, published in this repo:

- [`data/traces.csv`](../data/traces.csv) — over 1,000 real agent runs across 25 sites, traced turn by turn.
- [`data/fetchability.csv`](../data/fetchability.csv) — a controlled experiment that toggled one site feature at a time.

## References

- **[What agents actually reach](https://ora.ai/blog/what-agents-actually-reach)** — the field report behind the trace numbers. The report draws on a subset of the data used for the spec; the full dataset is in [`data/`](../data/).
- **[The state of agent readiness](https://ora.ai/blog/state-of-agent-readiness-2026)** — the scanner report behind the reachability figures.
- **[ora research](https://ora.ai)** — the ongoing research program behind the protocol.

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | August 2026 | First public version. |

## License

MIT.
