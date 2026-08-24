# Make your site readable by AI agents

> A practical guide to making your website work for the agents that now read it — grounded in real agent runs and a controlled experiment.

**Version:** v1.0 · last updated August 2026
**Canonical site:** https://agentready.org
**Authors:** the [ora.ai](https://ora.ai) research lab, in collaboration with the [Vercel](https://vercel.com) team
**Dataset:** [`data/`](../data/)

---

AI agents visit websites on users' behalf to answer questions, integrate APIs, and complete tasks. Together with the ora.ai research lab, we measured which site features help them succeed.

In the studies, two changes caused agents to fail: hiding answers behind JavaScript and blocking access. Other practices shaped where agents went and which pages their answers were built from. This guide follows the order in which agents encounter a site: **find, read, then act**. Each stage depends on the previous one, and unlinked files are unlikely to be discovered.

## How we know

Numbers in this guide are tagged by source. **[STUDIES]** refers to research from the ora.ai research lab: over 1,000 real agent runs across 25 sites traced turn by turn ([`data/traces.csv`](../data/traces.csv)) and a controlled experiment that toggled one feature at a time ([`data/fetchability.csv`](../data/fetchability.csv)). **[ORA SCANNER]** refers to agent-reachability checks across every scored site. Statements without a tag are recommendations rather than measured findings.

All recommendations in this guide share one prerequisite: the agent must be able to reach the page and find the answer in the returned HTML.

---

## Be reachable and citable

Agents can cite only pages they can discover and fetch. They may receive or recall a URL, follow a link, or find a page through a crawl-built search index. Pages blocked from crawlers cannot enter those indexes; they are absent rather than ranked lower. Blocking can also stop an agent from fetching a page while answering a user.

| Practice | What it does | What the runs show |
|---|---|---|
| Publish the answer as first-party docs | Makes you citable: the page an agent grounds its answer on and names as its source | **[STUDIES]** 82% of answers traced back to a page the agent fetched — and that page was a docs page 47% of the time, more than any other page type. |
| Allow agents and crawlers in `robots.txt` | Declares which crawlers may fetch which paths — the gate to the search indexes | **[ORA SCANNER]** Established agents reached 81–90% of sites. |
| List your pages in a `sitemap.xml` | Maps every page you publish for indexing | One of the files real agents touch least, yet still standard for crawlers and search engines. **[STUDIES]** Fetched directly in 4% of runs. |

To make information citable, publish it on one canonical, current first-party docs page. The number above is why: your docs are the page agents build their answers from.

That covers what to publish; the crawl policy covers who may read it. Write it as one rule for all agents, not an allowlist of named crawlers:

```txt
# robots.txt
# Apply the default policy to current and future agents.
User-agent: *
# Block low-value public paths only. Do not list secret paths.
Disallow: /search/

Sitemap: https://example.com/sitemap.xml
```

The wildcard still leaves you one deliberate choice. The model providers run a separate crawler for each job:

- **Training crawlers** (GPTBot, ClaudeBot)
- **Search-index crawlers** (OAI-SearchBot, Claude-SearchBot)
- **User-initiated fetchers** (ChatGPT-User, Claude-User)

Each obeys its own `robots.txt` rule, so you can block a training crawler — opting out of training — without dropping out of search indexes or agent answers. Two catches: a more specific group such as `User-agent: GPTBot` overrides your `*` group, so audit existing rules; and user-initiated fetchers may not consult `robots.txt` at all.

Then fetch a page with an agent user-agent string to inspect the response:

```sh
curl -iL -A 'Claude-User/1.0' https://example.com/your-page
```

The request should end with a `200` response; intermediate `301` or `308` redirects are acceptable. The returned HTML should contain the answer. A `403`, empty app shell, or JavaScript-only answer prevents fetch-only agents from reading the page.

The curl is not proof either way: bot blockers weigh where a request comes from more than its user-agent string, so your laptop may pass where the real agent is blocked, or the reverse. The dependable test is your server logs. OpenAI and Anthropic publish their crawlers' IP ranges (separate per-bot lists from OpenAI, one combined list from Anthropic) — find those requests and confirm they return `200`.

`llms.txt` belongs in the reading section because an agent can request it only after discovering and reaching the site.

---

## Put the answer where agents read

After reaching a page, an agent must be able to extract the answer from the returned content. In the studies, agents used the same homepage and docs pages as human visitors. The agent-specific files (`llms.txt`, `AGENTS.md`, markdown mirrors, JSON-LD) just help agents find, fetch, and use those same answers.

If your site is client-rendered, getting answers into the initial HTML is a real migration — SSR, prerendering, or a hybrid — but it is the prerequisite for agents that fetch rather than run JavaScript. The machinery beyond that — content negotiation, `.md` endpoints, agent detection, frontmatter — did not change whether agents succeeded in the studies. Links also matter: agents rarely found pages or files that were not linked from content they had already reached.

### Agents read the same pages people do

Where agents go on your site, and what lets them pull the answer once there:

| Practice | What it does | What the runs show |
|---|---|---|
| Homepage in raw HTML | The front door, with real links to docs, product, and pricing | **[STUDIES]** Reached in 69% of runs, and it was the agent's first step in 92% of them; in 59% of those runs the next hop was a docs page. |
| Docs pages that answer | The surface agents actually read — where most tasks get resolved | **[STUDIES]** Reached in 83% of runs and fetched more than any other page type — about 3.4 docs pages per run. |
| Fetchable without JavaScript | The answer is in the initial HTML — server-rendered or prerendered, not injected by a single-page app after load | **[STUDIES]** A JavaScript-hidden answer was one of only two changes that broke an agent. The other was blocking it outright. |
| Fenced code, language-tagged | Turns snippets into examples an agent can lift and use | **[STUDIES]** When an agent's answer included code, 61% of the time it contained lines taken verbatim from a page it fetched on the site. |

### Link the files that describe your site

**[STUDIES]** Agents typically opened these resources after visiting the homepage. Depending on the file type, 86–100% of visits came through links rather than guessed paths. Link each resource from content agents already visited, such as the footer, page metadata like `<link rel="alternate">` in the head, or a resources section.

| File | What it does | What the runs show |
|---|---|---|
| `llms.txt` | A curated, described index of your key pages | **[STUDIES]** Reached via links, not guesses — 86% of its fetches came from a page that pointed to it. One in three agents that read it went on to fetch a page it lists, and 36% drew their final answer from its content. |
| `.well-known/*` | Protocol and metadata discovery | **[STUDIES]** Reached in about 23% of runs across the sites tested. |
| `openapi.json` | Machine-readable API contract | **[STUDIES]** On the sites that ship one, used in 21% of runs. |
| `AGENTS.md` / `SKILLS.md` | Install, auth, and usage in liftable blocks | **[STUDIES]** An emerging convention — few sites ship one yet. Where a site does and links it, we see agents reach for it. |
| JSON-LD | Machine-readable facts and routes in the page | **[STUDIES]** Agents can parse facts straight from the block. Markdown converters may omit script blocks, so repeat critical facts in visible text. |

When shipping an `llms.txt`, make it a lean, described index:

```md
# Acme
> Acme ships a payments API for developers.

## Docs
- [Quickstart](https://example.com/docs/quickstart): first charge in one request
- [Authentication](https://example.com/docs/auth): API keys, scopes, rotation

## API
- [OpenAPI](https://example.com/openapi.json): full request and response contract
```

Inject JSON-LD at strategic places — the homepage above all — so an agent fetching the raw HTML gets your key facts and routes in one machine-readable block.

### Agents request markdown when offered — make it reachable

**[STUDIES]** Agents requested markdown on about 65% of web fetches. When they specified a format, they chose markdown 96% of the time. Format did not determine task success in the studies, so ensure the HTML works before adding a `.md` mirror.

```html
<!-- docs/quickstart.html -->
<!-- A mirror nothing points to is a file nothing fetches. -->
<link rel="alternate" type="text/markdown" href="/docs/quickstart.md">
```

The same relation can also ride as an HTTP `Link:` header, so a CDN can advertise the mirror without touching page heads.

### Return accurate HTTP status codes

Return `404` for a missing path or a valid redirect to a replacement. Do not return `200` for a missing page, even if the body suggests alternatives; agents cannot distinguish that response from a live page. In one observed case, a single-page app returned `200` for every path, making dead URLs appear valid.

The same honesty applies when you throttle: answer with a `429` and a `Retry-After` header ([RFC 6585](https://www.rfc-editor.org/rfc/rfc6585)), not a silent challenge page — agents and crawlers treat `429` as a back-off signal and will return.

By the end of this layer the agent has found you and read you. Whether it can act on what it reads is the final layer — usability.

---

## Let agents act, not just read

Reading documentation does not let an agent complete a task. To act, an agent needs an operable interface such as an API, MCP server, SDK, or CLI, plus authentication it can complete. These interfaces still depend on discoverable and readable documentation.

| Practice | What it does | Best practice |
|---|---|---|
| Auth an agent can get through | The first gate of acting | Self-serve key generation, documented scopes. For user-delegated access, OAuth 2.0 with discoverable metadata under `/.well-known` ([RFC 8414](https://www.rfc-editor.org/rfc/rfc8414), [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728)). |
| Public API with a machine-readable contract | The acting surface itself | OpenAPI with operation IDs, typed responses and errors, `/v1/` versioning, documented rate limits. |
| MCP server | Standard tool protocol for docs search and actions | Serve over Streamable HTTP at `/mcp`. Keep the docs MCP public; gate the product MCP with OAuth — protected-resource metadata at `/.well-known/oauth-protected-resource` ([RFC 9728](https://www.rfc-editor.org/rfc/rfc9728)), with PKCE — and list it in the MCP Registry with a `server.json`. Server cards for pre-connection discovery are an emerging convention (SEP-2127, a working-group draft that major hosts have begun to support): ship one if your target hosts read it, but expect the exact path to keep moving. |
| MCP Apps | Your UI, rendered inside the agent host | If your product has a UI, ship an app view (`ui://` resource) so the agent can hand a working surface back to the user. |
| SDKs and a CLI | The forms agents act in — code and shell | Publish SDKs on npm and PyPI and a CLI; show install and first call in the docs. |

That is the full journey — find, read, act. The last step happens only if the first two did.

---

## Beyond this guide

This guide covers the main practices, not the full surface of agent readiness. The ora scanner covers additional agent-readiness checks through its public methodology, per-check breakdown, and leaderboard. The protocol changes as new agent behavior is measured, so checks and weights may change between guide versions.

Scan any domain at [ora.ai](https://ora.ai), or from the API:

```sh
curl -X POST https://ora.ai/api/scan \
  -H 'Content-Type: application/json' \
  -d '{"url": "example.com"}'
```

Response (abridged):

```json
{
  "score": 72,
  "grade": "B",
  "layers": [
    { "id": "accessibility", "score": 43, "maxScore": 62, "checks": [
      { "id": "content-no-js", "status": "pass", "score": 3, "maxScore": 3 },
      { "id": "markdown-link-alternate", "status": "fail", "score": 0, "maxScore": 1,
        "recommendation": "Advertise a markdown twin with <link rel=\"alternate\" type=\"text/markdown\"> …" }
    ] }
  ]
}
```

## References

- **[What agents actually reach](https://ora.ai/blog/what-agents-actually-reach)** — the field report behind the trace numbers in this guide. The report draws on a subset of the data used for this spec; the full dataset is in [`data/`](../data/).
- **[The state of agent readiness](https://ora.ai/blog/state-of-agent-readiness-2026)** — the scanner report behind the reachability figure.
- **[ora research](https://ora.ai)** — the ongoing research program behind the protocol.

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | August 2026 | First public version. |

## License

MIT.
