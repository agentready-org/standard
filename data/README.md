# Agent readiness spec - dataset

The measurement data behind **"Make your site readable by AI agents"** - the
agent readiness spec, written by the [ora.ai](https://ora.ai) research lab in
collaboration with **Vercel**. Every measured number in the spec derives from
the two CSV files in this folder. The spec is hosted at
[agentready.org](https://agentready.org).

```
data/
├── traces.csv        1,033 real agent runs across 25 public product sites
└── fetchability.csv  190 deterministic fetch probes, 19 site configurations
```

## Dataset metadata

| | |
|---|---|
| Agent runs | 1,033 (one row per run) |
| Sites | 25 public product sites |
| Models | claude-haiku-4-5 (327), claude-sonnet-4-6 (236), gpt-5.4 (236), claude-fable-5 (234) |
| Harnesses | claude-agent-sdk (541), eve (492) |
| Collected | June-August 2026 |
| Fetchability probes | 19 configurations x 5 topics x 2 client types = 190 |

Each run placed an agent in an isolated environment with a realistic task
against one site - find the pricing, look up the rate limits, integrate the
API - and traced every tool call and fetched page, turn by turn. Sites
covered: ahrefs, affirm, airtable, asana, attio, basecamp, circleci, coda,
confluent, datadog, docusign, elevenlabs, hubspot, miro, monday, neon,
netlify, notion, ora.ai, snowflake, stripe, telnyx, twilio, vultr, zapier.

## data/traces.csv

One row per run. Column groups:

- **Identity** - `run_id`, `domain`, `model`, `harness`
- **Surfaces reached** (0/1) - homepage, docs, sitemap, llms.txt,
  .well-known, openapi.json, AGENTS.md, web search
- **Navigation** - whether the homepage was the first fetch, whether the next
  hop was a docs page, docs pages fetched
- **Fetch format** - web fetches, fetches with an explicit format, fetches
  requesting markdown
- **Discovery-file linkage** - per file: times fetched, and how many of those
  arrived through a link rather than a guessed path
- **llms.txt steering** - whether a run that read llms.txt later fetched a
  page it lists
- **Answer provenance** - whether the final answer contains code lifted from
  a fetched page, and which fetched page the answer's wording traces to
  (docs, llms.txt, homepage, other site page, external page)
- **Site facts** - `site_ships_*`: whether the run's site ships llms.txt,
  openapi.json, or AGENTS.md (live probes with content checks), so usage
  rates can be computed only over sites where the artifact exists

Blank cells mean not-applicable, never missing data - for example, a run
that never reached the homepage has no "first fetch" value, and a subset of
runs comes from a trace format without link attribution, so their linkage
columns are blank and rates skip them.

## data/fetchability.csv

A controlled experiment on what makes a page's answer extractable. One
documentation site was served under **19 configurations**, changing one
feature at a time - adding files like llms.txt, sitemap.xml, JSON-LD or
AGENTS.md, removing structure like headings, or changing access with
redirects, a JavaScript-only shell, or an agent-UA block. Every page carries
a unique planted answer string, and each configuration is probed by two
clients: a plain non-JavaScript fetch and a JavaScript-executing one. A probe
succeeds if the returned content contains the answer.

| Configuration | plain-fetch | js-fetch |
|---|---|---|
| js-only (answer inside a JS payload) | fails | succeeds |
| bot-block, hostile (403 to agent UAs) | fails | fails |
| the other 16 configurations | succeeds | succeeds |

The grid is exhaustive and deterministic: every configuration x topic x
client cell is tested, the same input always gives the same output, and each
configuration differs from the baseline by exactly one feature.

## License

MIT - see `LICENSE`.

## Source

Built and published by the [ora.ai](https://ora.ai) research lab, the
research program behind the ora agent-readiness scanner and leaderboard.
