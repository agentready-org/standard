# AgentReady

> An open standard for the agentic web — a product implements AgentReady when AI agents can use it from discovery to completion.

**Status:** Draft. Not yet normative.
**Canonical site:** https://agentready.org
**Working draft:** [`spec/draft.md`](spec/draft.md)

---

## What this repo is

The agentic web needs the same kind of baseline that "mobile‑ready" gave the responsive web: a clear, technical answer to "is this product usable by an agent, end to end?" AgentReady is that answer. It is built by composing existing standards — A2A, MCP, OpenAPI, OAuth, llms.txt, and others — into a single conformance surface, so products are evaluated against one bar instead of a dozen.

This repository holds the working text of the standard. The canonical surface for readers is [agentready.org](https://agentready.org); this repo is for editors and contributors who want to propose changes, file errata, or reconcile drafting decisions.

## Status

- **v0.0.1** working draft. No requirement is normative until **v1.0.0**.
- Versioning follows [semver](https://semver.org/). A major bump indicates a breaking change to a normative requirement.

## Underlying standards

AgentReady references, rather than re‑invents, the following:

- [A2A](https://a2aproject.org/) — Agent Card and capability descriptors
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0)
- [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749) / [OpenID Connect](https://openid.net/specs/)
- [llms.txt](https://llmstxt.org/)
- [JSON‑LD](https://www.w3.org/TR/json-ld11/) / [Schema.org](https://schema.org/)
- [Web Bot Auth](https://www.rfc-editor.org/rfc/rfc9421) (HTTP Message Signatures + IETF draft)
- [x402](https://x402.org/)
- [API Catalog (RFC 9727)](https://www.rfc-editor.org/rfc/rfc9727)

## Contributing

- Open an issue for unclear requirements, missing surfaces, or errata.
- Pull requests should edit [`spec/draft.md`](spec/draft.md).
- A `CONTRIBUTING.md` describing the editorial process is forthcoming.

## License

MIT.
