# AgentReady

> An open standard for the agentic web — a product implements AgentReady when AI agents can use it from discovery to completion.

**Canonical site:** https://agentready.org
**Working draft:** [`spec/draft.md`](spec/draft.md)
**Dataset:** [`data/`](data/)

---

## What this repo is

AI agents are becoming first-class visitors of the web: they fetch pages, follow links, read docs, and act on behalf of users. Most products were never built with that audience in mind. The agentic web needs the same kind of baseline that "mobile-ready" gave the responsive web: a clear, technical answer to "is this product usable by an agent, end to end?" AgentReady is that answer — an open standard, evaluated per surface, from discovery to completion.

Unlike most standards, AgentReady is grounded in measurement. Every measured claim in the spec derives from real data, published in this repository. The canonical, readable surface of the spec is [agentready.org](https://agentready.org); this repo is where the text is drafted and versioned, and where the underlying dataset lives so anyone can reproduce or challenge the numbers.

The research behind the spec was conducted by the **[ora.ai](https://ora.ai) research lab**, and the spec was written in collaboration with the **[Vercel](https://vercel.com) team**.

## Repository layout

| Path | What it holds |
|---|---|
| [`spec/draft.md`](spec/draft.md) | The working text of the standard — section structure, `AR-*` requirement identifiers, and open questions. |
| [`data/`](data/) | The measurement data behind the spec, with its own [README](data/README.md) documenting every column. |

## The data

Two CSV files, produced by the ora.ai research lab, back every measured number in the spec:

- **[`data/traces.csv`](data/traces.csv)** — 1,033 real agent runs across 25 public product sites (Stripe, Notion, Datadog, Twilio, and others). Each run placed an agent in an isolated environment with a realistic task — find the pricing, look up the rate limits, integrate the API — and traced every tool call and fetched page, turn by turn. Runs span four models (claude-haiku-4-5, claude-sonnet-4-6, gpt-5.4, claude-fable-5) and two harnesses (claude-agent-sdk, eve), collected June–August 2026.
- **[`data/fetchability.csv`](data/fetchability.csv)** — a controlled experiment on what makes a page's answer extractable: one documentation site served under 19 configurations, changing one feature at a time (llms.txt, sitemap.xml, JSON-LD, AGENTS.md, heading structure, redirects, a JavaScript-only shell, an agent-UA block), probed by both a plain fetch and a JavaScript-executing client. 190 deterministic probes in total.

See [`data/README.md`](data/README.md) for the full column reference and methodology.

## Status

- The spec text in this repo is a **working draft**. No requirement is normative until v1.0.0.
- Versioning follows [semver](https://semver.org/). A major bump indicates a breaking change to a normative requirement.
- Where this repo and [agentready.org](https://agentready.org) diverge, the site wins until reconciliation lands here.

## Contributing

- Open an issue for unclear requirements, missing surfaces, errata, or questions about the data.
- Pull requests against the spec should edit [`spec/draft.md`](spec/draft.md).
- Challenges to a measured number are welcome — the dataset is in [`data/`](data/) precisely so the numbers can be checked.

## License

MIT — see [`data/LICENSE`](data/LICENSE) for the dataset. © 2026 era labs (ora.ai).
