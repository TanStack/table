# TanStack Table open-PR closure audit

Generated 2026-07-30 and updated 2026-08-01 to remove closed entries. This audit now contains **78** pull requests that remain open in [`TanStack/table`](https://github.com/TanStack/table/pulls); it does not add PRs opened after the original scan.

## Result

- **72 PRs can close now.**
- **6 PRs should remain open:** all target the current v9 `beta` branch.
- **2 current-beta PRs have merge conflicts:** [#6313](https://github.com/TanStack/table/pull/6313) and [#6443](https://github.com/TanStack/table/pull/6443).
- **1 additional beta PR has a failing required check:** [#6361](https://github.com/TanStack/table/pull/6361) is mergeable, but `@tanstack/table-core:test:types` fails.
- No PRs, issues, labels, reviews, or comments were changed as part of this audit.

## Audit baseline

- **Current/default branch:** `beta` at `79cbfb6722246baab6fa070966363700aca92298` (`v9.0.0-beta.62`)
- **v8 branch:** `main` at `d08af367e11c539bb7e18c2472aa761149ef6db6` (`v8.21.3`)
- **Superseded v9 branch:** `alpha` at `4f855fe4ed088c1d5d5149a3649518587b426d6c` (`v9.0.0-alpha.54`)
- **Legacy branch:** `v7` at `06703a56890122cedf1b2fa4b82982999537774e` (`v7.8.0`)
- **Evidence checked:** PR bodies, diffs, changed files, discussions/reviews, linked issue state, replacement PRs, current beta source, GitHub mergeability, draft state, and check rollups.
- **Branch rule:** close work based on `main`, `v7`, or `alpha`; retain work based on the current `beta` branch.
- **Conflict rule:** only GitHub's current `mergeable: false` / `mergeable_state: dirty` result is called a merge conflict. A failing or incomplete check is reported separately.

## Summary

| Category                         |  Count | Recommended action                                                                  |
| -------------------------------- | -----: | ----------------------------------------------------------------------------------- |
| Resolved or Superseded in V9     |      0 | Close; the behavior, docs, or architecture is already present or replaced in beta.  |
| Revisit with a Fresh V9 PR       |     17 | Close the stale PR, retain the issue/idea, and implement anew from beta if pursued. |
| Non-consequential to Port        |     37 | Close; do not spend v9 migration effort on the stale docs/example/type cleanup.     |
| Wrong Direction for the Library  |     15 | Close with the current API/design boundary or supported alternative.                |
| Too Conflict-heavy to Rescue     |      3 | Close; conflict resolution would effectively be a rewrite.                          |
| Keep Open — Beta Clean           |      1 | Keep; current beta target, clean merge state, and passing checks.                   |
| Keep Open — Beta Needs Attention |      3 | Keep; resolve CI, incomplete checks, or an outstanding design decision.             |
| Keep Open — Beta Merge Conflicts |      2 | Keep, but rebase and resolve conflicts before further review.                       |
| **Total**                        | **78** | **72 close candidates; 6 keep open.**                                               |

## Suggested response language

Use the response for the PR's category and add the PR-specific evidence from its audit line.

### Resolved or Superseded in V9

> Thanks for the contribution. We are closing PRs against the pre-beta code lines as we consolidate development on v9 beta. This change is already covered by the current beta implementation or by a replacement PR, so there is nothing useful to port from this branch. We appreciate the work and report that helped identify it.

### Revisit with a Fresh V9 PR

> Thanks for working on this. The underlying issue/idea is legitimate, but this PR targets an obsolete code line and the current v9 architecture has moved too far for the patch to be carried forward safely. We are closing this PR while retaining the linked issue or audit note. If we pursue it, it should be a fresh PR from `beta` with a focused current-v9 regression test.

### Non-consequential to Port

> Thanks for the cleanup. We are closing stale PRs targeting pre-beta branches. Since this is limited to docs, examples, types, or minor cleanup in an area that has since moved, we are not going to spend migration effort porting it. A fresh current-branch PR is welcome if the same problem is still visible and consequential.

### Wrong Direction for the Library

> Thanks for exploring this. After reviewing it against the current v9 API and design boundaries, we do not want to take the library in this direction. We are closing the PR rather than porting it. The rationale or supported alternative is noted below.

### Too Conflict-heavy to Rescue

> Thanks for the substantial work here. This branch has diverged enough from the current v9 beta that resolving the conflicts would amount to rewriting the change, and the old diff is no longer a safe review unit. We are closing this PR. If the need still exists, please start with a narrowly scoped proposal or fresh PR from `beta`.

## Close now

### Revisit with a Fresh V9 PR (17)

- [#5031 — Fix an issue where pageIndex becomes invalid when data is changed](https://github.com/TanStack/table/pull/5031) — [#4994](https://github.com/TanStack/table/issues/4994) still fails a focused beta regression when shrunken data leaves an invalid page index; keep the issue and implement the clamp against v9's pagination atoms.
- [#5373 — fix(table-core): Avoid process not defined in environments not setting a process variable](https://github.com/TanStack/table/pull/5373) — The underlying unbundled-ESM concern remains tracked by [#6078](https://github.com/TanStack/table/issues/6078), but this old patch overlaps #6185 and predates v9's reorganized source; retain one current reproduction and start fresh.
- [#5414 — feat: add autoResetSorting](https://github.com/TanStack/table/pull/5414) — The opt-in use case may be valid, but the v8 patch defaults the reset on for client sorting despite the maintainer discussion and has no current state-scheduling tests; reconsider as a beta-first design.
- [#5582 — fix: invalidate cached values after updating accessor functions](https://github.com/TanStack/table/pull/5582) — [#5363](https://github.com/TanStack/table/issues/5363) still fails on beta, but v9's row/column construction and caches differ substantially; preserve the regression and rewrite from beta.
- [#5790 — fix(table-core): ensure isSubRowSelected returns false if no subRows are selectable](https://github.com/TanStack/table/pull/5790) — [#5173](https://github.com/TanStack/table/issues/5173) remains a verified beta bug; consolidate this and #6177 into one fresh v9 predicate fix with disabled-descendant coverage.
- [#5823 — fix: crash when ungrouping after aggregation row was pinned](https://github.com/TanStack/table/pull/5823) — [#5822](https://github.com/TanStack/table/issues/5822) still throws on beta when a stale synthetic group ID remains pinned; the v9 row-pinning/grouping code needs a fresh patch.
- [#5890 — Add `header.getAfter` API](https://github.com/TanStack/table/pull/5890) — Beta has logical start/end pinning and `column.getAfter`, but no header equivalent; if grouped end-pinning still needs it, design and test a logical v9 API rather than porting the physical-right v8 patch.
- [#5978 — fix: Duplicate sub-rows in pagination row model](https://github.com/TanStack/table/pull/5978) — [#5833](https://github.com/TanStack/table/issues/5833) still produces duplicate beta `flatRows`; carry the failing regression into a fresh v9 pagination-model fix.
- [#6075 — fix: retain columnFiltersMeta when leaf row filtering](https://github.com/TanStack/table/pull/6075) — [#6074](https://github.com/TanStack/table/issues/6074) still loses beta filter metadata after `filterFromLeafRows`; reimplement against v9's new filter-row utilities.
- [#6116 — [BUG] ignore non expandable rows when the expanded state changes](https://github.com/TanStack/table/pull/6116) — [#6115](https://github.com/TanStack/table/issues/6115) remains plausible in beta, but needs a current expansion-depth regression and an explicit semantic decision before a new implementation.
- [#6176 — Added server.allowed hosts to vite config](https://github.com/TanStack/table/pull/6176) — [#6175](https://github.com/TanStack/table/issues/6175) remains a valid examples-infrastructure issue, but the 73 v8 example configs are no longer the current set; generate a focused beta-era configuration change.
- [#6177 — fix: table-core's getIsAllSubRowsSelected returns false when subrows are unselectable](https://github.com/TanStack/table/pull/6177) — This is the second stale approach to verified beta issue [#5173](https://github.com/TanStack/table/issues/5173); close both old PRs and use one fresh beta fix.
- [#6178 — fix(table-core): respect custom filterFn.autoRemove in shouldAutoRemoveFilter](https://github.com/TanStack/table/pull/6178) — [#6101](https://github.com/TanStack/table/issues/6101) is a valid API inconsistency; consolidate this with duplicate #6195 into a tested beta implementation.
- [#6184 — fix(table-core): skip state update in toggleExpanded when state is unchanged](https://github.com/TanStack/table/pull/6184) — [#6136](https://github.com/TanStack/table/issues/6136) needs a current React commit/render regression before changing beta; consolidate this with duplicate #6194.
- [#6186 — fix(vue-table): return null for empty string in FlexRender to prevent hydration mismatch](https://github.com/TanStack/table/pull/6186) — [#6077](https://github.com/TanStack/table/issues/6077) is plausible, but the Vue v9 adapter was rewritten; require a current SSR hydration regression before a fresh fix.
- [#6194 — fix: skip toggleExpanded when state already matches desired value](https://github.com/TanStack/table/pull/6194) — Duplicate v8 approach to [#6136](https://github.com/TanStack/table/issues/6136); use the same current-v9 investigation/fresh-PR path as #6184.
- [#6195 — fix: respect custom filterFn.autoRemove over default empty string check](https://github.com/TanStack/table/pull/6195) — Duplicate v8 approach to valid issue [#6101](https://github.com/TanStack/table/issues/6101); use the same fresh-beta path as #6178.

### Non-consequential to Port (37)

- [#5729 — docs(expansion/table): tip use table option getRowId if data may change](https://github.com/TanStack/table/pull/5729) — V8-only documentation for a long-closed v7-era issue; no v9 code or urgent documentation gap.
- [#5750 — Fix: Corrected typo in example code](https://github.com/TanStack/table/pull/5750) — One-character v8 guide typo in documentation that has since been rewritten.
- [#5862 — docs: improve vanilla js installation docs](https://github.com/TanStack/table/pull/5862) — V8-only installation wording, with no code or current beta reproduction.
- [#5878 — fix: improve typing on makeStateUpdater function](https://github.com/TanStack/table/pull/5878) — Internal v8 type-guard/cast cleanup; v9 replaced the updater implementation.
- [#5886 — Update fuzzy-filtering.md](https://github.com/TanStack/table/pull/5886) — A one-line wording edit in an old guide.
- [#5915 — refactor: remove unnecessary code](https://github.com/TanStack/table/pull/5915) — Unused import and ref dependency cleanup in two v8 examples.
- [#5960 — docs: typo in guide/sorting.md](https://github.com/TanStack/table/pull/5960) — Single v8 documentation typo.
- [#5967 — Improve type for Editable Data React example](https://github.com/TanStack/table/pull/5967) — Example-only TypeScript narrowing for an example absent from beta.
- [#5982 — Fix typo in table-state.md](https://github.com/TanStack/table/pull/5982) — Single v8 React guide typo.
- [#6020 — Improve match-sorter-util performance by replacing string comparisons](https://github.com/TanStack/table/pull/6020) — Seven-line micro-optimization without a benchmark or linked user-visible regression; not worth a stale-branch port.
- [#6023 — docs(typo): fix typo](https://github.com/TanStack/table/pull/6023) — One-word v8 tables-guide edit.
- [#6027 — Fixed typo `it’s` to `its`](https://github.com/TanStack/table/pull/6027) — One-character Vue documentation edit.
- [#6031 — Fix DeepKeys to handle arrays properly](https://github.com/TanStack/table/pull/6031) — Type-only v8 accessor-path expansion with no linked regression or consumer test to justify porting.
- [#6037 — docs: add forgotten “mean” to column filtering docs](https://github.com/TanStack/table/pull/6037) — Single missing word in old docs.
- [#6038 — docs: remove unused footer column def](https://github.com/TanStack/table/pull/6038) — Six-line cleanup in a v8 example.
- [#6045 — docs: typos in guide/table-state.md](https://github.com/TanStack/table/pull/6045) — Three small wording fixes in a v8 guide.
- [#6052 — fix: add ref to drag handle button for improved DnD functionality](https://github.com/TanStack/table/pull/6052) — Example-only DnD wiring owned by the renderer/integration, not Table core.
- [#6053 — Fix writing in column-filtering.md](https://github.com/TanStack/table/pull/6053) — Two grammar changes in old docs.
- [#6054 — docs: fixed API docs link](https://github.com/TanStack/table/pull/6054) — Source-comment link correction with no runtime impact.
- [#6095 — fix: next section is actually previous section](https://github.com/TanStack/table/pull/6095) — One-word cross-reference correction.
- [#6103 — Update column-filtering.md](https://github.com/TanStack/table/pull/6103) — Removes one duplicated word from a v8 guide.
- [#6105 — Update headers.md](https://github.com/TanStack/table/pull/6105) — Documentation-only `colspan` to `colSpan` casing.
- [#6107 — Update table-state.md, fix parens typo](https://github.com/TanStack/table/pull/6107) — One-character Vue guide correction.
- [#6108 — docs: fix typo in column filtering guide](https://github.com/TanStack/table/pull/6108) — One grammar edit in the v8 guide.
- [#6110 — docs(expanding): clarify description of autoResetExpanded setting](https://github.com/TanStack/table/pull/6110) — V8-only option wording; v9 reset behavior and docs have been rebuilt.
- [#6125 — Fix syntax error in pagination example](https://github.com/TanStack/table/pull/6125) — Duplicate one-character Vue example correction in the same area as #6107.
- [#6146 — Fix punctuation in introduction.md](https://github.com/TanStack/table/pull/6146) — Punctuation-only old-docs change.
- [#6147 — Fix typo in column filtering documentation](https://github.com/TanStack/table/pull/6147) — Grammar-only old-docs change.
- [#6160 — docs: fix a few small typos](https://github.com/TanStack/table/pull/6160) — Three small wording changes across v8 guides.
- [#6163 — docs: fix TanStack Start link in README](https://github.com/TanStack/table/pull/6163) — One ecosystem link; harmless to close with the v8 batch and re-open from beta only if still prioritized.
- [#6204 — Docs: fix what seems to be a copy-paste error](https://github.com/TanStack/table/pull/6204) — Small v8 cells-guide correction.
- [#6205 — Docs: fix typo in table state documentation](https://github.com/TanStack/table/pull/6205) — One Angular guide typo.
- [#6210 — Docs: fix typo in column filtering documentation](https://github.com/TanStack/table/pull/6210) — One old-guide typo.
- [#5920 — chore(svelte-table): cleanup package.json](https://github.com/TanStack/table/pull/5920) (`alpha`) — Package-manifest cleanup against a superseded alpha package layout; no behavioral fix.
- [#6203 — update coderabbit logo](https://github.com/TanStack/table/pull/6203) (`alpha`) — Sponsor/logo presentation only.
- [#6155 — docs(v7): use github source link instead of broken v7 doc site](https://github.com/TanStack/table/pull/6155) (`v7`) — Legacy docs-only link; the associated [#6008](https://github.com/TanStack/table/issues/6008) was closed as completed on 2026-07-27 with the archived Netlify URL documented.
- [#6165 — Fix link to FAQ in useTable documentation](https://github.com/TanStack/table/pull/6165) (`v7`) — One link in end-of-life v7 documentation.

### Wrong Direction for the Library (15)

- [#5274 — Do not select subrows if enableSubRowSelection is false](https://github.com/TanStack/table/pull/5274) — `enableSubRowSelection` controls cascading from a toggled parent; select-all intentionally evaluates each independently selectable row. Use `enableRowSelection` to exclude rows.
- [#5401 — update logic to fix selection of disabled rows](https://github.com/TanStack/table/pull/5401) — Disabled is a current interaction capability, not immutable selection state; bulk deselection must still be able to clear controlled/persisted IDs.
- [#5514 — reduce memory leak by remove memo function](https://github.com/TanStack/table/pull/5514) — Blanket removal of feature memoization trades away computation without isolating a leak; v9 addressed allocations through shared prototypes and targeted row/cell architecture changes.
- [#5697 — fix: array filterFns](https://github.com/TanStack/table/pull/5697) — `arrIncludes`, `arrIncludesAll`, and `arrIncludesSome` intentionally filter array-valued cells. Scalar cells should use `equals` or a custom function.
- [#5950 — add filterRowsUtils export](https://github.com/TanStack/table/pull/5950) — The recursive filter utility is an implementation detail tied to internal row-model invariants; custom row models should not depend on that unstable private surface.
- [#5964 — Remove console.error log from table.getColumn(id)](https://github.com/TanStack/table/pull/5964) — V9 deliberately retains a development-only missing-column warning to expose stale IDs while still returning `undefined`.
- [#5974 — support unsetting getPaginationRowModel](https://github.com/TanStack/table/pull/5974) — Dynamic client/server pagination should use `manualPagination`; treating removal of a row-model factory as a runtime mode switch complicates cache ownership.
- [#5996 — Prevent deletion of non-selectable rows on RowSelectionChange](https://github.com/TanStack/table/pull/5996) — Same capability-versus-immutability problem as #5401: non-selectable rows may still need their stale selection IDs cleared.
- [#6062 — feat(RowSelection): support indeterminate states](https://github.com/TanStack/table/pull/6062) — The proposal makes a parent's explicit selection ID a derived mirror of descendants. Current Table semantics expose explicit and descendant predicates separately so renderers can combine them.
- [#6085 — docs: add Excel-like sorting guide for null/undefined handling](https://github.com/TanStack/table/pull/6085) — Excel-style coercion and empty-value ordering are application-specific collation policy; use a custom `sortingFn` rather than establish it as an official Table behavior.
- [#6120 — fix API to calculate max expanded row depth](https://github.com/TanStack/table/pull/6120) — Collapsing a parent should not erase descendant expansion choices; preserving them allows nested state to return when the parent is reopened.
- [#6123 — add existingTable param to useReactTable](https://github.com/TanStack/table/pull/6123) — V9 supports external ownership through atoms/stores; threading an existing instance through every framework adapter couples hook lifecycles and includes removed Qwik code.
- [#6129 — toggleAllRowsSelected should respect row selection rules](https://github.com/TanStack/table/pull/6129) — `enableRowSelection` gates whether a row can be interactively selected, not whether a bulk command may remove an already-stored ID.
- [#6240 — type column contexts with React table](https://github.com/TanStack/table/pull/6240) (`alpha`) — Core cell/header contexts must remain framework-neutral. React's `Subscribe` helper is intentionally an adapter component, not part of the core `Table` context type.
- [#6295 — clamp column size during resize drag](https://github.com/TanStack/table/pull/6295) (`alpha`) — Current v8/v9 getters already clamp committed sizes to `minSize`/`maxSize`, and [#5997](https://github.com/TanStack/table/issues/5997) could not be reproduced under the supported rendering path.

### Too Conflict-heavy to Rescue (3)

- [#5865 — docs: update router example and types](https://github.com/TanStack/table/pull/5865) — Conflicting 2025 dependency/example migration with 775 additions, 189 deletions, a lockfile rewrite, and an obsolete router API; rebuilding the current beta example is safer.
- [#6086 — feat: add sortEmpty option for comprehensive empty value handling](https://github.com/TanStack/table/pull/6086) — Conflicting 11-file, 1,092-line API/deprecation/example change. It also needs a new design decision on app-specific empty-value policy, so conflict resolution would not rescue a reviewable patch.
- [#6242 — WIP: adapt solid-table to Solid v2 beta reactivity model](https://github.com/TanStack/table/pull/6242) (`alpha`) — Conflicting draft spanning 83 files with 1,050 additions and 454 deletions against an older Solid v2 beta and v9 alpha; any remaining Solid work must start from current beta.

## Keep open

### Beta Clean (1)

- [#6442 — toggle group column visibility](https://github.com/TanStack/table/pull/6442) — Draft, mergeable/clean, and all checks pass. It supplies the beta design/test for valid group visibility issue [#5497](https://github.com/TanStack/table/issues/5497).

### Beta Needs Attention (3)

- [#6361 — include sub-rows in flatRows when maxLeafRowFilterDepth truncates recursion](https://github.com/TanStack/table/pull/6361) — Keep: non-draft and mergeable, and it targets verified [#5987](https://github.com/TanStack/table/issues/5987). The required `Test` check currently fails at `@tanstack/table-core:test:types`; update to current beta types and rerun.
- [#6385 — Allow Manual Override of Pagination canNextPage/canPreviousPage](https://github.com/TanStack/table/pull/6385) — Keep: draft and mergeable with no conflict. GitHub reports `UNSTABLE` and the normal full test/preview rollup is absent; it also needs maintainer agreement on whether navigation capability belongs in pagination state or options.
- [#6445 — perf: compute NODE_ENV up-front & flip opt-in](https://github.com/TanStack/table/pull/6445) — Keep: draft and mergeable with no conflict. GitHub reports `UNSTABLE` with only review/security checks present; decide the `!== 'production'` behavior, then run the full required suite.

### Beta Merge Conflicts (2)

- [#6313 — exclude non-numeric values from inNumberRange filter](https://github.com/TanStack/table/pull/6313) — Keep, but GitHub reports `CONFLICTING`/`dirty`. It fixes verified [#6007](https://github.com/TanStack/table/issues/6007); rebase onto current beta, preserve the finite-number regression coverage, and rerun checks.
- [#6443 — reset expansion when data changes](https://github.com/TanStack/table/pull/6443) — Keep, but the draft is `CONFLICTING`/`dirty` and its `Test` check fails. It fixes verified [#5801](https://github.com/TanStack/table/issues/5801); rebase onto current beta and revalidate the core-row-model reset hook.
