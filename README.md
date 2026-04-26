# AgentReady Standard

**A proposed open standard for making software systems ready for AI agents.**

[![AgentReady](https://img.shields.io/badge/AgentReady-Standard-blue)](https://www.agentready.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## What is AgentReady?

AgentReady is an open standard that defines what it means for a software system — an API, web service, application, or platform — to be fully accessible and interoperable with AI agents. Just as "mobile-ready" transformed how we build websites for smartphones, AgentReady defines a clear, measurable bar for systems designed to work seamlessly with autonomous AI agents.

AI agents are software programs that can perceive their environment, make decisions, and take actions to achieve goals — often by calling external services, reading data, and executing multi-step workflows. As AI agents become central to how users interact with software, systems that are not designed with agent-readiness in mind create friction, security risks, and unpredictable behavior.

AgentReady sets the requirements that allow agents to:
- **Discover** what a service can do
- **Authenticate** safely and reliably
- **Interact** through well-structured, machine-readable interfaces
- **Recover** gracefully from errors
- **Operate** within defined safety constraints

---

## Why It Matters

| Without AgentReady | With AgentReady |
|--------------------|-----------------|
| Agents scrape HTML or parse unstructured text | Agents use structured, machine-readable APIs |
| Authentication is brittle or unsupported | Agents use dedicated, scoped credentials |
| No capability discovery | Services declare capabilities in a standard manifest |
| Unpredictable error handling | Standardized, actionable error responses |
| No rate-limit transparency | Agents receive quota metadata and back-off signals |
| Ad-hoc safety constraints | Explicit, machine-enforceable safety policies |

---

## Key Principles

1. **Discoverability** — Services must be findable and self-describing for agents.
2. **Structured Interfaces** — Machine-readable APIs are a first-class concern, not an afterthought.
3. **Delegated Trust** — Authentication systems accommodate both human users and autonomous agents with appropriately scoped permissions.
4. **Transparency** — Agents receive honest, complete feedback about what succeeded, what failed, and why.
5. **Safety by Default** — Services declare what agents may and may not do, and enforce those constraints server-side.
6. **Interoperability** — AgentReady is protocol-agnostic and works with REST, GraphQL, gRPC, MCP, and other standards.

---

## Certification Levels

The AgentReady standard defines three certification levels:

| Level | Name | Description |
|-------|------|-------------|
| **Level 1** | Discoverable | The service is discoverable by agents and provides machine-readable capability metadata. |
| **Level 2** | Interoperable | The service exposes structured APIs, standardized authentication, and actionable error responses. |
| **Level 3** | Agent-Native | The service is fully optimized for agent use, including context/session management, safety constraints, and agent-specific tooling. |

For the full specification of each level's requirements, see [SPEC.md](SPEC.md).

---

## Getting Started

### 1. Read the Specification

Start with [SPEC.md](SPEC.md) to understand the full requirements for each certification level.

### 2. Assess Your System

Use the AgentReady checklist to evaluate where your system stands today:

- [ ] Does your service expose an `agent.json` capability manifest?
- [ ] Is your API documented with a machine-readable schema (OpenAPI, GraphQL schema, etc.)?
- [ ] Do you support agent-scoped authentication (API keys, OAuth with agent scopes)?
- [ ] Are your error responses structured and actionable?
- [ ] Do you expose rate-limit metadata in response headers?
- [ ] Do you publish an agent policy (`agent-policy.json` or equivalent)?
- [ ] Do you support stateful sessions or context windows for agents?

### 3. Implement Requirements

Work through the requirements in SPEC.md for the certification level you are targeting. The specification includes both normative requirements (MUST / MUST NOT / SHOULD) and implementation guidance.

### 4. Certify Your Implementation

Once you believe your implementation meets the requirements for a given level, you can submit it for community review. See [CONTRIBUTING.md](CONTRIBUTING.md) for details on the certification process.

---

## Ecosystem Compatibility

AgentReady is designed to complement, not replace, existing standards:

- **[OpenAPI / Swagger](https://www.openapis.org/)** — AgentReady builds on OpenAPI for API documentation.
- **[OAuth 2.0](https://oauth.net/2/)** — AgentReady extends OAuth patterns with agent-specific scopes.
- **[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)** — AgentReady Level 3 is compatible with MCP tool definitions.
- **[robots.txt](https://www.robotstxt.org/)** — AgentReady extends the robots.txt tradition with `agent.json` for richer capability declarations.
- **[JSON-LD / Schema.org](https://schema.org/)** — Structured data patterns used for capability descriptions.

---

## Repository Structure

```
standard/
├── README.md        ← This file: overview and getting started
├── SPEC.md          ← The full technical specification
└── CONTRIBUTING.md  ← How to contribute and the certification process (coming soon)
```

---

## Versioning

The AgentReady standard follows [Semantic Versioning](https://semver.org/). This document describes **AgentReady Standard v0.1.0** (draft).

Breaking changes to the specification will increment the major version number. Backward-compatible additions will increment the minor version. Clarifications and errata will increment the patch version.

---

## Contributing

AgentReady is an open, community-driven standard. Contributions are welcome in the form of:

- **Issues** — Bug reports, unclear requirements, missing use cases
- **Pull Requests** — Proposed changes to the specification
- **Discussions** — Design questions, ecosystem compatibility, implementation experiences

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.

---

## License

The AgentReady Standard is released under the [MIT License](LICENSE).

---

## Contact

- Website: [https://www.agentready.org/](https://www.agentready.org/)
- GitHub: [https://github.com/agentready-org/standard](https://github.com/agentready-org/standard)
