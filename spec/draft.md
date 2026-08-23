# AgentReady — Working Draft

> **Status:** DRAFT v0.0.1 — non‑normative. Subject to change.
> **Canonical site:** https://agentready.org

---

## About this draft

This file is the working text behind [agentready.org](https://agentready.org). It exists for editors and contributors to the standard. The site is the canonical surface for readers; this repository is where the text is drafted, reviewed, and versioned.

This draft is deliberately a skeleton. Section structure, requirement identifiers, and the standards each requirement leans on are intended to be stable. The normative wording of every requirement (what exactly an implementer **MUST** do) is **TBD** until the project resolves the open questions at the bottom of this document and cuts a v1.0.0.

**Editor:** AgentReady project — https://github.com/agentready-org

**Versioning policy.** This draft follows [Semantic Versioning](https://semver.org/).

- A **major** version bump indicates a breaking change to a normative requirement.
- A **minor** version bump indicates a backward‑compatible addition or refinement.
- A **patch** bump indicates clarifications, editorial fixes, and errata.

No requirement in this document is normative until v1.0.0.

---

## Goals and non‑goals

### Goals

- Define a single, surface‑oriented bar for "an agent can use this product end to end."
- Compose existing, real standards (A2A, MCP, OpenAPI, OAuth, OIDC, llms.txt, x402, …) rather than re‑specify them.
- Provide stable identifiers (`AR-*`) so that conformance claims, errata, and tooling can refer to specific requirements without ambiguity.
- Stay implementable: if a requirement cannot be satisfied today by composing public standards, it does not belong in this document.

### Non‑goals

- **Tiered conformance.** AgentReady has no Bronze/Silver/Gold, no numbered tiers, and no readiness grade. Surfaces either conform or they do not.
- **Badges and trust marks.** Issuing or governing visual badges is out of scope for this text.
- **A new manifest format.** AgentReady does not introduce its own bespoke well‑known JSON manifest, capability schema, or tool‑definition schema. Where a real standard exists, this draft references it.
- **Defining how agents are built.** This document is about products, not agents. It does not constrain LLM behavior, planning, or reasoning.

---

## Conventions

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they appear in all capitals.

Each requirement carries a stable identifier of the form:

```
AR-<CATEGORY>-NN
```

where `<CATEGORY>` is one of `DISC`, `CONT`, `CAP`, `AUTH`, `COMM` (matching the five categories below) and `NN` is a zero‑padded sequence number scoped to that category.

Identifier policy:

- Identifiers are **preserved across versions**. A requirement may be revised, marked SHOULD/MUST/MAY, deprecated, or removed, but its identifier is never reused for a different requirement.
- A removed requirement's identifier is retired, not recycled.
- New requirements take the next unused number in their category.

This identifier policy matches the one described on the canonical site.

---

## Conformance

A product conforms to AgentReady when it implements every **MUST** requirement that applies to the surfaces it exposes.

There are no tiers, no badges, and no readiness grades. The standard is a single bar, evaluated per surface.

### Surfaces

A **surface** is a distinct interface a product exposes that an agent can interact with. The non‑exhaustive list of surface types this draft anticipates:

- An **HTTP API** (REST, JSON‑RPC, GraphQL, etc.)
- A **public website** (HTML pages an agent might read or act on)
- A **Model Context Protocol (MCP) server**
- An **A2A endpoint**
- A **storefront** (a surface that accepts machine‑initiated payment)

A closed, normative taxonomy of surfaces is **TBD** (see Open questions).

### Per‑surface evaluation

Each requirement applies to a specific surface type. For example:

- `AR-CAP-02` (OpenAPI) applies to HTTP API surfaces, not to website surfaces.
- `AR-CONT-02` (Markdown content negotiation) applies to website surfaces, not to MCP server surfaces.

A product is conformant overall when every surface it exposes is conformant for that surface type. A product that exposes only an HTTP API is **not** required to satisfy website‑surface requirements; it is, however, required to satisfy every applicable HTTP‑API‑surface requirement.

### Worked example (informative)

Consider a product that exposes:

1. A public marketing website at `https://example.com/`.
2. An HTTP API at `https://api.example.com/`.
3. An MCP server at `https://mcp.example.com/`.

Conformance is evaluated three times — once per surface — against the requirements that apply to each surface type:

- The website surface is evaluated against website‑applicable requirements (e.g. `AR-DISC-*`, `AR-CONT-*`).
- The HTTP API surface is evaluated against HTTP‑API‑applicable requirements (e.g. `AR-CAP-02`, the relevant `AR-AUTH-*` rows).
- The MCP server surface is evaluated against MCP‑applicable requirements (e.g. `AR-CAP-01`).

The product is conformant overall iff each surface is conformant for its type. A failure on the MCP surface does not retroactively un‑conform the website surface, and vice versa — but it does mean the product as a whole cannot claim conformance until the failing surface is fixed (or removed).

The exact mapping from each requirement to the surface type(s) it applies to is **TBD**.

---

## 1. Discoverability  (`AR-DISC-*`)

**Intent:** an agent can find the product and learn what it offers without scraping HTML or guessing endpoints.

| ID | Requirement | Status |
|----|---|---|
| `AR-DISC-01` | The product publishes a `robots.txt` that declares its policy on AI agent access. | **TBD** |
| `AR-DISC-02` | An A2A Agent Card is served at `/.well-known/agent-card.json`. | **TBD** |
| `AR-DISC-03` | An `llms.txt` file is served at the site root. | **TBD** |
| `AR-DISC-04` | One or more sitemaps cover agent‑relevant content. | **TBD** |

### Underlying standards (informative)

- `robots.txt` — evolving practice for AI access; no single normative document yet.
- A2A Agent Card — https://a2aproject.org/
- `llms.txt` — https://llmstxt.org/
- Sitemaps — https://www.sitemaps.org/

Normative wording for each requirement is **TBD**. In particular, the question of whether a missing `robots.txt` is a conformance failure or a permissive default is not yet decided.

---

## 2. Content for Agents  (`AR-CONT-*`)

**Intent:** the same content humans can see is also addressable by machines, without resorting to HTML scraping.

| ID | Requirement | Status |
|----|---|---|
| `AR-CONT-01` | Key pages carry JSON‑LD / Schema.org structured data describing the entities they represent. | **TBD** |
| `AR-CONT-02` | The product supports content negotiation for `Accept: text/markdown` on agent‑relevant URLs. | **TBD** |
| `AR-CONT-03` | Agent‑consumed entities have stable, addressable URLs. | **TBD** |

### Underlying standards (informative)

- Schema.org — https://schema.org/
- JSON‑LD 1.1 — https://www.w3.org/TR/json-ld11/
- HTTP content negotiation — [RFC 7231 §5.3](https://www.rfc-editor.org/rfc/rfc7231#section-5.3)

Normative wording for each requirement is **TBD**. The definition of "key pages" and "agent‑relevant URLs" is part of the surface taxonomy work (see Open questions).

---

## 3. Capabilities  (`AR-CAP-*`)

**Intent:** the programmatic actions a product offers are described in machine‑readable form, so an agent can plan and execute them without bespoke integration.

| ID | Requirement | Status |
|----|---|---|
| `AR-CAP-01` | An MCP server card is served at `/.well-known/mcp/server-card.json` for products that expose an MCP surface. | **TBD** |
| `AR-CAP-02` | HTTP API surfaces are described by an OpenAPI 3.1 (or later) document. | **TBD** |
| `AR-CAP-03` | A2A capability descriptors are provided where an A2A surface is exposed. | **TBD** |
| `AR-CAP-04` | Products that expose multiple HTTP APIs publish an `/.well-known/api-catalog`. | **TBD** |

### Underlying standards (informative)

- Model Context Protocol — https://modelcontextprotocol.io/
- OpenAPI 3.1 — https://spec.openapis.org/oas/v3.1.0
- A2A — https://a2aproject.org/
- API Catalog — [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727)

Normative wording for each requirement is **TBD**. AgentReady does not define its own schema for capability descriptions; it composes the existing ones above.

---

## 4. Identity & Access  (`AR-AUTH-*`)

**Intent:** agents authenticate as agents, with appropriately scoped access, using existing identity standards rather than bespoke schemes.

| ID | Requirement | Status |
|----|---|---|
| `AR-AUTH-01` | The product implements OAuth 2.0 for delegated agent access. | **TBD** |
| `AR-AUTH-02` | The Authorization Code flow is used with PKCE. | **TBD** |
| `AR-AUTH-03` | An OAuth 2.0 Authorization Server Metadata document is served at `/.well-known/oauth-authorization-server`. | **TBD** |
| `AR-AUTH-04` | An OAuth 2.0 Protected Resource Metadata document is served at `/.well-known/oauth-protected-resource`. | **TBD** |
| `AR-AUTH-05` | An OpenID Provider Configuration document is served at `/.well-known/openid-configuration` where OIDC applies. | **TBD** |
| `AR-AUTH-06` | Web Bot Auth is supported via `/.well-known/http-message-signatures-directory`, tracking the IETF draft. | **TBD** |

### Underlying standards (informative)

- OAuth 2.0 — [RFC 6749](https://www.rfc-editor.org/rfc/rfc6749)
- PKCE — [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636)
- OAuth 2.0 Authorization Server Metadata — [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414)
- OAuth 2.0 Protected Resource Metadata — [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728)
- OpenID Connect Core / Discovery — https://openid.net/specs/
- HTTP Message Signatures — [RFC 9421](https://www.rfc-editor.org/rfc/rfc9421)
- Web Bot Auth — IETF Internet‑Draft (in progress)

Normative wording for each requirement is **TBD**. `AR-AUTH-06` is the most volatile of these because the underlying IETF draft is still moving; this draft will pin to a specific draft revision before v1.0.0.

---

## 5. Commerce  (`AR-COMM-*`)

**Intent:** agents can transact on behalf of users with explicit, auditable consent and well‑defined payment semantics.

| ID | Requirement | Status |
|----|---|---|
| `AR-COMM-01` | Surfaces that accept machine‑initiated payment implement the x402 HTTP 402 payment protocol. | **TBD** |
| `AR-COMM-02` | Per‑surface support for ACP / UCP / MPP, where applicable. The exact mapping is **TBD**. | **TBD** |

### Underlying standards (informative)

- x402 — https://x402.org/
- ACP (Agentic Commerce Protocol) — link **TBD**
- UCP — link **TBD**
- MPP — link **TBD**

Normative wording for each requirement is **TBD**. In particular, which of x402, ACP, UCP, MPP is normatively required for which surface type is unresolved (see Open questions).

---

## Open questions

The following items are explicitly unresolved at v0.0.1. Pull requests and issues against any of these are welcome.

1. **ID reconciliation.** Which `AR-*` identifiers are already minted on agentready.org, and how do they map to the identifiers in this draft? Where the site and this draft diverge, the site wins until reconciliation lands.
2. **Normative weight per requirement.** For each requirement above, which is **MUST** vs **SHOULD** vs **MAY** at v1.0.0? This is a separate editorial pass, not a structural change.
3. **Surface taxonomy.** How is "surface" enumerated normatively? A non‑exhaustive list is given under Conformance; a closed taxonomy is **TBD**.
4. **Conformance test suite.** Will an in‑repo reference test suite ship alongside the spec, or will conformance be checked by an external tool? The site reflects the current direction; this draft does not yet commit either way.
5. **Commerce protocol mapping.** Which of x402 / ACP / UCP / MPP is normatively required for which surface type? Are some of these alternatives, and others additive?
6. **`robots.txt` defaults.** Is a missing `robots.txt` a conformance failure for `AR-DISC-01`, or a permissive default?

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 0.0.1 | 2026‑04‑26 | Initial honest‑skeleton draft replacing the prior `SPEC.md`. No requirement is normative. |

---

## License

MIT. A `LICENSE` file at the repository root is a follow‑up.
