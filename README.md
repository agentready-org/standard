# AgentReady — AR-PROV branch

> An open standard for the agentic web — a product implements AgentReady when AI agents can use it from discovery to completion.

**Canonical site:** https://agentready.org
**Parent spec:** [`spec/spec.md`](spec/spec.md) (v1.0, the normative `AR-FIND`/`AR-READ`/`AR-ACT` standard)
**This branch proposes:** [`spec/categories/ar-prov.md`](spec/categories/ar-prov.md) — `AR-PROV`, a fourth stage covering **agent-driven account provisioning**
**Dataset:** [`data/`](data/)
**Written by:** [ora.ai](https://ora.ai) and [Vercel](https://vercel.com) (parent spec); AINative Studio (this branch's AR-PROV proposal)

---

## What this branch is

This is the `category/ar-prov` branch of a fork of [`agentready-org/standard`](https://github.com/agentready-org/standard), the working repo for the AgentReady standard. Its purpose is to propose **AR-PROV: Agent Provisioning Readiness** — a new, fourth requirement stage for AgentReady, positioned after the existing `AR-FIND` → `AR-READ` → `AR-ACT` journey.

**The gap AR-PROV addresses:** the current spec's `AR-ACT-01` covers authenticating an agent to an account that already exists — either the agent's own self-serve API key, or OAuth-delegated access to a human's existing account. Neither covers the step before that: an agent **creating a brand-new account, autonomously, under verifiable authorization from a human who doesn't have one there yet.** Today that gap is filled by an agent driving a human-oriented signup form in a browser — brittle, unauditable, and outside every standard AgentReady composes. AR-PROV closes it with a discoverable, consent-bound, auditable provisioning surface (a `/.well-known/provisioning` profile, Mandate-based authorization, scoped credential issuance, and an audit trail).

Read the full proposal: [`spec/categories/ar-prov.md`](spec/categories/ar-prov.md).

## Alignment with upstream

This branch was rebased to align with the parent repo's **current** structure rather than an earlier draft it had originally branched from:

- The parent spec shipped **v1.0** in August 2026 (`spec/spec.md`, written by ora.ai and Vercel, grounded in real agent-trace data) using three categories: `AR-FIND`, `AR-READ`, `AR-ACT`.
- An earlier five-category skeleton (`AR-DISC`/`AR-CONT`/`AR-CAP`/`AR-AUTH`/`AR-COMM`) was the project's original v0.0.1 draft. Per the parent spec's own changelog, that skeleton was **superseded and its identifiers retired** when v1.0 shipped.
- AR-PROV originally extended that retired five-category skeleton. It has been rewritten here to extend the real, current `AR-ACT` stage instead, and to use the parent spec's actual MUST/SHOULD/MAY requirement levels rather than a separate L1/L2/L3 conformance-tier scheme (the parent spec's own non-goals explicitly rule out scoring/tiers in this document).
- `data/` (the measured dataset backing the parent spec) and `spec/spec.md` (the real v1.0 text) are restored from upstream on this branch; the abandoned `spec/draft.md` skeleton has been removed.

## Repository layout

| Path | What it holds |
|---|---|
| [`spec/spec.md`](spec/spec.md) | The parent AgentReady spec — `AR-FIND`/`AR-READ`/`AR-ACT`. Unmodified from upstream. |
| [`spec/categories/ar-prov.md`](spec/categories/ar-prov.md) | **This branch's proposal:** `AR-PROV`, a fourth stage for agent-driven provisioning. |
| [`data/`](data/) | The measurement data behind the parent spec, unmodified from upstream — see its own [README](data/README.md). |

## Status

- The parent spec is at **v1.0** (August 2026), unmodified on this branch.
- AR-PROV is a **proposal**, not yet part of the normative spec — see the Status line in [`spec/categories/ar-prov.md`](spec/categories/ar-prov.md).
- Where this repo and [agentready.org](https://agentready.org) diverge, the site wins until reconciliation lands here.

## Contributing

- Feedback on the AR-PROV proposal is welcome as issues or PRs against [`spec/categories/ar-prov.md`](spec/categories/ar-prov.md).
- Pull requests against the parent spec should edit [`spec/spec.md`](spec/spec.md) and go to [`agentready-org/standard`](https://github.com/agentready-org/standard) directly, not this fork.
- Challenges to a measured number are welcome — the dataset is in [`data/`](data/) precisely so the numbers can be checked.

## License

MIT — see [`data/LICENSE`](data/LICENSE) for the dataset. © 2026 era labs (ora.ai) for the parent spec and dataset; AR-PROV proposal © 2026 AINative Studio.
