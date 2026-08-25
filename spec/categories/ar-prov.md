# AR-PROV — Agent Provisioning Readiness
### A proposed category extension to the AgentReady standard

**Status:** Draft · **Version:** 0.1.0 (date-based revisions thereafter) · **License:** MIT
**Editors:** AINative Studio · **Intended venue:** `agentready-org/standard` (upstream) + AINative reference namespace
**Conformance keywords** (MUST, SHOULD, MAY) are used per RFC 2119 / RFC 8174.

---

## Abstract

AR-PROV defines what it means for an online surface to be **provisioning-ready**: an AI agent, acting under verifiable authorization from a human, can **create and configure a new account, accept machine-readable terms, and receive scoped credentials** — without a human completing a form. It extends the AgentReady categories (`AR-DISC`, `AR-CONT`, `AR-CAP`, `AR-AUTH`, `AR-COMM`) with a sixth, `AR-PROV`, that sits one rung above commerce on the agent-readiness ladder.

---

## 1. Motivation — the gap this fills

The existing categories take an agent from *finding* a surface to *paying* it:

- `AR-DISC` / `AR-CONT` / `AR-CAP` — discovery, comprehension, capability exposure.
- `AR-AUTH` — **delegated access to an account a human already has** (OAuth 2.0 + PKCE, OIDC, RFC 8414/9728, Web Bot Auth).
- `AR-COMM` — **payment** (x402, ACP, UCP, MPP).

None covers the step between "agent has discovered you" and "agent can act as a customer": **creating the account in the first place.** Today an agent that wants to use a new service on a user's behalf must fall back to driving a human-oriented signup form in a browser — brittle, unauditable, and explicitly outside every current standard. AR-PROV closes that gap with a discoverable, consent-bound, auditable provisioning surface.

> **The one-line distinction:** `AR-AUTH` is *"an agent borrows access to an account a human already has."* `AR-PROV` is *"an agent creates and configures a new account, autonomously, under verifiable authorization."*

**Non-goal (alignment with AgentReady philosophy):** AR-PROV defines **conformance**, not a score, tier, or badge. Grading is explicitly out of scope and left to implementers.

---

## 2. Terminology & roles

- **Provider** — the surface offering provisionable accounts/services.
- **Principal** — the human (or organization) on whose behalf provisioning occurs.
- **Agent** — the autonomous client acting for the Principal.
- **Mandate** — a verifiable, scoped, time-bounded credential in which the Principal authorizes the Agent to provision specific resources under specific constraints.
- **Provisioning** — creating a new account/workspace and the configuration/credentials needed to use it.

---

## 3. Discovery surface

### 3.1 The provisioning profile (`AR-PROV-01`)
A conformant Provider MUST publish a profile document at:

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
    "spec_version": { "type": "string", "examples": ["0.1.0"] },
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

## 4. Conformance levels

| Level | Name | What it proves |
|---|---|---|
| **L1** | **Declared** | Discoverable provisioning intent + machine-readable terms/pricing. |
| **L2** | **Programmatic** | Account creation + credential issuance via documented machine-callable endpoints, gated by verifiable consent. |
| **L3** | **Autonomous** | Full provisioning + onboarding completable end-to-end with no human in the loop, under a valid Mandate. |

---

## 5. Requirements

| ID | Level | Requirement |
|---|---|---|
| `AR-PROV-01` | L1 | The Provider MUST publish a valid `/.well-known/provisioning` profile conforming to §3.1. |
| `AR-PROV-02` | L1 | Terms of service and pricing MUST be available in a machine-readable, parseable form. |
| `AR-PROV-03` | L2 | Account creation MUST be available via a documented, machine-callable endpoint. |
| `AR-PROV-04` | L2 | The Provider MUST verify a valid, scoped, unexpired Mandate before provisioning. |
| `AR-PROV-05` | L2 | Credentials MUST be issued programmatically with least-privilege scope matching the Mandate. |
| `AR-PROV-06` | L2 | The Provider SHOULD accept and record an agent identity attestation. |
| `AR-PROV-07` | L3 | Onboarding / initial configuration MUST be completable via the machine interface without a human. |
| `AR-PROV-08` | L3 | Both Principal and Provider MUST be able to revoke a provisioned account and/or Mandate. |
| `AR-PROV-09` | all | Provisioning events MUST be logged and auditable, traceable to the authorizing Mandate. |
| `AR-PROV-10` | all | If the Provider requires step-up/human verification, it MUST signal this in a machine-readable way. |

---

## 6. Security considerations

| Vector | Mitigation |
|---|---|
| Sybil / spam account creation at scale | Mandate bound to a verifiable Principal identity; Provider-declared `rate_per_principal`; optional step-up. |
| Downstream fraud / misuse | Scoped, revocable credentials; spend/scope caps in the Mandate; audit trail. |
| Resource exhaustion / cost amplification | Provider-declared quotas in the profile; provisioning rate limits. |
| Consent forgery / replay | Signature verification + nonce + expiry. |
| Accountability / liability gaps | The auditable Mandate chain establishes who authorized what. |
| PII over-collection | Agent presents only fields the capability schema requires; data minimization SHOULD be enforced. |

---

## 7. Relationship to existing standards

AR-PROV composes: OAuth 2.0 / OIDC (`AR-AUTH`) as the auth substrate; W3C Verifiable Credentials / AP2-style Mandates for consent; Web Bot Auth / A2A agent cards for agent identity; OpenAPI / MCP / A2A for transport. It sits above `AR-COMM` on the ladder: provisioning typically precedes and enables recurring transaction.

---

## 8. Reference implementation

AINative publishes an open reference implementation:

- **Provider side (FastAPI):** serves `/.well-known/provisioning`; implements the four capabilities over REST + MCP transports; verifies Mandates; issues scoped credentials.
- **State & audit (ZeroDB):** stores Mandates, provisioned Principals, issued-credential scopes, and the append-only audit log.
- **Test-first (TDD/BDD):** each capability handler and the Mandate verifier are pure, fixture-tested units.

### 8.1 Worked flow (L3)
1. Agent fetches `/.well-known/provisioning`; reads `terms`/`pricing`.
2. Principal authorizes → Agent obtains a signed, scoped Mandate.
3. Agent calls `account-create` presenting the Mandate + its attestation.
4. Provider verifies Mandate → creates account.
5. Provider issues least-privilege credentials via `credential-issuance`.
6. Agent completes `onboarding` configuration — no human.
7. Provider writes the audit chain; either party may later revoke.

---

## 9. Open questions
- Canonical Mandate serialization — adopt W3C VC data model directly, or a profile of it aligned to AP2?
- Should `terms` acceptance be a separate signed artifact or folded into the Mandate?
- Standard error vocabulary for `AR-PROV-10` step-up responses.
- Registry for `org.agentready.prov.*` capability schemas.

---

*AR-PROV is offered as an upstream contribution to the AgentReady standard and is simultaneously published in the AINative reference namespace.*
