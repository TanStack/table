# v9 beta-window triage — open items only

Fresh scan completed 2026-08-02 against local `beta` at `164ef450a` and the live GitHub open-item lists.

This file intentionally lists only issues and PRs that were still open at the snapshot. Merged replacement work is identified by beta commit hash rather than kept as a closed triage entry.

**Scope:** all 60 open issues and all 64 open PRs were screened. The detailed sections retain only beta API/default decisions, current implementation vehicles, urgent valid bugs, and open items that can already be closed as duplicates or superseded work.

**BETA-NOW rule:** resolve before stable when the likely fix changes default behavior, state meaning, callback precedence, cache invalidation semantics, or a public type/API shape. Additive helpers, crash fixes, framework fixes, examples, and performance work may ship later, though urgent items should not be allowed to drift.

## Headline

- **Five core beta decisions remain:** column/default-column cache coherence, persisted group-column visibility, aggregated-cell fallback precedence, custom sorting of `undefined`, and the options-store architecture.
- **One additional API-shape decision is open:** whether manual pagination capability flags belong in pagination state.
- **Seven PRs target `beta`:** two are already superseded and can close; one is clean and fully green; four need a decision, rebase, fix, or full CI.
- **Eight open issues can close now** because current beta already resolves them or because a canonical duplicate remains open.
- **Eight open PRs can close now** because equivalent fixes are already merged into beta.

## BETA-NOW — resolve before stable

### 1. Column construction and value-cache coherence

- **Canonical: [#5363](https://github.com/TanStack/table/issues/5363)** — rows retain `_valuesCache` when `columns` or an `accessorFn` changes, so rendering, sorting, filtering, and grouping can read stale values.
- **Duplicate: [#4485](https://github.com/TanStack/table/issues/4485)** — the same defect observed through a replaced columns array. Close this issue into #5363 rather than track a second fix.
- **Coupled default behavior: [#5275](https://github.com/TanStack/table/issues/5275)** — `defaultColumn` is baked into constructed columns while `getAllColumns` only depends on the columns array.
- **Open prior-art PR: [#5582](https://github.com/TanStack/table/pull/5582)** — targets `main`, conflicts with beta, and should not be merged as-is. Preserve its regression idea in a fresh beta implementation.

Resolve these together. Prefer invalidating/sweeping affected caches and reconstructed column definitions without needlessly changing row identity. The stable contract must be explicit about which option-reference changes recompute columns and accessor values.

### 2. Persisted group-column visibility semantics

- **[#5770](https://github.com/TanStack/table/issues/5770)** remains open and remains valid. Current beta still ignores `columnVisibility: { groupId: false }` because group visibility is derived from descendant leaves.

Important correction from the previous audit: beta commit `164ef450a` fixed `groupColumn.toggleVisibility()` by fanning out to leaf IDs, but it did **not** make a persisted group-ID key meaningful. Before stable, choose one contract:

1. Accept group IDs in `ColumnVisibilityState` and define precedence against descendant keys; or
2. Declare visibility state leaf-ID-only, document it, and close #5770 as unsupported state shape.

Leaving the setter accepting group columns while persisted state silently ignores group IDs is the ambiguous outcome to avoid.

### 3. Aggregated-cell renderer precedence

- **[#5778](https://github.com/TanStack/table/issues/5778)** — the aggregation feature injects a default `aggregatedCell`, so a consumer's `cell` formatter never wins for aggregated cells unless they explicitly set `aggregatedCell: null`.

Changing the fallback order later would alter rendering for existing consumers. Decide during beta whether aggregation supplies a default renderer or whether `aggregatedCell` should lazily fall back to the consumer's `cell` renderer.

### 4. Custom sorting and `undefined`

- **[#5653](https://github.com/TanStack/table/issues/5653)** — the remaining semantic question is whether default `sortUndefined: 1` may bypass a custom `sortingFn`.

The documentation defect is already fixed in current beta. Either preserve the current short-circuit and close the issue with `sortUndefined: false` as the opt-in pass-through, or change the default/precedence now. Do not change this sorting default after stable.

### 5. Options-store architecture

- **[#6475](https://github.com/TanStack/table/pull/6475)** — draft POC refactoring the options store into atoms. Its previous full test/build run passed, but it now conflicts with current beta.

This touches exported/internal table structure, reactivity, adapters, devtools, and generated API docs. Decide before stable whether this architecture is part of v9; if yes, rebase and re-run the full suite, and if no, close the POC rather than carry it across the stable boundary.

### 6. Pagination capability API shape — decide now, implementation may wait

- **[#6385](https://github.com/TanStack/table/pull/6385)** — draft proposal adding `canNextPage` and `canPreviousPage` to `PaginationState`.

The feature is additive, so it is not a semver blocker. The durable question is whether server capability belongs in controlled state or in table options. Settle that shape during beta; merge only after full CI and state-update preservation tests are current.

## Open beta PRs

| PR                                                                                        | Live state                                                 | Recommendation                                                                                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#6475 — options store into atoms](https://github.com/TanStack/table/pull/6475)           | Draft, conflicting; prior full CI green                    | **Beta decision.** Rebase and land before stable, or close the POC.                                                                                                                                                                                                           |
| [#6474 — improve table devtools performance](https://github.com/TanStack/table/pull/6474) | Non-draft, clean, full CI green                            | **Mergeable now.** Devtools-only; not a core API blocker.                                                                                                                                                                                                                     |
| [#6472 — align grouped sticky headers](https://github.com/TanStack/table/pull/6472)       | Non-draft, mergeable, only security/review checks reported | **Re-run full CI, then merge.** It fixes the example for [#5397](https://github.com/TanStack/table/issues/5397) using existing header-segment leaf APIs; no core API change is required.                                                                                      |
| [#6445 — hoist NODE_ENV checks](https://github.com/TanStack/table/pull/6445)              | Draft, mergeable, incomplete CI                            | **Fix before merge.** Module-scope `process.env` reads still crash the bundler-less environment from [#6078](https://github.com/TanStack/table/issues/6078). Guard `process` (or replace it at build time), then decide `!== 'production'` warning semantics and run full CI. |
| [#6385 — pagination capability overrides](https://github.com/TanStack/table/pull/6385)    | Draft, mergeable, incomplete CI                            | **API-shape decision.** State versus options; additive after that decision.                                                                                                                                                                                                   |
| [#6361 — filter-depth flatRows](https://github.com/TanStack/table/pull/6361)              | Conflicting                                                | **Close now.** Equivalent beta implementation is merged in `8fcfd3453`.                                                                                                                                                                                                       |
| [#6313 — numeric range guard](https://github.com/TanStack/table/pull/6313)                | Conflicting                                                | **Close now.** Equivalent beta implementation is merged in `8fcfd3453`.                                                                                                                                                                                                       |

## Open issues that can close now

These are still open on GitHub, but no additional implementation is needed for the reported behavior.

| Open issue                                                                                              | Why it can close                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [#4485 — accessor function does not update](https://github.com/TanStack/table/issues/4485)              | Duplicate of canonical [#5363](https://github.com/TanStack/table/issues/5363); keep one cache-invalidation issue.                                                                                      |
| [#4759 — cannot deselect children through a grouped row](https://github.com/TanStack/table/issues/4759) | Current beta's row-selection implementation recursively toggles selectable descendants even when the synthetic group row itself is not selectable. The v8 early-return behavior reported here is gone. |
| [#4879 — selection on grouped flat data](https://github.com/TanStack/table/issues/4879)                 | Current beta keeps synthetic group IDs out of selection and derives group checkbox state from descendants; the reported v8 flows are resolved.                                                         |
| [#4880 — full-width column sizing state mismatch](https://github.com/TanStack/table/issues/4880)        | Duplicate rendering request; consolidate into canonical [#4825](https://github.com/TanStack/table/issues/4825). Core state stores logical widths and does not mirror browser-distributed table widths. |
| [#5605 — aggregated cells with zero subrows](https://github.com/TanStack/table/issues/5605)             | Current `cell_getIsAggregated` uses grouping identity and resolved aggregation functions; the reported `subRows.length` condition no longer exists.                                                    |
| [#5617 — array filter functions accept scalar strings](https://github.com/TanStack/table/issues/5617)   | Current `arrIncludesAll`/`arrIncludesSome` explicitly reject non-array cell values, removing the reported accidental string-substring behavior. Use the scalar/equality filter for scalar cells.       |
| [#6010 — full-width resize moves preceding columns](https://github.com/TanStack/table/issues/6010)      | Same browser-layout/redistribution request as canonical [#4825](https://github.com/TanStack/table/issues/4825); keep one issue.                                                                        |
| [#6158 — pagination callback loop on RSC navigation](https://github.com/TanStack/table/issues/6158)     | Current beta's page-index reset returns before `onPaginationChange` when the target index already equals the current index, removing the reported v8 URL-sync loop.                                    |

## Open PRs that can close now

All of these remain open, but their equivalent fixes are already present on beta.

| Open PR                                                                                                 | Superseding beta implementation                                                          |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [#5978 — duplicate subrows in paginated flatRows](https://github.com/TanStack/table/pull/5978)          | `aad2c292c` deduplicates paginated `flatRows`.                                           |
| [#6116 — ignore non-expandable rows in expanded state](https://github.com/TanStack/table/pull/6116)     | `aad2c292c` filters expand-all materialization and depth calculations by `getCanExpand`. |
| [#6184 — skip unchanged toggleExpanded](https://github.com/TanStack/table/pull/6184)                    | `aad2c292c` adds row-level and table-level no-op guards.                                 |
| [#6194 — skip unchanged toggleExpanded](https://github.com/TanStack/table/pull/6194)                    | Duplicate of #6184 and superseded by `aad2c292c`.                                        |
| [#6178 — respect custom filterFn.autoRemove](https://github.com/TanStack/table/pull/6178)               | `8fcfd3453` makes a supplied `autoRemove` authoritative for defined values.              |
| [#6195 — respect custom filterFn.autoRemove](https://github.com/TanStack/table/pull/6195)               | Duplicate of #6178 and superseded by `8fcfd3453`.                                        |
| [#6313 — exclude non-numeric range values](https://github.com/TanStack/table/pull/6313)                 | `8fcfd3453` contains the beta implementation and regression coverage.                    |
| [#6361 — preserve depth-truncated descendants in flatRows](https://github.com/TanStack/table/pull/6361) | `8fcfd3453` contains the beta implementation and regression coverage.                    |

## Valid open work that can land anytime

These are worth doing, but their natural fixes are additive, unambiguous bug fixes, adapter fixes, examples, or performance work rather than stable-API blockers.

| Open item                                                                                                     | Priority and next step                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#6078 — `process is not defined`](https://github.com/TanStack/table/issues/6078)                             | **Urgent release-quality bug.** Correct [#6445](https://github.com/TanStack/table/pull/6445) or add a build-time replacement plus a direct ESM/import-map regression. |
| [#6074 — leaf-up filtering drops `columnFiltersMeta`](https://github.com/TanStack/table/issues/6074)          | Port the focused fix from open [#6075](https://github.com/TanStack/table/pull/6075) to beta and add a fuzzy-filter/rank-sort regression.                              |
| [#6077 — Vue empty-string hydration mismatch](https://github.com/TanStack/table/issues/6077)                  | Rework open [#6186](https://github.com/TanStack/table/pull/6186) against the v9 Vue adapter.                                                                          |
| [#5397 — grouped sticky headers](https://github.com/TanStack/table/issues/5397)                               | Land open [#6472](https://github.com/TanStack/table/pull/6472) after full CI; its example-side solution shows no new core API is necessary.                           |
| [#5008 — median aggregation with nulls](https://github.com/TanStack/table/issues/5008)                        | Skip nullish values consistently with the other numeric aggregation functions.                                                                                        |
| [#5850 — remove selected row IDs helper](https://github.com/TanStack/table/issues/5850)                       | Additive helper already accepted in the issue thread.                                                                                                                 |
| [#5864 — `mode()` aggregation](https://github.com/TanStack/table/issues/5864)                                 | Additive, tree-shakeable aggregation function.                                                                                                                        |
| [#4825 — full-width resize redistribution](https://github.com/TanStack/table/issues/4825)                     | Additive opt-in resize mode; canonical issue for the full-width sizing cluster.                                                                                       |
| [#4512 — resizing under CSS scale](https://github.com/TanStack/table/issues/4512)                             | Additive scale input/option for resize deltas.                                                                                                                        |
| [#6230 — React members missing from cell/header context types](https://github.com/TanStack/table/issues/6230) | Adapter typing improvement; do not merge the conflicting alpha approach in open [#6240](https://github.com/TanStack/table/pull/6240) as-is.                           |
| [#6474 — table devtools performance](https://github.com/TanStack/table/pull/6474)                             | Clean and fully green; merge when reviewed.                                                                                                                           |

## Suggested order

1. Close the eight superseded PRs and the eight resolved/duplicate issues above; this removes noise from the remaining beta view.
2. Decide the options-store POC ([#6475](https://github.com/TanStack/table/pull/6475)) and group-ID visibility contract ([#5770](https://github.com/TanStack/table/issues/5770)).
3. Implement the cache/default-column cluster ([#5363](https://github.com/TanStack/table/issues/5363) + [#5275](https://github.com/TanStack/table/issues/5275)); close [#4485](https://github.com/TanStack/table/issues/4485) as the duplicate.
4. Resolve the two remaining default-render/sort decisions ([#5778](https://github.com/TanStack/table/issues/5778), [#5653](https://github.com/TanStack/table/issues/5653)).
5. Decide state versus options for [#6385](https://github.com/TanStack/table/pull/6385).
6. Merge the clean devtools PR, re-run the grouped-header example PR, and fix the urgent `process` crash vehicle.
