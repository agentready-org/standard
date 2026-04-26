# AgentReady Specification

**Version:** 0.1.0 (Draft)  
**Status:** Proposed Standard  
**Published by:** AgentReady Organization  
**Website:** https://www.agentready.org/

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Terminology](#2-terminology)
3. [Design Goals](#3-design-goals)
4. [Certification Levels Overview](#4-certification-levels-overview)
5. [Level 1: Discoverable](#5-level-1-discoverable)
6. [Level 2: Interoperable](#6-level-2-interoperable)
7. [Level 3: Agent-Native](#7-level-3-agent-native)
8. [The Agent Manifest (`agent.json`)](#8-the-agent-manifest-agentjson)
9. [The Agent Policy (`agent-policy.json`)](#9-the-agent-policy-agent-policyjson)
10. [Authentication for Agents](#10-authentication-for-agents)
11. [Structured Error Responses](#11-structured-error-responses)
12. [Rate Limiting and Quotas](#12-rate-limiting-and-quotas)
13. [Safety Constraints](#13-safety-constraints)
14. [Conformance](#14-conformance)
15. [Changelog](#15-changelog)

---

## 1. Introduction

### 1.1 Background

AI agents — autonomous software programs that use large language models (LLMs) or other AI systems to perceive their environment and take actions — are increasingly used to interact with online services, APIs, and data sources. These agents perform tasks on behalf of users: browsing information, submitting forms, calling APIs, reading documents, and executing multi-step workflows.

Most software systems today are designed exclusively for human users. When agents interact with these systems, they encounter friction: unstructured HTML responses, brittle authentication patterns, opaque rate-limiting, undiscoverable capabilities, and no machine-readable safety boundaries. This creates unreliable behavior, security risks, and poor user experiences.

The AgentReady Standard defines a set of requirements that software systems — APIs, web services, applications, and platforms — MUST meet to be considered ready for agent interaction.

### 1.2 Scope

This specification applies to:

- HTTP-based web services and APIs
- Platforms that expose programmatic interfaces to agents
- Services that wish to be discovered and used by AI agents

This specification does **not** define:

- How AI agents are built or how they reason
- Specific LLM behaviors or outputs
- Agent-to-agent communication protocols (though it may interact with such protocols)

### 1.3 Relationship to Other Standards

AgentReady is designed to work alongside existing standards:

- **OpenAPI Specification** (OAS) — Used for API schema documentation (Level 2+)
- **OAuth 2.0 / OIDC** — Used for delegated authentication (Level 2+)
- **robots.txt** — Extended by `agent.json` for richer capability declarations (Level 1+)
- **Model Context Protocol (MCP)** — Compatible tool definition format for Level 3
- **JSON-LD / Schema.org** — Semantic markup patterns used in capability descriptions

---

## 2. Terminology

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

| Term | Definition |
|------|------------|
| **Agent** | An autonomous software program that uses AI to perceive, reason, and take actions in an environment, often on behalf of a human user. |
| **Service** | Any HTTP-accessible software system implementing this specification: an API, web service, application, or platform. |
| **Capability** | A discrete action or operation that a service can perform on behalf of an agent. |
| **Manifest** | A machine-readable document (`agent.json`) describing a service's agent-relevant capabilities. |
| **Policy** | A machine-readable document (`agent-policy.json`) describing what agents are and are not permitted to do. |
| **Agent Credential** | An authentication credential issued specifically for agent use, with appropriately limited scope. |
| **Tool** | A callable capability defined in a structured schema that an agent can invoke programmatically. |
| **Session** | A stateful context maintained across multiple agent interactions. |
| **Operator** | The human or organization that deploys and controls the agent. |
| **User** | The human on whose behalf the agent acts (may or may not be the same as the Operator). |

---

## 3. Design Goals

The AgentReady Standard is guided by the following design goals:

1. **Minimal friction for implementers.** Services should be able to achieve Level 1 conformance with minimal changes to existing infrastructure.

2. **Progressive enhancement.** Each certification level builds on the previous. An implementer can adopt the standard incrementally.

3. **Protocol agnosticism.** The standard is defined in terms of HTTP and JSON semantics and does not require a specific API style (REST, GraphQL, gRPC, etc.).

4. **Safety first.** Safety requirements are explicit and normative at all levels, not optional add-ons.

5. **Human compatibility.** AgentReady requirements do not break human-facing interfaces. Services serve both humans and agents.

6. **Openness.** The standard is developed in the open, with a public process for proposing changes.

---

## 4. Certification Levels Overview

| Requirement Area | Level 1: Discoverable | Level 2: Interoperable | Level 3: Agent-Native |
|---|---|---|---|
| Agent Manifest (`agent.json`) | REQUIRED | REQUIRED | REQUIRED |
| Machine-readable API schema | RECOMMENDED | REQUIRED | REQUIRED |
| Structured error responses | RECOMMENDED | REQUIRED | REQUIRED |
| Agent authentication | OPTIONAL | REQUIRED | REQUIRED |
| Rate-limit headers | OPTIONAL | REQUIRED | REQUIRED |
| Agent policy document | RECOMMENDED | RECOMMENDED | REQUIRED |
| Session / context support | NOT REQUIRED | OPTIONAL | REQUIRED |
| Tool definitions | NOT REQUIRED | OPTIONAL | REQUIRED |
| Safety constraints enforcement | BASIC | STANDARD | ADVANCED |

---

## 5. Level 1: Discoverable

A **Level 1 (Discoverable)** service is findable by agents and provides enough metadata for an agent to determine whether the service is relevant to its task.

### 5.1 Agent Manifest

**5.1.1** A Level 1 service MUST expose an `agent.json` file at the well-known path `/.well-known/agent.json`.

**5.1.2** The `agent.json` file MUST be served with content type `application/json`.

**5.1.3** The `agent.json` file MUST include the fields defined in [Section 8](#8-the-agent-manifest-agentjson) at the Level 1 minimum.

**5.1.4** The `agent.json` file MUST be publicly accessible without authentication.

### 5.2 robots.txt Compatibility

**5.2.1** If the service hosts a `robots.txt` file, it SHOULD include an `Agent-Ready` directive pointing to the `agent.json` manifest:

```
# AgentReady
Agent-Ready: /.well-known/agent.json
```

**5.2.2** If the service does not wish to allow agent access to certain paths, those paths MUST be disallowed in `robots.txt` using the `User-agent: *` or a specific agent identifier.

### 5.3 HTTPS Requirement

**5.3.1** A Level 1 service MUST be accessible over HTTPS. Unencrypted HTTP access is NOT sufficient for AgentReady certification.

### 5.4 Basic Safety

**5.4.1** A Level 1 service SHOULD declare a basic safety statement in the `agent.json` manifest indicating whether agents may perform read-only, state-modifying, or financial operations.

---

## 6. Level 2: Interoperable

A **Level 2 (Interoperable)** service provides structured, machine-readable APIs with standardized authentication, error handling, and rate-limit transparency. An agent can discover, authenticate with, and reliably call the service's capabilities.

Level 2 includes all Level 1 requirements plus the following.

### 6.1 Machine-Readable API Schema

**6.1.1** A Level 2 service MUST publish a machine-readable API schema describing all agent-accessible endpoints.

**6.1.2** The schema MUST be provided in one of the following formats:
- OpenAPI 3.0 or later (JSON or YAML)
- GraphQL Schema Definition Language (SDL)
- JSON Schema with endpoint definitions

**6.1.3** The schema MUST be linked from the `agent.json` manifest via the `api_schema` field.

**6.1.4** The schema MUST include:
- All parameters for each endpoint (names, types, constraints)
- Response schemas for all documented status codes
- Authentication requirements per endpoint

**6.1.5** The schema SHOULD be versioned and include a version field.

### 6.2 Agent Authentication

**6.2.1** A Level 2 service MUST support at least one of the following authentication mechanisms for agents:

- **API Key Authentication** — A static or rotating key passed in the `Authorization` header as `Bearer <key>` or via a service-specific header (`X-API-Key`).
- **OAuth 2.0 Client Credentials** — Machine-to-machine token exchange without user involvement.
- **OAuth 2.0 Authorization Code with PKCE** — For agents acting on behalf of a human user, where the user grants delegated consent.

**6.2.2** Agent credentials MUST be issued with the minimum scope required to perform the declared capabilities. Credentials MUST NOT grant more access than declared in the `agent.json` manifest.

**6.2.3** The service MUST document how agents obtain credentials in the `agent.json` manifest via the `auth` field (see [Section 10](#10-authentication-for-agents)).

**6.2.4** The service MUST support credential rotation or revocation without requiring service downtime.

### 6.3 Structured Error Responses

**6.3.1** A Level 2 service MUST return structured error responses for all 4xx and 5xx HTTP status codes.

**6.3.2** Error responses MUST use the format defined in [Section 11](#11-structured-error-responses).

**6.3.3** Error responses MUST include a machine-readable error code that agents can use for programmatic handling.

**6.3.4** Error responses SHOULD include a human-readable message and a link to relevant documentation.

### 6.4 Rate Limiting and Quota Headers

**6.4.1** A Level 2 service MUST include rate-limit metadata in HTTP response headers for all agent-authenticated requests.

**6.4.2** The headers MUST follow the format defined in [Section 12](#12-rate-limiting-and-quotas).

**6.4.3** When a rate limit is exceeded, the service MUST return HTTP status `429 Too Many Requests` with a `Retry-After` header.

### 6.5 Idempotency Support

**6.5.1** A Level 2 service SHOULD support idempotency keys for state-modifying operations (POST, PUT, PATCH, DELETE).

**6.5.2** If supported, the service MUST document the idempotency key mechanism in the API schema and accept the key via the `Idempotency-Key` request header.

**6.5.3** Duplicate requests with the same idempotency key within the declared idempotency window MUST return the same response as the original request.

---

## 7. Level 3: Agent-Native

A **Level 3 (Agent-Native)** service is fully optimized for agent interaction. It provides stateful sessions, declarative tool definitions, advanced safety policy enforcement, and monitoring capabilities that make it a first-class citizen in multi-agent workflows.

Level 3 includes all Level 1 and Level 2 requirements plus the following.

### 7.1 Tool Definitions

**7.1.1** A Level 3 service MUST expose structured tool definitions that describe each callable capability as a discrete, invocable unit.

**7.1.2** Tool definitions MUST be expressed in one of the following formats:
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) tool schema
- OpenAI Function Calling schema
- AgentReady Tool Definition schema (defined in Appendix A)

**7.1.3** Tool definitions MUST be linked from the `agent.json` manifest via the `tools` field.

**7.1.4** Each tool definition MUST include:
- A unique `name` (alphanumeric and underscores, no spaces)
- A `description` suitable for inclusion in an LLM prompt
- A JSON Schema for `parameters`
- A JSON Schema for the `returns` value
- A `side_effects` declaration indicating whether the tool modifies state

### 7.2 Session and Context Management

**7.2.1** A Level 3 service MUST support stateful sessions that persist context across multiple agent interactions.

**7.2.2** Sessions MUST be identified by a `session_id` returned in the response to the first request in a session.

**7.2.3** The service MUST accept a `session_id` in subsequent requests to associate them with an existing session.

**7.2.4** Sessions MUST have a declared TTL (time-to-live), after which the session expires and context is cleared.

**7.2.5** The service MUST provide an endpoint for agents to explicitly terminate a session.

**7.2.6** Session state MUST NOT be shared across different agents or users without explicit consent.

### 7.3 Agent Policy Enforcement

**7.3.1** A Level 3 service MUST publish an `agent-policy.json` document as defined in [Section 9](#9-the-agent-policy-agent-policyjson).

**7.3.2** The service MUST enforce the constraints declared in `agent-policy.json` server-side. Policy enforcement MUST NOT rely solely on client-side (agent) compliance.

**7.3.3** The service MUST return a structured error response when an agent request violates a policy constraint, including the specific policy rule that was violated.

### 7.4 Observability and Audit

**7.4.1** A Level 3 service MUST maintain an audit log of all agent-authenticated requests, including:
- Timestamp
- Agent credential identifier (not the credential itself)
- Tool or endpoint called
- Parameters (excluding sensitive values)
- Response status

**7.4.2** The audit log MUST be accessible to the Operator who issued the agent credential.

**7.4.3** The service SHOULD provide a mechanism for agents or Operators to query recent activity.

### 7.5 Human-in-the-Loop (HITL) Support

**7.5.1** A Level 3 service SHOULD support Human-in-the-Loop confirmation for high-risk operations (e.g., financial transactions, irreversible actions).

**7.5.2** If HITL is supported, the service MUST return HTTP status `202 Accepted` with a `confirmation_required` flag and a confirmation token when a HITL-gated operation is requested.

**7.5.3** The confirmation endpoint MUST be documented in the `agent.json` manifest.

---

## 8. The Agent Manifest (`agent.json`)

The Agent Manifest is a JSON document that describes a service's agent-relevant metadata and capabilities. It MUST be served at `/.well-known/agent.json`.

### 8.1 Schema

```json
{
  "$schema": "https://www.agentready.org/schemas/agent-manifest/v1.json",
  "agentready_version": "1",
  "name": "string (required)",
  "description": "string (required)",
  "version": "string (required, semver)",
  "homepage": "string (URL, required)",
  "contact": {
    "email": "string (optional)",
    "url": "string (URL, optional)"
  },
  "certification_level": "integer (1, 2, or 3, required)",
  "api_schema": "string (URL, required at Level 2+)",
  "tools": "string (URL to tool definitions, required at Level 3)",
  "auth": {
    "type": "string (none|api_key|oauth2_client_credentials|oauth2_authorization_code)",
    "token_url": "string (URL, required for OAuth2)",
    "authorization_url": "string (URL, required for oauth2_authorization_code)",
    "scopes": {
      "scope_name": "string (description)"
    },
    "api_key_header": "string (header name, required for api_key type)"
  },
  "policy": "string (URL to agent-policy.json, recommended)",
  "confirmation_endpoint": "string (URL, required if HITL supported)",
  "capabilities": [
    {
      "name": "string",
      "description": "string",
      "endpoint": "string (relative URL)",
      "method": "string (HTTP method)",
      "requires_auth": "boolean",
      "side_effects": "boolean"
    }
  ],
  "safety": {
    "allows_read": "boolean",
    "allows_write": "boolean",
    "allows_financial_operations": "boolean",
    "allows_external_requests": "boolean",
    "max_session_duration_seconds": "integer"
  }
}
```

### 8.2 Minimal Level 1 Example

```json
{
  "$schema": "https://www.agentready.org/schemas/agent-manifest/v1.json",
  "agentready_version": "1",
  "name": "Example Service",
  "description": "A sample service demonstrating AgentReady Level 1 conformance.",
  "version": "1.0.0",
  "homepage": "https://example.com",
  "certification_level": 1,
  "safety": {
    "allows_read": true,
    "allows_write": false,
    "allows_financial_operations": false,
    "allows_external_requests": false
  }
}
```

### 8.3 Full Level 3 Example

```json
{
  "$schema": "https://www.agentready.org/schemas/agent-manifest/v1.json",
  "agentready_version": "1",
  "name": "Acme API",
  "description": "Acme's API enables agents to manage inventory, process orders, and generate reports.",
  "version": "3.2.1",
  "homepage": "https://api.acme.com",
  "contact": {
    "email": "agents@acme.com",
    "url": "https://api.acme.com/support"
  },
  "certification_level": 3,
  "api_schema": "https://api.acme.com/.well-known/openapi.json",
  "tools": "https://api.acme.com/.well-known/tools.json",
  "auth": {
    "type": "oauth2_client_credentials",
    "token_url": "https://auth.acme.com/oauth2/token",
    "scopes": {
      "inventory:read": "Read inventory data",
      "orders:write": "Create and modify orders",
      "reports:read": "Generate and read reports"
    }
  },
  "policy": "https://api.acme.com/.well-known/agent-policy.json",
  "confirmation_endpoint": "https://api.acme.com/v1/confirmations",
  "safety": {
    "allows_read": true,
    "allows_write": true,
    "allows_financial_operations": true,
    "allows_external_requests": false,
    "max_session_duration_seconds": 3600
  }
}
```

---

## 9. The Agent Policy (`agent-policy.json`)

The Agent Policy is a JSON document that declares what agents are and are not permitted to do. It MUST be served at a URL declared in `agent.json` (conventionally `/.well-known/agent-policy.json`).

### 9.1 Schema

```json
{
  "$schema": "https://www.agentready.org/schemas/agent-policy/v1.json",
  "version": "string (semver)",
  "effective_date": "string (ISO 8601 date)",
  "rules": [
    {
      "id": "string (unique rule identifier)",
      "description": "string",
      "effect": "allow | deny",
      "actions": ["string (capability names or HTTP method+path patterns)"],
      "conditions": {
        "max_requests_per_hour": "integer (optional)",
        "max_data_per_request_bytes": "integer (optional)",
        "allowed_ip_ranges": ["string (CIDR, optional)"],
        "requires_human_confirmation": "boolean (optional)",
        "allowed_scopes": ["string (optional)"]
      }
    }
  ],
  "default_effect": "allow | deny",
  "contact": "string (URL or email for policy questions)"
}
```

### 9.2 Example

```json
{
  "$schema": "https://www.agentready.org/schemas/agent-policy/v1.json",
  "version": "1.0.0",
  "effective_date": "2026-01-01",
  "rules": [
    {
      "id": "deny-bulk-delete",
      "description": "Agents may not perform bulk delete operations.",
      "effect": "deny",
      "actions": ["DELETE /v1/resources/*"]
    },
    {
      "id": "require-confirmation-financial",
      "description": "Financial transactions above $100 require human confirmation.",
      "effect": "allow",
      "actions": ["POST /v1/orders"],
      "conditions": {
        "requires_human_confirmation": true,
        "max_requests_per_hour": 10
      }
    }
  ],
  "default_effect": "allow",
  "contact": "https://acme.com/agent-policy"
}
```

---

## 10. Authentication for Agents

### 10.1 API Key Authentication

When using API key authentication:

- The service MUST accept keys via the `Authorization: Bearer <key>` header.
- The service MAY also accept keys via a service-specific header (e.g., `X-API-Key`), which MUST be documented.
- API keys MUST have an associated scope that limits what operations they can perform.
- The service MUST support key revocation via an administrative interface.

### 10.2 OAuth 2.0 Client Credentials

When using OAuth 2.0 Client Credentials:

- The service MUST implement the `client_credentials` grant type as defined in [RFC 6749](https://www.rfc-editor.org/rfc/rfc6749).
- Scopes MUST map directly to the capabilities declared in `agent.json`.
- Access tokens MUST have a limited lifetime (RECOMMENDED: 1 hour or less).
- The service MUST support token introspection or JWT validation for performance.

### 10.3 OAuth 2.0 Authorization Code with PKCE

When acting on behalf of a human user:

- The service MUST implement the Authorization Code flow with PKCE as defined in [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636).
- The agent MUST clearly identify itself as an agent during the authorization request.
- The authorization consent screen MUST clearly indicate that access is being granted to an AI agent, not just an application.
- Refresh tokens MUST have configurable expiration and MUST be revocable.

### 10.4 Agent Identity Headers

All AgentReady services SHOULD support and respect the following optional request headers for agent identification:

| Header | Description |
|--------|-------------|
| `X-Agent-ID` | A unique identifier for the agent instance |
| `X-Agent-Version` | The version of the agent software |
| `X-Agent-Purpose` | A brief description of why the agent is making the request |
| `X-Operator-ID` | An identifier for the operator deploying the agent |

These headers are informational and MUST NOT be used as the sole means of authentication.

---

## 11. Structured Error Responses

All Level 2+ services MUST return structured error responses for 4xx and 5xx HTTP status codes.

### 11.1 Error Response Format

```json
{
  "error": {
    "code": "string (machine-readable error code, e.g., RATE_LIMIT_EXCEEDED)",
    "message": "string (human-readable description)",
    "details": "object (optional, additional error-specific context)",
    "request_id": "string (unique identifier for this request, for support)",
    "documentation_url": "string (URL to relevant documentation, optional)",
    "retry_after": "integer (seconds until retry is permitted, for 429 responses)"
  }
}
```

### 11.2 Standard Error Codes

Services SHOULD use the following standard error codes where applicable:

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_REQUEST` | The request is malformed or missing required fields |
| 400 | `INVALID_PARAMETER` | A parameter value is invalid |
| 401 | `UNAUTHENTICATED` | Authentication is required but not provided |
| 401 | `INVALID_CREDENTIAL` | The provided credential is invalid or expired |
| 403 | `UNAUTHORIZED` | The credential is valid but lacks permission |
| 403 | `POLICY_VIOLATION` | The request violates an agent policy rule |
| 404 | `NOT_FOUND` | The requested resource does not exist |
| 409 | `CONFLICT` | The request conflicts with current state |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests; see `retry_after` |
| 429 | `QUOTA_EXCEEDED` | Usage quota exceeded for the period |
| 500 | `INTERNAL_ERROR` | An unexpected server-side error occurred |
| 503 | `SERVICE_UNAVAILABLE` | The service is temporarily unavailable |

### 11.3 Example Error Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded the rate limit of 100 requests per minute.",
    "details": {
      "limit": 100,
      "period": "minute",
      "reset_at": "2026-01-01T12:01:00Z"
    },
    "request_id": "req_abc123def456",
    "documentation_url": "https://api.example.com/docs/rate-limits",
    "retry_after": 42
  }
}
```

---

## 12. Rate Limiting and Quotas

### 12.1 Required Response Headers

Level 2+ services MUST include the following headers in all agent-authenticated responses:

| Header | Description | Example |
|--------|-------------|---------|
| `RateLimit-Limit` | Maximum number of requests allowed in the current window | `100` |
| `RateLimit-Remaining` | Number of requests remaining in the current window | `57` |
| `RateLimit-Reset` | Unix timestamp when the current window resets | `1704067200` |
| `RateLimit-Policy` | Rate limit policy description (optional but RECOMMENDED) | `100;w=60` |

### 12.2 Quota Headers

For services with usage quotas (e.g., monthly API call limits), the following headers SHOULD also be included:

| Header | Description |
|--------|-------------|
| `X-Quota-Limit` | Total quota for the current period |
| `X-Quota-Remaining` | Remaining quota for the current period |
| `X-Quota-Reset` | Unix timestamp when the quota period resets |

### 12.3 Agent-Specific Rate Limits

Services SHOULD apply separate rate limit tiers for agent-authenticated requests versus human-user requests. Agent-specific limits MUST be documented in the `agent.json` manifest or linked documentation.

---

## 13. Safety Constraints

### 13.1 Principle of Least Privilege

**13.1.1** Services MUST issue agent credentials with the minimum scope necessary for the agent's declared purpose.

**13.1.2** Agents MUST NOT be granted access to operations they do not explicitly need. Services SHOULD provide granular scope definitions.

### 13.2 Irreversible Operations

**13.2.1** Services SHOULD require explicit confirmation headers for irreversible operations (e.g., data deletion, account closure).

**13.2.2** Level 3 services with HITL support MUST gate irreversible operations behind human confirmation.

**13.2.3** Services MUST NOT automatically perform cascading deletions based on agent requests without explicit acknowledgement.

### 13.3 Financial Operations

**13.3.1** Services that allow financial operations MUST require a dedicated financial scope in the agent credential.

**13.3.2** Financial operations SHOULD be subject to per-transaction and per-period limits declared in the agent policy.

**13.3.3** Services SHOULD support a dry-run or preview mode for financial operations, returning the expected outcome without executing the transaction.

### 13.4 Data Privacy

**13.4.1** Services MUST NOT expose personally identifiable information (PII) to agents without explicit user consent.

**13.4.2** Services MUST NOT allow agents to exfiltrate bulk data sets without rate limiting and scope restrictions.

**13.4.3** Services SHOULD log all agent access to PII-containing resources.

### 13.5 Prompt Injection Defense

**13.5.1** Services MUST treat all agent-provided inputs as untrusted user input and apply appropriate input validation.

**13.5.2** Services MUST NOT interpret agent-provided strings as instructions or commands unless that is the explicit purpose of the API.

**13.5.3** Services SHOULD validate that agent requests are consistent with the declared capabilities and scopes, and reject anomalous requests.

---

## 14. Conformance

### 14.1 Claiming Conformance

To claim conformance with AgentReady at a given level, a service MUST:

1. Implement all REQUIRED requirements for that level and all lower levels.
2. Publish an `agent.json` manifest that accurately reflects the service's capabilities and certification level.
3. Submit a conformance declaration to the AgentReady registry (when available).

### 14.2 Conformance Testing

The AgentReady organization will provide conformance testing tools that verify:

- Presence and schema validity of `agent.json` and `agent-policy.json`
- API schema linkage and schema validity
- Correct error response format
- Presence of rate-limit headers
- Tool definition validity (Level 3)

### 14.3 Badge and Branding

Conformant services MAY display the AgentReady badge corresponding to their certification level. Badge usage is subject to the AgentReady Trademark Policy.

### 14.4 Revocation

Conformance may be revoked if:

- A material change to the service renders it non-conformant
- The conformance declaration is found to be inaccurate
- The service violates the AgentReady Trademark Policy

---

## 15. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-04-26 | Initial draft release |

---

## Appendix A: AgentReady Tool Definition Schema

For services that do not wish to adopt MCP or OpenAI Function Calling schemas, the following native schema MAY be used for tool definitions:

```json
{
  "$schema": "https://www.agentready.org/schemas/tools/v1.json",
  "tools": [
    {
      "name": "string (snake_case, required)",
      "display_name": "string (human-readable, optional)",
      "description": "string (required, optimized for LLM prompt injection)",
      "version": "string (semver, optional)",
      "endpoint": "string (relative URL, required)",
      "method": "string (HTTP method, required)",
      "parameters": {
        "type": "object",
        "properties": {},
        "required": []
      },
      "returns": {
        "type": "object",
        "properties": {}
      },
      "side_effects": "boolean (required)",
      "idempotent": "boolean (optional, default false)",
      "requires_confirmation": "boolean (optional, default false)",
      "examples": [
        {
          "description": "string",
          "parameters": {},
          "returns": {}
        }
      ]
    }
  ]
}
```

---

## Appendix B: Migration Guide

### From robots.txt to AgentReady Level 1

If your service already uses `robots.txt` to control bot access, achieving Level 1 requires:

1. Create `/.well-known/agent.json` with the minimal Level 1 fields (name, description, version, homepage, certification_level, safety).
2. Add an `Agent-Ready` directive to your `robots.txt` pointing to the manifest.
3. Ensure your service is accessible over HTTPS.

Total effort: typically less than 1 day for most services.

### From OpenAPI to AgentReady Level 2

If your service already has an OpenAPI specification:

1. Complete Level 1 requirements.
2. Add the `api_schema` URL to your `agent.json`.
3. Add agent authentication (API key or OAuth2).
4. Implement structured error responses.
5. Add rate-limit response headers.

Total effort: typically 1–3 days for services with an existing OpenAPI spec and authentication system.

---

*This specification is maintained by the AgentReady Organization. For questions, corrections, or contributions, visit [https://github.com/agentready-org/standard](https://github.com/agentready-org/standard).*
