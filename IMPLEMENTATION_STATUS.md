# AVERT — reference implementation status (Apier)

This table records the maturity of each AVERT step in the Apier reference implementation as of this spec version. It is deliberately conservative: where a capability is gated or backed by a mock, it says so.

| Step | Status | What is true today |
|------|--------|--------------------|
| Authorize | Live (app layer) | API-key resolution, scope enforcement (read scopes live; write/act/delegate scopes reserved), delegation probes and acting-capacity logic are live. Live government identity/delegation exchange (Maskinporten, Altinn) is enabled per environment. |
| Validate | Live | Deterministic pre-flight (entity exists, delegation active, scopes, payload shape, deadline) returns a machine-readable `error_code` per failed check and gates Execute. |
| Execute | Read live per integration; write in design-partner preview | Government reads can run live per integration. The only production write path (MVA-melding) runs through a mock submitter today; live submission is not yet enabled and fails closed. |
| Receipt | Live signing + persistence | HMAC-SHA256-v1 signed receipts persist to an append-only store with the raw government response. Until live write ships, that response is mock-generated. |
| Trail | Live | Append-only forensic chain with database-level enforcement and single-writer choke points. |

AVERT describes the full loop; this table is the honest current state of one implementation. Write-side execution is being validated with design partners before general availability.
