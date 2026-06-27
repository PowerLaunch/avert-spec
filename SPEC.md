# AVERT Specification — v0.1.0 (Draft)

AVERT is a vendor-neutral specification for taking a regulated action against a government system as an autonomous agent and coming away with verifiable proof, defined as five ordered steps: Authorize, Validate, Execute, Receipt, Trail. This document is the normative specification; [Apier](https://apier.no) is one implementation of it, not the standard itself. Any system that satisfies the requirements below MAY describe itself as AVERT-conformant.

## Key words

The key words MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD, SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL in this document are to be interpreted as described in RFC 2119 and RFC 8174 when, and only when, they appear in all capitals, as shown here.

## Authorize

Purpose: establish that the caller is permitted to act for the named entity before anything is done on that entity's behalf.

- An implementation MUST establish that the caller is permitted to act for the named entity before any Execute step runs.
- The authorization decision MUST be exactly one of `full`, `partial`, or `none`.
- A non-`full` decision SHOULD return structured, machine-readable remediation steps describing what is missing and how to obtain it.
- An implementation MUST NOT proceed to Execute on a `none` decision.

Schema: [`schemas/authorization-decision.schema.json`](./schemas/authorization-decision.schema.json).

## Validate

Purpose: catch a malformed or non-compliant request through deterministic pre-flight checks before it reaches a government system.

- An implementation MUST run deterministic pre-flight checks before any government call.
- For each failed check, an implementation MUST return a stable, machine-readable `error_code` that an agent can branch on.
- The same input MUST produce the same validation outcome; a check MUST NOT depend on wall-clock timing or randomness.
- Execute MUST NOT proceed unless validation passes.

Schema: [`schemas/validation-outcome.schema.json`](./schemas/validation-outcome.schema.json).

## Execute

Purpose: perform the authorised government call as the entity on whose behalf the agent is acting.

- The call MUST run as the authorised entity established in the Authorize step.
- An implementation MUST fail closed when a live capability is not available, returning an explicit error rather than silently degrading or fabricating a result.
- Write capabilities MAY be gated behind explicit configuration, and an implementation MAY expose a dry-run mode that runs Validate without performing the government call.

Schema: [`schemas/execution-request.schema.json`](./schemas/execution-request.schema.json).

## Receipt

Purpose: return tamper-evident proof of exactly what was submitted and what the government system returned.

- On a successful Execute, an implementation MUST produce a signed receipt.
- The receipt MUST capture the submitted payload (or a cryptographic hash of it), the raw government response, the signature algorithm, and a reference linking it to the Trail entry.
- Receipts MUST be tamper-evident: any change to the captured content MUST invalidate the signature.

Schema: [`schemas/receipt.schema.json`](./schemas/receipt.schema.json).

## Trail

Purpose: record every action in an append-only history that the implementation itself cannot rewrite.

- Every action MUST append to an append-only chain.
- The implementation MUST NOT be able to rewrite or delete entries in that chain after they are written.
- Append-only enforcement SHOULD be defence-in-depth — for example, database-level constraints combined with a single-writer choke point — rather than relying on application code alone.

Schema: [`schemas/trail-entry.schema.json`](./schemas/trail-entry.schema.json).

## Versioning

This is a draft specification at version 0.1.0. Breaking changes — including renamed fields, changed types, and altered step semantics — MAY occur before version 1.0.0. Implementations SHOULD pin to a specific draft version. Once 1.0.0 is published, schema fields are intended to evolve append-only, and a breaking change will REQUIRE a major-version increment.
