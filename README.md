# AVERT — a specification for verifiable AI-agent execution against government systems

AVERT is an open specification defining how an autonomous AI agent takes a regulated action against a government system and comes away with cryptographic proof, through five steps: **Authorize, Validate, Execute, Receipt, Trail.** It is maintained by Apier ([apier.no](https://apier.no)), the reference implementation for Norwegian government systems (Altinn, Maskinporten, Brønnøysundregistrene, Skatteetaten, NAV).

**Status: Draft 0.1.0.** See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for exactly what the reference implementation supports today — several steps are live, the write path is in design-partner preview.

> **Norsk:** AVERT er en åpen spesifikasjon for hvordan en autonom AI-agent utfører en regulert handling mot offentlige systemer og sitter igjen med kryptografisk bevis — gjennom fem steg: Authorize, Validate, Execute, Receipt, Trail. Apier ([apier.no](https://apier.no)) er referanseimplementasjonen for norske offentlige systemer.

## Why traditional APIs fail for AI agents

Traditional APIs were built for developers who read documentation and reason through edge cases. An AI agent acting on government systems cannot, and the stakes are legal rather than cosmetic: a hallucinated organisation number or a malformed tax submission is a liability. AVERT defines the loop that turns an agent action into something independently verifiable.

## The five steps

- **Authorize** — confirm the agent is permitted to act for the entity before anything else happens.
- **Validate** — pre-flight the request through deterministic checks that return machine-readable errors the agent can self-correct, so no malformed payload reaches government.
- **Execute** — perform the authorised government call.
- **Receipt** — return a signed, tamper-evident record of what was submitted alongside the raw government response.
- **Trail** — append the action to an immutable, compounding audit chain that cannot be rewritten.

## Artifacts

Each AVERT step has a canonical JSON Schema in [`schemas/`](./schemas), with validating examples in [`examples/`](./examples): authorization decision, validation outcome, execution request, receipt, trail entry. Examples are checked against the schemas in CI.

## Reference implementation

Apier implements AVERT for Norwegian government systems. Read the live framework page at [apier.no/avert](https://apier.no/avert). For honest per-step maturity, see [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md).

## Government systems referenced

[Altinn](https://www.altinn.no) · [Brønnøysundregistrene](https://www.brreg.no) · [Maskinporten / Digdir](https://www.digdir.no) · [Skatteetaten](https://www.skatteetaten.no)

## License

MIT — see [LICENSE](./LICENSE).
