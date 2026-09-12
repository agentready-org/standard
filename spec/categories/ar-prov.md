# AR-PROV — Agent Provisioning Readiness
### A proposed fourth stage for the AgentReady standard

**Status:** Proposal, not yet part of the normative spec · **Version:** 0.2.0
**Editors:** AINative Studio · **Intended venue:** `agentready-org/standard` (upstream)
**Conformance keywords** (MUST, SHOULD, MAY) are used per RFC 2119 / RFC 8174, matching [`spec/spec.md`](../spec.md)'s conventions.

> **Alignment note (v0.2.0):** this proposal was rewritten to extend the current v1.0 spec (`AR-FIND` / `AR-READ` / `AR-ACT`, [`spec/spec.md`](../spec.md)) rather than the `AR-DISC/CONT/CAP/AUTH/COMM` skeleton. That skeleton was the project's original v0.0.1 draft; per the spec's own changelog it was **superseded and its identifiers retired** when v1.0 shipped in August 2026. AR-PROV now composes `AR-ACT` (this document's closest existing neighbor) instead of a retired namespace, and drops the L1/L2/L3 conformance-tier model in favor of the spec's actual MUST/SHOULD/MAY levels — the spec's own non-goals section is explicit that scoring and tiers are out of scope for this document and belong to the ora scanner.

---

## Abstract

AR-PROV defines what it means for a surface to be **provisioning-ready**: an AI agent, acting under verifiable authorization from a human, can **create and configure a new account, accept machine-readable terms, and receive scoped credentials** — without a human completing a signup form. It proposes a fourth stage, `AR-PROV-*`, that follows `AR-ACT` in the agent's journey: find, read, act, *provision*.

---

## 1. Motivation — the gap this fills

The current spec takes an agent from *finding* a surface to *acting* on it:

- `AR-FIND` — reachability: can an agent discover and fetch the surface at all.
- `AR-READ` — comprehension: can an agent extract an answer from what it fetched.
- `AR-ACT` — programmatic capability: authentication to an *existing* account, an API/MCP/SDK/CLI to call it with.

`AR-ACT-01` covers authentication — "self-serve key generation" for an agent's own account, or OAuth for **delegated access to an account a human already has**. Neither covers the step before that: **creating the account in the first place, autonomously.** Today an agent that wants to start using a new service on a user's behalf still falls back to driving a human-oriented signup form in a browser — brittle, unauditable, and outside every current standard this spec composes. AR-PROV closes that gap.

> **The one-line distinction from `AR-ACT-01`:** self-serve key generation and OAuth delegation both assume *an account already exists* (the agent's own, or a human's). AR-PROV is *"an agent creates a new account, autonomously, under verifiable authorization from a human who does not yet have one there."*

**Non-goal (unchanged from the parent spec):** AR-PROV defines requirements, not a score, tier, or badge. As with `AR-FIND/READ/ACT`, scoring and per-check weighting are left to implementers such as the ora scanner.

---

## 2. Terminology & roles

Consistent with the parent spec's use of "site," "product," and "agent":

- **Provider** — the site or product offering provisionable accounts/services (the spec's "site"/"product").
- **Principal** — the human (or organization) on whose behalf provisioning occurs.
- **Agent** — the autonomous client acting for the Principal (the spec's "agent").
- **Mandate** — a verifiable, scoped, time-bounded credential in which the Principal authorizes the Agent to provision specific resources under specific constraints.
- **Provisioning** — creating a new account/workspace and the configuration/credentials needed to use it.

---

## 3. Discovery surface

### 3.1 The provisioning profile (`AR-PROV-01`)

A conformant Provider publishes a profile document at:

```
/.well-known/provisioning
```

**Profile JSON Schema (abridged):**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://agentready.org/schemas/ar-prov/profile.json",
  "type": "object",
  "required": ["spec_version", "provider", "capabilities", "consent"],
  "properties": {
    "spec_version": { "type": "string", "examples": ["0.2.0"] },
    "provider": {
      "type": "object",
      "required": ["name", "terms_uri"],
      "properties": {
        "name": { "type": "string" },
        "terms_uri": { "type": "string", "format": "uri" },
        "pricing_uri": { "type": "string", "format": "uri" }
      }
    },
    "capabilities": {
      "type": "array",
      "items": { "$ref": "#/$defs/capability" }
    },
    "consent": {
      "type": "object",
      "required": ["models"],
      "properties": {
        "models": {
          "type": "array",
          "items": { "enum": ["signed-mandate", "oauth-delegation"] }
        },
        "mandate_schema_uri": { "type": "string", "format": "uri" }
      }
    },
    "limits": {
      "type": "object",
      "properties": {
        "rate_per_principal": { "type": "string", "examples": ["5/day"] },
        "step_up_possible": { "type": "boolean" }
      }
    }
  },
  "$defs": {
    "capability": {
      "type": "object",
      "required": ["name", "version", "transports"],
      "properties": {
        "name": { "type": "string", "examples": ["org.agentready.prov.account-create"] },
        "version": { "type": "string", "examples": ["2026-06-01"] },
        "transports": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["type", "uri"],
            "properties": {
              "type": { "enum": ["rest", "mcp", "a2a"] },
              "uri": { "type": "string", "format": "uri" },
              "schema_uri": { "type": "string", "format": "uri" }
            }
          }
        }
      }
    }
  }
}
```

### 3.2 Capability schemas

| Capability | Purpose |
|---|---|
| `org.agentready.prov.terms` | Machine-readable terms of service + pricing with explicit acceptance semantics. |
| `org.agentready.prov.account-create` | Agent-initiated account/workspace creation. |
| `org.agentready.prov.credential-issuance` | Programmatic issuance of scoped credentials to the provisioned Principal. |
| `org.agentready.prov.onboarding` | Machine-completable onboarding/initial configuration. |

---

## 4. Requirements (`AR-PROV-*`)

Numbered and leveled the same way as `AR-FIND-*`/`AR-READ-*`/`AR-ACT-*` — a flat, ordered list of MUST/SHOULD/MAY requirements, not tiers. Like `AR-ACT`, this stage applies only to Providers that offer agent-provisionable accounts; it is moot for products an agent cannot yet act on (`AR-ACT` is a prerequisite).

| ID | Requirement | Level |
|----|---|---|
| `AR-PROV-01` | The Provider **SHOULD** publish a valid `/.well-known/provisioning` profile conforming to §3.1, so an agent can discover provisioning support the same way `AR-ACT-01`/`AR-ACT-03` are discovered under `/.well-known`. | **SHOULD** |
| `AR-PROV-02` | Terms of service and pricing **MUST** be available in a machine-readable, parseable form before an agent provisions an account. | **MUST** |
| `AR-PROV-03` | Account creation **SHOULD** be available via a documented, machine-callable endpoint (REST, MCP, or A2A). | **SHOULD** |
| `AR-PROV-04` | The Provider **MUST** verify a valid, scoped, unexpired Mandate before provisioning — an agent **MUST NOT** be able to create an account on a Principal's behalf without one. | **MUST** |
| `AR-PROV-05` | Credentials issued to a newly provisioned account **MUST** be scoped to least privilege matching the Mandate, not a full-access default. | **MUST** |
| `AR-PROV-06` | The Provider **SHOULD** accept and record an agent identity attestation (e.g. Web Bot Auth / A2A agent card) alongside the Mandate. | **SHOULD** |
| `AR-PROV-07` | Onboarding / initial configuration **SHOULD** be completable via the machine interface without a human, when the Provider offers this. | **SHOULD** |
| `AR-PROV-08` | Both the Principal and the Provider **MUST** be able to revoke a provisioned account and/or its Mandate. | **MUST** |
| `AR-PROV-09` | Provisioning events **MUST** be logged and auditable, traceable to the authorizing Mandate. | **MUST** |
| `AR-PROV-10` | If the Provider requires step-up or human verification for a given request, it **MUST** signal this in a machine-readable way rather than silently failing or returning a generic error. | **MUST** |

---

## 5. Security considerations

| Vector | Mitigation |
|---|---|
| Sybil / spam account creation at scale | Mandate bound to a verifiable Principal identity; Provider-declared `rate_per_principal`; optional step-up. |
| Downstream fraud / misuse | Scoped, revocable credentials; spend/scope caps in the Mandate; audit trail. |
| Resource exhaustion / cost amplification | Provider-declared quotas in the profile; provisioning rate limits. |
| Consent forgery / replay | Signature verification + nonce + expiry. |
| Accountability / liability gaps | The auditable Mandate chain establishes who authorized what. |
| PII over-collection | Agent presents only fields the capability schema requires; data minimization SHOULD be enforced. |

---

## 6. Relationship to existing standards

AR-PROV composes, rather than replaces: `AR-ACT-01`'s OAuth 2.0 / OIDC substrate for the delegated-access case; W3C Verifiable Credentials / AP2-style Mandates for consent; Web Bot Auth / A2A agent cards for agent identity (both already referenced informatively by `AR-ACT`); OpenAPI / MCP / A2A for transport, matching `AR-ACT-02`/`AR-ACT-03`. It follows `AR-ACT` in the agent's journey: an agent typically needs to be provisioned before it can authenticate and act.

---

## 7. Reference implementation

AINative publishes an open reference implementation:

- **Provider side (FastAPI):** serves `/.well-known/provisioning`; implements the four capabilities over REST + MCP transports; verifies Mandates; issues scoped credentials.
- **State & audit (ZeroDB):** stores Mandates, provisioned Principals, issued-credential scopes, and the append-only audit log.
- **Test-first (TDD/BDD):** each capability handler and the Mandate verifier are pure, fixture-tested units.

### 7.1 Worked flow

1. Agent fetches `/.well-known/provisioning`; reads `terms`/`pricing`.
2. Principal authorizes → Agent obtains a signed, scoped Mandate.
3. Agent calls `account-create` presenting the Mandate + its attestation.
4. Provider verifies Mandate → creates account.
5. Provider issues least-privilege credentials via `credential-issuance`.
6. Agent completes `onboarding` configuration, if offered — no human.
7. Provider writes the audit chain; either party may later revoke.

---

## 8. Open questions

- Canonical Mandate serialization — adopt W3C VC data model directly, or a profile of it aligned to AP2?
- Should `terms` acceptance (`AR-PROV-02`) be a separate signed artifact or folded into the Mandate?
- Standard error vocabulary for `AR-PROV-10` step-up responses.
- Registry for `org.agentready.prov.*` capability schemas — reuse the MCP Registry pattern `AR-ACT-03` already points to, or a dedicated one?
- Should any `AR-PROV-*` requirement graduate to **MUST** the way `AR-FIND-01`/`AR-READ-01`/`AR-READ-02` did, once real measurement (per the parent spec's evidence-tag convention) shows which failures actually break agents — none of the levels above are backed by `[STUDIES]`-grade data yet, unlike the rest of the spec.

---

*AR-PROV is offered as a proposed contribution to the AgentReady standard for community review, and is simultaneously published in the AINative reference namespace pending upstream discussion.*
