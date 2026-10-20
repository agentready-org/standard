# Changelog

All notable changes to the AgentReady spec are recorded here. The readable
surface is [agentready.org](https://agentready.org); the text lives in
[`spec/spec.md`](spec/spec.md).

---

## v2.0 — October 2026

A major version: `AR-ACT-10` adds a `MUST`, so a product that conformed
to v1.0 may not conform to v2.0, and `AR-ACT-07` WebMCP is raised from
`MAY` to `SHOULD`.

- New practice: `AR-ACT-10` an MCP server or a CLI (MUST, at least one)
  for products agents are expected to act on. MUST now marks what an
  agent fails without: the two changes that broke an agent in the
  studies, and an interface to act through. `AR-ACT-03` (MCP server) and
  `AR-ACT-06` (SDKs and a CLI) stay SHOULD as the specific forms.
- `AR-ACT-07` WebMCP (SHOULD): register tools on `document.modelContext`
  when the product has a web UI an agent should operate. Previously on
  agentready.org without an identifier, as a MAY.
- New practice: `AR-FIND-04` AI Catalog at `/.well-known/ai-catalog.json`,
  with Agentic Resource Discovery (ARD) as the registry layer (MAY).
- New practice: `AR-READ-11` pricing on a first-party page (SHOULD),
  backed by pricing answers being 60% accurate from the business's own
  pages against 37% from elsewhere. It takes the next unused number:
  `AR-READ-10` was removed in August 2026 and stays retired.
- New practice: `AR-ACT-08` agent payments (MAY): x402 or MPP for
  per-call pricing, UCP or ACP for checkout, and Stripe Link (Link on
  checkout and Shared Payment Tokens) for agents paying with a Link Agent
  Wallet, backed by Ora's October 2026 checkout study (92.3% of Link test
  checkouts done right).
- New practice: `AR-ACT-09` NLWeb `/ask` endpoint with an `ask` tool over
  MCP (MAY).
- `AR-FIND-01` now covers bot protection as well as `robots.txt`: let
  verified agents through the WAF or bot manager, and throttle with a
  `429` instead of a challenge page.
- The find section opens with what happens when agents cannot read a
  site, from Ora's AX is the New AEO study (1,056 business sites): the
  agent answers anyway, and those answers are 3.7× as likely to miss
  every fact asked for.
- `[STUDIES]` is described by the full research base behind the spec:
  more than 250,000 real agent runs, the controlled experiment, and the
  Ora research reports cited next to their numbers. The per-claim numbers
  keep their raw counts from the published 1,033-run subset in
  [`data/traces.csv`](data/traces.csv).
- The crawl-policy notes name agent search APIs (Brave Search API, Exa,
  Parallel, Tavily) as a crawler kind the wildcard rule covers.
- The `AR-ACT-*` category applies to products agents are expected to act
  on, not only read about.

### Removed

- `AR-READ-10` (`AGENTS.md` / `SKILLS.md`, MAY), removed in August 2026
  along with its open question. The identifier is retired.

---

## v1.0 — August 2026

First public version of **"Make your site readable by AI agents."**

The spec was restructured from five topic sections (Discoverability,
Content, Capabilities, Identity & Access, Commerce) into the order in
which agents encounter a site — find, read, act — with every requirement
grounded in the studies. Stable identifiers moved from `AR-DISC-*` /
`AR-CONT-*` / `AR-CAPA-*` / `AR-IDEN-*` / `AR-COMM-*` to `AR-FIND-*` /
`AR-READ-*` / `AR-ACT-*`; the old identifiers are retired, not reused.
Strengths (`MUST` / `SHOULD` / `MAY`) are now assigned from measurement:
the two changes that broke an agent in the studies are `MUST`, practices
that measurably shaped where agents went are `SHOULD`, emerging
conventions are `MAY`. Figures are tagged by source (`[STUDIES]` for
traced agent runs and the controlled experiment, `[ORA SCANNER]` for
reachability checks).

Removed in this restructure:

- The `/spec.json` machine-readable artifact (the markdown source in
  `spec/spec.md` is the machine-readable form for now).
- The baseline vs. conditional applicability model; applicability is
  stated in each requirement's text.

The v1.0.0 entry below is the version announced on March 20, 2026
([ora.ai/blog/agentready-open-standard](https://ora.ai/blog/agentready-open-standard))
and published on April 24, 2026.

---

## v1.0.0 — 2026-04-24

First published version of AgentReady.

### Added

- Five sections, organized by topic rather than by agent journey:
  - **Discoverability** (`AR-DISC-01` … `AR-DISC-06`)
  - **Content for agents** (`AR-CONT-01` … `AR-CONT-04`)
  - **Capabilities** (`AR-CAPA-01` … `AR-CAPA-09`)
  - **Identity & Access** (`AR-IDEN-01` … `AR-IDEN-06`)
  - **Commerce** (`AR-COMM-01` … `AR-COMM-05`)
- Normative strength (`MUST` / `SHOULD` / `MAY` per BCP 14) on every
  requirement.
- Applicability model (`baseline` vs. conditional) on every requirement.
- Stable identifiers for every requirement, preserved across revisions.
- Conformance definition, including the treatment of Commerce as a set of
  alternative, interoperating protocols where at least one applies.
- Machine-readable artifact at `/spec.json`.
- Agent-readable summary at [`/llms.txt`](https://agentready.org/llms.txt).

### Requirements

Discoverability

- `AR-DISC-01` robots.txt with AI policy — **MUST** (baseline)
- `AR-DISC-02` Sitemap — **SHOULD** (baseline)
- `AR-DISC-03` llms.txt — **SHOULD** (baseline)
- `AR-DISC-04` llms-full.txt — **MAY** (baseline)
- `AR-DISC-05` HTTP Link response header — **MAY** (baseline)
- `AR-DISC-06` NLWeb schema feeds — **MAY** (conditional)

Content for agents

- `AR-CONT-01` JSON-LD structured data — **SHOULD** (baseline)
- `AR-CONT-02` Markdown content negotiation — **MAY** (baseline)
- `AR-CONT-03` /index.md fallback — **MAY** (baseline)
- `AR-CONT-04` Speakable content markup — **MAY** (conditional)

Capabilities

- `AR-CAPA-01` Model Context Protocol (MCP) — **MUST** (conditional)
- `AR-CAPA-04` A2A Agent Card — **MUST** (conditional)
- `AR-CAPA-08` OpenAPI — **MUST** (conditional)
- `AR-CAPA-02` MCP Server Card — **SHOULD** (conditional)
- `AR-CAPA-03` MCP Apps — **MAY** (conditional)
- `AR-CAPA-05` WebMCP — **MAY** (conditional)
- `AR-CAPA-06` NLWeb /ask endpoint — **MAY** (conditional)
- `AR-CAPA-07` Agent Skills — **MAY** (conditional)
- `AR-CAPA-09` ai-plugin.json — **MAY** (conditional)

Identity & Access

- `AR-IDEN-02` OAuth 2.0 — **MUST** (conditional)
- `AR-IDEN-03` OAuth Authorization Server Metadata — **MUST** (conditional)
- `AR-IDEN-05` PKCE — **MUST** (conditional)
- `AR-IDEN-01` Web Bot Auth — **SHOULD** (baseline)
- `AR-IDEN-04` OAuth Protected Resource — **SHOULD** (conditional)
- `AR-IDEN-06` API Catalog — **MAY** (conditional)

Commerce

- `AR-COMM-01` x402 — **MAY** (conditional)
- `AR-COMM-02` Agentic Commerce Protocol (ACP) — **MAY** (conditional)
- `AR-COMM-03` ACP Delegate Payment — **MAY** (conditional)
- `AR-COMM-04` Universal Commerce Protocol (UCP) — **MAY** (conditional)
- `AR-COMM-05` Machine Payments Protocol (MPP) — **MAY** (conditional)

All v1.0.0 identifiers were retired in the v1.0 restructure.
