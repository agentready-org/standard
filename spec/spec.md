# AgentReady — Make your site readable by AI agents

> **Status:** v1.0 — August 2026
> **Canonical site:** https://agentready.org
> **Written by:** [ora.ai](https://ora.ai) and [Vercel](https://vercel.com)
> **Dataset:** [`data/`](../data/)

---

## About this document

This file is the working text behind [agentready.org](https://agentready.org). The site is the canonical surface for readers; this repository is where the text is drafted, reviewed, and versioned — and where the [dataset](../data/) behind every measured number lives, so the numbers can be reproduced or challenged.

AI agents visit websites on users' behalf to answer questions, integrate APIs, and complete tasks. The ora.ai research lab measured which site features help them succeed. The requirements below follow the order in which agents encounter a site: **find, read, then act**. Each stage depends on the previous one, and unlinked files are unlikely to be discovered.

**Versioning policy.** This document follows [Semantic Versioning](https://semver.org/).

- A **major** version bump indicates a breaking change to a normative requirement.
- A **minor** version bump indicates a backward-compatible addition or refinement.
- A **patch** bump indicates clarifications, editorial fixes, and errata.

---

## Goals and non-goals

### Goals

- Define a single, measurable bar for "an agent can find, read, and act on this site."
- Ground every measured claim in published data: real agent runs and a controlled experiment, not intuition.
- Compose existing, real standards (robots.txt, sitemaps, llms.txt, OpenAPI, OAuth, MCP, …) rather than re-specify them.
- Provide stable identifiers (`AR-*`) so that conformance claims, errata, and tooling can refer to specific requirements without ambiguity.

### Non-goals

- **Scoring and grades.** This document defines requirements, not weights. Scoring, per-check breakdowns, and the leaderboard belong to the [ora scanner](https://ora.ai) and its public methodology.
- **A new manifest format.** AgentReady does not introduce its own bespoke manifest, capability schema, or tool-definition schema. Where a real standard exists, this document references it.
- **Defining how agents are built.** This document is about sites and products, not agents. It does not constrain LLM behavior, planning, or reasoning.

---

## Conventions

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals.

Each requirement carries a stable identifier of the form:

```
AR-<CATEGORY>-NN
```

where `<CATEGORY>` is one of `FIND`, `READ`, `ACT` (matching the three stages below) and `NN` is a zero-padded sequence number scoped to that category.

Identifier policy:

- Identifiers are **preserved across versions**. A requirement may be revised, moved between MUST/SHOULD/MAY, deprecated, or removed, but its identifier is never reused for a different requirement.
- A removed requirement's identifier is retired, not recycled.
- New requirements take the next unused number in their category.

### Evidence tags

Numbers in this document are tagged by source. **[STUDIES]** refers to research from the ora.ai research lab: over 1,000 real agent runs across 25 sites traced turn by turn ([`data/traces.csv`](../data/traces.csv)) and a controlled experiment that toggled one feature at a time ([`data/fetchability.csv`](../data/fetchability.csv)). **[ORA SCANNER]** refers to agent-reachability checks across every scored site. Statements without a tag are recommendations rather than measured findings.

### How normative levels were assigned

Normative weight is derived from measurement. In the studies, only two changes caused agents to fail outright: hiding answers behind JavaScript and blocking access. Those, and the prohibitions that make failures indistinguishable from successes (dishonest status codes), are **MUST**. Practices that measurably shaped where agents went and which pages their answers were built from are **SHOULD**. Emerging conventions with early but unquantified adoption are **MAY**.

---

## Conformance

A site conforms to AgentReady when it satisfies every **MUST**-level requirement that applies to it, including **MUST NOT** prohibitions.

All requirements share one prerequisite: the agent must be able to reach the page and find the answer in the returned HTML.

The stages are evaluated in order. `AR-READ-*` requirements are moot for pages an agent cannot reach, and `AR-ACT-*` requirements are moot for products an agent cannot read about. The `AR-ACT-*` category applies only to products that expose programmatic capability (an API, MCP server, SDK, or CLI); a purely informational site conforms on `AR-FIND-*` and `AR-READ-*` alone.

---

## 1. Find — Be reachable and citable (`AR-FIND-*`)

**Intent:** agents can cite only pages they can discover and fetch. They may receive or recall a URL, follow a link, or find a page through a crawl-built search index. Pages blocked from crawlers cannot enter those indexes; they are absent rather than ranked lower. Blocking can also stop an agent from fetching a page while answering a user.

| ID | Requirement | Level | Evidence |
|----|---|---|---|
| `AR-FIND-01` | The site **MUST NOT** block agent and crawler access to public content, in `robots.txt` or at the network layer. | **MUST** | **[STUDIES]** Blocking was one of only two changes that broke an agent. **[ORA SCANNER]** Established agents reached 81–90% of sites. |
| `AR-FIND-02` | Answers agents are expected to cite **SHOULD** be published on one canonical, current, first-party docs page. | **SHOULD** | **[STUDIES]** 82% of answers traced back to a page the agent fetched — and that page was a docs page 47% of the time, more than any other page type. |
| `AR-FIND-03` | The site **SHOULD** list its pages in a `sitemap.xml` referenced from `robots.txt`. | **SHOULD** | Still standard for crawlers and search engines. **[STUDIES]** Fetched directly in 4% of runs — one of the files real agents touch least. |

### Crawl policy (normative notes)

The crawl policy **SHOULD** be written as one rule for all agents, not an allowlist of named crawlers:

```txt
# robots.txt
# Apply the default policy to current and future agents.
User-agent: *
# Block low-value public paths only. Do not list secret paths.
Disallow: /search/

Sitemap: https://example.com/sitemap.xml
```

The wildcard still leaves one deliberate choice. The model providers run a separate crawler for each job:

- **Training crawlers** (GPTBot, ClaudeBot)
- **Search-index crawlers** (OAI-SearchBot, Claude-SearchBot)
- **User-initiated fetchers** (ChatGPT-User, Claude-User)

Each obeys its own `robots.txt` rule, so a site **MAY** block a training crawler — opting out of training — without dropping out of search indexes or agent answers. Two catches: a more specific group such as `User-agent: GPTBot` overrides the `*` group, so audit existing rules; and user-initiated fetchers may not consult `robots.txt` at all.

### Verification (informative)

Fetch a page with an agent user-agent string and inspect the response:

```sh
curl -iL -A 'Claude-User/1.0' https://example.com/your-page
```

The request should end with a `200` response; intermediate `301` or `308` redirects are acceptable. The returned HTML should contain the answer. A `403`, empty app shell, or JavaScript-only answer prevents fetch-only agents from reading the page.

The curl is not proof either way: bot blockers weigh where a request comes from more than its user-agent string. The dependable test is server logs — OpenAI and Anthropic publish their crawlers' IP ranges (separate per-bot lists from OpenAI, one combined list from Anthropic); find those requests and confirm they return `200`.

### Underlying standards (informative)

- `robots.txt` — [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309)
- Sitemaps — https://www.sitemaps.org/

---

## 2. Read — Put the answer where agents read (`AR-READ-*`)

**Intent:** after reaching a page, an agent must be able to extract the answer from the returned content. In the studies, agents used the same homepage and docs pages as human visitors; the agent-specific files (`llms.txt`, `AGENTS.md`, markdown mirrors, JSON-LD) just help agents find, fetch, and use those same answers.

| ID | Requirement | Level | Evidence |
|----|---|---|---|
| `AR-READ-01` | The answer **MUST** be present in the initial HTML — server-rendered or prerendered, not injected by a single-page app after load. | **MUST** | **[STUDIES]** A JavaScript-hidden answer was one of only two changes that broke an agent. The other was blocking it outright. |
| `AR-READ-02` | The site **MUST** return accurate HTTP status codes: `404` (or a valid redirect) for missing paths, and `429` with `Retry-After` when throttling — never a `200` for a missing page, and never a silent challenge page in place of a `429`. | **MUST** | Agents cannot distinguish a soft-404 from a live page. In one observed case, a single-page app returned `200` for every path, making dead URLs appear valid. Agents and crawlers treat `429` as a back-off signal and will return. |
| `AR-READ-03` | The homepage **SHOULD** be served as raw HTML with real links to docs, product, and pricing. | **SHOULD** | **[STUDIES]** Reached in 69% of runs, and it was the agent's first step in 92% of them; in 59% of those runs the next hop was a docs page. |
| `AR-READ-04` | Docs pages **SHOULD** answer the tasks users bring to agents. | **SHOULD** | **[STUDIES]** Reached in 83% of runs and fetched more than any other page type — about 3.4 docs pages per run. |
| `AR-READ-05` | Code snippets **SHOULD** be fenced and language-tagged. | **SHOULD** | **[STUDIES]** When an agent's answer included code, 61% of the time it contained lines taken verbatim from a page it fetched on the site. |
| `AR-READ-06` | Discovery files (`llms.txt`, `.well-known/*`, `openapi.json`, `AGENTS.md`) **SHOULD** be linked from content agents already visit — the footer, page metadata such as `<link rel="alternate">`, or a resources section. | **SHOULD** | **[STUDIES]** Agents typically opened these resources after visiting the homepage; depending on the file type, 86–100% of visits came through links rather than guessed paths. |
| `AR-READ-07` | The site **SHOULD** ship an `llms.txt`: a lean, described index of its key pages. | **SHOULD** | **[STUDIES]** 86% of its fetches came from a page that pointed to it. One in three agents that read it went on to fetch a page it lists, and 36% drew their final answer from its content. |
| `AR-READ-08` | Key pages **SHOULD** carry JSON-LD — the homepage above all — so an agent fetching the raw HTML gets key facts and routes in one machine-readable block. Critical facts **SHOULD** also appear in visible text. | **SHOULD** | **[STUDIES]** Agents can parse facts straight from the block. Markdown converters may omit script blocks, so repeat critical facts in visible text. |
| `AR-READ-09` | Pages **MAY** advertise a markdown mirror via `<link rel="alternate" type="text/markdown">` or an equivalent HTTP `Link:` header. | **MAY** | **[STUDIES]** Agents requested markdown on about 65% of web fetches; when they specified a format, they chose markdown 96% of the time. Format did not determine task success — ensure the HTML works first. |

Additional measured context: `.well-known/*` files were reached in about 23% of runs across the sites tested **[STUDIES]**, and on sites that ship an `openapi.json`, it was used in 21% of runs **[STUDIES]** (its normative home is `AR-ACT-02`).

If the site is client-rendered, getting answers into the initial HTML is a real migration — SSR, prerendering, or a hybrid — but it is the prerequisite for agents that fetch rather than run JavaScript. The machinery beyond that — content negotiation, `.md` endpoints, agent detection, frontmatter — did not change whether agents succeeded in the studies.

### `llms.txt` shape (informative)

```md
# Acme
> Acme ships a payments API for developers.

## Docs
- [Quickstart](https://example.com/docs/quickstart): first charge in one request
- [Authentication](https://example.com/docs/auth): API keys, scopes, rotation

## API
- [OpenAPI](https://example.com/openapi.json): full request and response contract
```

### Markdown mirror (informative)

```html
<!-- docs/quickstart.html -->
<!-- A mirror nothing points to is a file nothing fetches. -->
<link rel="alternate" type="text/markdown" href="/docs/quickstart.md">
```

### Underlying standards (informative)

- `llms.txt` — https://llmstxt.org/
- JSON-LD 1.1 — https://www.w3.org/TR/json-ld11/
- Schema.org — https://schema.org/
- `429` / `Retry-After` — [RFC 6585](https://www.rfc-editor.org/rfc/rfc6585)
- Link relations as HTTP headers — [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288)

---

## 3. Act — Let agents act, not just read (`AR-ACT-*`)

**Intent:** reading documentation does not let an agent complete a task. To act, an agent needs an operable interface such as an API, MCP server, SDK, or CLI, plus authentication it can complete. These interfaces still depend on discoverable and readable documentation. This category applies to products that expose programmatic capability.

| ID | Requirement | Level | Best practice |
|----|---|---|---|
| `AR-ACT-01` | Authentication **SHOULD** be completable by an agent: self-serve key generation with documented scopes; for user-delegated access, OAuth 2.0 with discoverable metadata under `/.well-known`. | **SHOULD** | [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414) (authorization server metadata), [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728) (protected resource metadata). |
| `AR-ACT-02` | A public API **SHOULD** be described by a machine-readable OpenAPI contract. | **SHOULD** | Operation IDs, typed responses and errors, `/v1/` versioning, documented rate limits. |
| `AR-ACT-03` | The product **SHOULD** expose an MCP server over Streamable HTTP at `/mcp`. | **SHOULD** | Keep the docs MCP public; gate the product MCP with OAuth — protected-resource metadata at `/.well-known/oauth-protected-resource` ([RFC 9728](https://www.rfc-editor.org/rfc/rfc9728)), with PKCE — and list it in the MCP Registry with a `server.json`. |
| `AR-ACT-04` | An MCP server **MAY** ship a server card for pre-connection discovery. | **MAY** | An emerging convention (SEP-2127, a working-group draft that major hosts have begun to support): ship one if your target hosts read it, but expect the exact path to keep moving. |
| `AR-ACT-05` | Products with a UI **MAY** ship an MCP Apps view (`ui://` resource) so the agent can hand a working surface back to the user. | **MAY** | — |
| `AR-ACT-06` | SDKs and a CLI **SHOULD** be published — the forms agents act in, code and shell. | **SHOULD** | Publish SDKs on npm and PyPI and a CLI; show install and first call in the docs. |

That is the full journey — find, read, act. The last step happens only if the first two did.

### Underlying standards (informative)

- OAuth 2.0 — [RFC 6749](https://www.rfc-editor.org/rfc/rfc6749)
- PKCE — [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636)
- OAuth 2.0 Authorization Server Metadata — [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414)
- OAuth 2.0 Protected Resource Metadata — [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728)
- OpenAPI — https://spec.openapis.org/
- Model Context Protocol — https://modelcontextprotocol.io/
- MCP server cards — SEP-2127 (working-group draft)

---

## Beyond this document

This document covers the main practices, not the full surface of agent readiness. The [ora scanner](https://ora.ai) covers additional agent-readiness checks through its public methodology, per-check breakdown, and leaderboard. The protocol changes as new agent behavior is measured, so checks and weights may change between versions.

Scan any domain at [ora.ai](https://ora.ai), or from the API:

```sh
curl -X POST https://ora.ai/api/scan \
  -H 'Content-Type: application/json' \
  -d '{"url": "example.com"}'
```

---

## Open questions

1. **MCP server card path.** SEP-2127 is a moving working-group draft; `AR-ACT-04` will pin a path once the draft settles.
2. **User-initiated fetchers and `robots.txt`.** These fetchers may not consult `robots.txt` at all; whether the crawl-policy notes should address them separately is open.

---

## References

- **[What agents actually reach](https://ora.ai/blog/what-agents-actually-reach)** — the field report behind the trace numbers in this document. The report draws on a subset of the data used for this spec; the full dataset is in [`data/`](../data/).
- **[The state of agent readiness](https://ora.ai/blog/state-of-agent-readiness-2026)** — the scanner report behind the reachability figure.
- **[ora research](https://ora.ai)** — the ongoing research program behind the protocol.

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | August 2026 | First public version: requirements grounded in the studies, normative levels assigned from measurement. |
| 0.0.1 | April 2026 | Initial skeleton draft (`AR-DISC/CONT/CAP/AUTH/COMM` categories, all levels TBD); superseded and identifiers retired. |

---

## License

MIT.
