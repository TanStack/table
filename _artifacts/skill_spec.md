# @tanstack/table — Skill Spec

Headless data-grid library: features, state, and APIs for building powerful, type-safe tables and datagrids while keeping full control of markup, styles, and behavior. Framework-agnostic core (`@tanstack/table-core`) with adapters for React, Vue, Solid, Svelte, Angular, Lit, and Preact.

**Version:** 9.0.0-alpha.48 · **Status:** reviewed · **Date:** 2026-05-17

> Generated via the `@tanstack/intent` three-phase scaffold flow (domain discovery → tree generation → SKILL.md generation). Domain map artifacts live at the repo root (`_artifacts/`); skills will live inside each package's `skills/` directory. Status is `reviewed` after the maintainer interview on 2026-05-17.

## Domains

| Domain                                        | Description                                                                                                            | Skill count |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------: |
| **Core foundations** (`core-foundations`)     | Setup, column definitions, state management, and customization of built-in feature behavior. State-management is the … |           4 |
| **Row-model features** (`row-model-features`) | Features driven by entries in `rowModels` — filtering (column+global+faceting+fuzzy), sorting, pagination, grouping,…  |           5 |
| **UI-state features** (`ui-state-features`)   | Features that are pure UI state — no row model needed. Column layout (visibility/ordering/pinning/sizing/resizing), r… |           3 |
| **Framework adapters** (`framework-adapters`) | Per-framework reactivity bindings and rendering integration. Each adapter has its own `table-state` skill; React adds… |          10 |
| **Lifecycle** (`lifecycle`)                   | End-to-end journeys that cross-cut features: getting-started, v8→v9 migration, client-to-server conversion, productio… |           4 |
| **Composition** (`composition`)               | Patterns for using TanStack Table with sibling TanStack libraries (Store, Query, Virtual, Form, Pacer, Devtools). Per… |           7 |

## Skill Inventory

| Skill                                                    | Type        | Domain             | Package(s)                                                                                                             | Failure modes |
| -------------------------------------------------------- | ----------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------------: |
| `setup`                                                  | core        | core-foundations   | table-core                                                                                                             |            10 |
| `column-definitions` *(*📝 maintainer notes*)*           | core        | core-foundations   | table-core                                                                                                             |            10 |
| `state-management`                                       | core        | core-foundations   | table-core                                                                                                             |             8 |
| `customizing-feature-behavior`                           | core        | core-foundations   | table-core                                                                                                             |             5 |
| `filtering`                                              | core        | row-model-features | table-core                                                                                                             |             9 |
| `sorting`                                                | core        | row-model-features | table-core                                                                                                             |             7 |
| `pagination`                                             | core        | row-model-features | table-core                                                                                                             |             7 |
| `grouping`                                               | core        | row-model-features | table-core                                                                                                             |             6 |
| `row-expanding`                                          | core        | row-model-features | table-core                                                                                                             |             5 |
| `column-layout`                                          | core        | ui-state-features  | table-core                                                                                                             |             8 |
| `row-pinning`                                            | core        | ui-state-features  | table-core                                                                                                             |             4 |
| `row-selection`                                          | core        | ui-state-features  | table-core                                                                                                             |             7 |
| `table-state`                                            | framework   | framework-adapters | react-table                                                                                                            |             4 |
| `table-state`                                            | framework   | framework-adapters | vue-table                                                                                                              |             4 |
| `table-state` *(*📝 maintainer notes*)*                  | framework   | framework-adapters | solid-table                                                                                                            |             4 |
| `table-state` *(*📝 maintainer notes*)*                  | framework   | framework-adapters | svelte-table                                                                                                           |             4 |
| `table-state` *(*📝 maintainer notes*)*                  | framework   | framework-adapters | angular-table                                                                                                          |             4 |
| `table-state` *(*📝 maintainer notes*)*                  | framework   | framework-adapters | lit-table                                                                                                              |             4 |
| `table-state`                                            | framework   | framework-adapters | preact-table                                                                                                           |             4 |
| `react-subscribe-compiler-compat`                        | framework   | framework-adapters | react-table                                                                                                            |            11 |
| `angular-rendering-directives`                           | framework   | framework-adapters | angular-table                                                                                                          |             7 |
| `lit-table-controller` *(*📝 maintainer notes*)*         | framework   | framework-adapters | lit-table                                                                                                              |             4 |
| `getting-started`                                        | lifecycle   | lifecycle          | react-table, vue-table, angular-table, solid-table, svelte-table, preact-table, lit-table                              |             8 |
| `migrate-v8-to-v9`                                       | lifecycle   | lifecycle          | react-table, vue-table, angular-table, solid-table, svelte-table, preact-table, lit-table, table-core                  |            17 |
| `client-to-server`                                       | lifecycle   | lifecycle          | react-table, vue-table, angular-table, solid-table, svelte-table, preact-table                                         |             7 |
| `production-readiness`                                   | lifecycle   | lifecycle          | react-table, vue-table, angular-table, solid-table, svelte-table, preact-table                                         |            10 |
| `compose-with-tanstack-store`                            | composition | composition        | react-table, vue-table, angular-table, solid-table, svelte-table, preact-table, store, react-store                     |             5 |
| `compose-with-tanstack-query`                            | composition | composition        | react-table, vue-table, angular-table, solid-table, svelte-table, preact-table, react-query, query-core                |             8 |
| `compose-with-tanstack-virtual`                          | composition | composition        | react-table, vue-table, angular-table, solid-table, svelte-table, preact-table, lit-table, react-virtual, virtual-core |             7 |
| `compose-with-tanstack-form`                             | composition | composition        | react-table, vue-table, solid-table, svelte-table, preact-table, react-form                                            |             5 |
| `compose-with-tanstack-pacer`                            | composition | composition        | react-table, vue-table, solid-table, svelte-table, preact-table, react-pacer, pacer                                    |             6 |
| `compose-with-tanstack-devtools`                         | composition | composition        | react-table-devtools, vue-table-devtools, solid-table-devtools, preact-table-devtools, table-devtools                  |             6 |
| `compose-with-tanstack-hotkeys` *(*⏸ deferred to v1.1*)* | composition | composition        | react-table, vue-table, angular-table, solid-table, svelte-table, preact-table, hotkeys                                |             3 |

**Total failure modes:** 218

## Tensions

| Tension                                                 | Skills                                                                   | Agent gets wrong                                                                                                                                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getting-started simplicity vs production correctness    | getting-started ↔ production-readiness                                   | Agents copy the getting-started pattern verbatim into 10k-row tables and ship slow code, blaming the library rather than the selector                                                                    |
| client-side feature richness vs server-side correctness | filtering ↔ sorting ↔ pagination ↔ client-to-server                      | Agents converting a working client table to use a server endpoint flip `manualPagination` without auditing filtering/sorting consistency                                                                 |
| atomic-state granularity vs API simplicity              | state-management ↔ compose-with-tanstack-store ↔ getting-started         | Agents default to `state` + `on*Change` because it looks like the v8 idiom, then hit re-render storms or sync issues with Query and patch around them, when the v9 atoms option would have been cleaner. |
| React Compiler safety vs render-cost simplicity         | react-subscribe-compiler-compat ↔ production-readiness ↔ getting-started | Agents either over-wrap every component in Subscribe (verbose, slow to author) or under-wrap and ship tables that look fine in dev but break under React Compiler in prod                                |
| tree-shaking via \features vs ergonomic useLegacyTable  | setup ↔ production-readiness ↔ migrate-v8-to-v9                          | Agents reach for `useLegacyTable` on v8→v9 migrations and never circle back to declare `features`, sacrificing the bundle wins that motivated the v9 redesign.                                           |

## Cross-References

| From                              | To                                | Reason                                                                                             |
| --------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------- |
| `setup`                           | `state-management`                | state-management is the prerequisite for every other skill; setup users will need it as soon as t… |
| `state-management`                | `compose-with-tanstack-store`     | external atoms are the recommended state ownership pattern for server-side work                    |
| `state-management`                | `migrate-v8-to-v9`                | state model is the biggest v8→v9 shift; migration explanation depends on the v9 atom mental model  |
| `filtering`                       | `sorting`                         | filter→sort handoff via addMeta + columnFiltersMeta (e.g. itemRank for fuzzy)                      |
| `filtering`                       | `customizing-feature-behavior`    | custom filterFn / globalFilterFn                                                                   |
| `sorting`                         | `customizing-feature-behavior`    | custom sortFn — especially when combined with fuzzy filter rank                                    |
| `grouping`                        | `customizing-feature-behavior`    | custom aggregationFn                                                                               |
| `grouping`                        | `row-expanding`                   | grouped rows expand via the row-expanding feature; both are required together                      |
| `grouping`                        | `row-selection`                   | getGroupedSelectedRowModel + selection state interpretation inside groups                          |
| `row-expanding`                   | `filtering`                       | filterFromLeafRows + maxLeafRowFilterDepth interactions                                            |
| `row-expanding`                   | `pagination`                      | paginateExpandedRows controls whether expanded rows respect page boundaries                        |
| `pagination`                      | `row-selection`                   | manualPagination + selection state — getSelectedRowModel only returns rows in current page when m… |
| `column-layout`                   | `grouping`                        | groupedColumnMode reorders columns; affects column layout precedence                               |
| `row-selection`                   | `column-definitions`              | tristate parent checkbox patterns + getRowId requirement for stable selection                      |
| `client-to-server`                | `compose-with-tanstack-query`     | Query is the canonical server-side fetch layer; client-to-server skill expects it                  |
| `client-to-server`                | `state-management`                | external atoms via atoms option is the cleanest pattern for sharing pagination/sort/filter with Q… |
| `production-readiness`            | `react-subscribe-compiler-compat` | Subscribe boundaries are a top perf optimization on React                                          |
| `production-readiness`            | `setup`                           | `features` tree-shaking is decided at setup                                                        |
| `compose-with-tanstack-virtual`   | `row-expanding`                   | virtualized + expanding requires careful measurer + getSubRows interaction                         |
| `compose-with-tanstack-virtual`   | `column-layout`                   | virtualized columns interact with sizing and pinning                                               |
| `compose-with-tanstack-form`      | `row-selection`                   | editable rows + selection — common together                                                        |
| `compose-with-tanstack-devtools`  | `state-management`                | devtools surface the atoms model; understanding state-management makes devtools readable           |
| `migrate-v8-to-v9`                | `setup`                           | v9 setup IS the migration target                                                                   |
| `migrate-v8-to-v9`                | `column-definitions`              | createColumnHelper generic order changed in v9                                                     |
| `migrate-v8-to-v9`                | `filtering`                       | sortingFn → sortFn rename; filterFn registry semantics                                             |
| `react-subscribe-compiler-compat` | `column-definitions`              | header/cell render fns are the main location where Subscribe is needed                             |
| `angular-rendering-directives`    | `table-state`                     | Angular rendering depends on the signal-backed state model unique to that adapter                  |
| `lit-table-controller`            | `table-state`                     | Lit reactivity is owned by TableController; table-state mental model relies on that                |

## Maintainer Interview Highlights

From Phase 4 (2026-05-17). Full Q&A is in `domain_map.yaml :: maintainer_interview`.

**Resolved structural questions:**

- `column-layout` renamed to display name _Column Layout Features_ (slug unchanged).
- Filter / aggregation / sort fn counts: do **not** cite numbers — registries are open-ended.
- `useLegacyTable` stays available in v9 as deprecated; removed in v10.
- `compose-with-tanstack-hotkeys` deferred to v1.1; canonical example coming.
- `examples/react/with-tanstack-query` IS the canonical Query+Table pattern (added to compose-with-tanstack-query skill).
- Three `*SelectedRowModel` APIs sharing one implementation is as designed.
- `column_getAutoSortFn` `.slice(10)` is a known bug to be fixed later — not a v1 failure mode.
- Lit adapter scheduled for rewrite with TanStack Lit Store during beta — Lit skills note this.

**Resolved scope/style questions:**

- Signal-based adapters (Solid / Angular / Svelte) support BOTH native framework state and TanStack Store atoms equally. Skills should lead with native state in those frameworks; atoms are the alternative for cross-app sharing.
- Non-React adapter docs are intentionally thinner — React Compiler complicated React; Subscribe matters less in signal-based adapters.
- `state` + `on*Change` is intentionally redundant with `atoms` — kept for backward-compat.

**New maintainer-sourced top-tier failure modes (added across 12+ skills):**

1. **Hallucinating react-table v7 / pre-v9 `@tanstack/[framework]-table` APIs** (CRITICAL). Every major version was a substantial upgrade; agents confidently produce v7/v8 shapes.
2. **Reimplementing what TanStack Table's built-in APIs already provide** (CRITICAL). The #1 tell of AI-written code. TanStack Table IS a state-management coordinator with APIs for nearly every transition (`setSorting`, `toggleSelected`, `nextPage`, `setColumnFilters`, …).
3. **API or state slice "missing" because feature not registered in `features`** (CRITICAL, v9-specific). v9 is the first version where features must be declared for TS inference and runtime API exposure.
4. **Bundling `stockFeatures` or unused features wastes the v9 tree-shake** (HIGH).
5. **Premature `Subscribe`/selector optimization on small tables** (MEDIUM). Advanced state-management patterns are for advanced use cases.

## Open Gaps (carry forward)

26 gaps remain after the Phase 4 interview. The maintainer addressed scope/style centrally; remaining gaps are mostly forward-looking (Phase 6 SKILL.md generation will resolve or note as future work).

| Skill                             | Question                                                                                                                         | Status |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `state-management`                | When `atoms.x` is registered, does calling `table.resetX()` reset the external atom or only the baseAtom? Docs say "Slice reset… | open   |
| `state-management`                | Is there a runtime warning when `state.x` and `atoms.x` are both supplied? Source shows silent precedence (atom wins) — should … | open   |
| `setup`                           | For vanilla JS (`@tanstack/table-core` direct), is `storeReactivityBindings()` strictly required, or is there a no-reactivity p… | open   |
| `customizing-feature-behavior`    | Are `filterFn.autoRemove` and `filterFn.resolveFilterValue` part of the recommended public surface for custom fns, or implement… | open   |
| `—`                               |                                                                                                                                  | open   |
| `—`                               |                                                                                                                                  | open   |
| `—`                               |                                                                                                                                  | open   |
| `—`                               |                                                                                                                                  | open   |
| `—`                               |                                                                                                                                  | open   |
| `—`                               |                                                                                                                                  | open   |
| `—`                               |                                                                                                                                  | open   |
| `—`                               |                                                                                                                                  | open   |
| `table-state (Angular)`           | Is there a recommended pattern for using TanStack Store external atoms with Angular signals end-to-end, or do users always go t… | open   |
| `react-subscribe-compiler-compat` | When the agent emits `table.getState().X` in render, is that wrong?                                                              | open   |
| `migrate-v8-to-v9`                | How do v8 `getCoreRowModel()` / `getSortedRowModel()` etc. map to v9?                                                            | open   |
| `migrate-v8-to-v9`                | How do I convert a v8 useReactTable site to v9 useTable + Subscribe?                                                             | open   |
| `composable-tables`               | When should I use createTableHook vs useTable directly?                                                                          | open   |
| `angular-rendering-directives`    | How do I correctly render Angular components from cells / handle signals?                                                        | open   |
| `rendering`                       | How do I write a performant Svelte 5 table without mergeObjects chain growth?                                                    | open   |
| `compose-with-tanstack-virtual`   | How do I combine TanStack Table v9 with TanStack Virtual safely?                                                                 | open   |
| `state-management`                | What is the "controlled vs uncontrolled" model in v9?                                                                            | open   |
| `row-selection`                   | How do I implement "tristate parent + selectable leaves" UX?                                                                     | open   |
| `pagination`                      | How do I avoid the autoResetPageIndex + deep-linking trap?                                                                       | open   |
| `setup`                           | What stability requirements do v9 options have?                                                                                  | open   |
| `customizing-feature-behavior`    | How do I author or extend a custom TableFeature in v9?                                                                           | open   |
| `compose-with-tanstack-form`      | How do I put editable form inputs in cells without losing focus?                                                                 | open   |

## Excluded From v1 (Confirmed)

- **Custom-feature authoring** (writing your own plugin via the `TableFeature` interface) — experimental, `TData` generic doesn't flow through. NOTE: `tableFeatures()` the utility itself is essential and stable; it's in every v9 setup. Only authoring custom features is excluded.
- **Per-UI-library composition skills** (shadcn, Mantine, Material UI, React Aria, HeroUI) — third-party libs update independently; agents should adapt from kitchen-sink examples.
- **Built-in data editing** — `compose-with-tanstack-form` covers this.
- **Drag-and-drop** — `@dnd-kit/core` is the recommended external lib.
- **Virtualization** — `compose-with-tanstack-virtual`.
- **Async fetching** — `compose-with-tanstack-query`.
- **Accessibility hotkeys** — `compose-with-tanstack-hotkeys` deferred to v1.1.

## Recommended Skill File Structure

```text
_artifacts/
  domain_map.yaml          # this domain map
  skill_spec.md            # this human-readable companion
packages/
  table-core/skills/<slug>/SKILL.md          # 12 core skills (setup, column-definitions, state-management, customizing-feature-behavior, filtering, sorting, pagination, grouping, row-expanding, column-layout, row-pinning, row-selection)
  react-table/skills/<slug>/SKILL.md         # table-state, react-subscribe-compiler-compat, getting-started, migrate-v8-to-v9, client-to-server, production-readiness, compose-with-tanstack-store, compose-with-tanstack-query, compose-with-tanstack-virtual, compose-with-tanstack-form, compose-with-tanstack-pacer
  vue-table/skills/<slug>/SKILL.md           # table-state, getting-started, migrate-v8-to-v9, client-to-server, production-readiness + composition skills
  solid-table/skills/<slug>/SKILL.md         # same pattern
  svelte-table/skills/<slug>/SKILL.md        # same pattern
  angular-table/skills/<slug>/SKILL.md       # adds angular-rendering-directives
  lit-table/skills/<slug>/SKILL.md           # adds lit-table-controller; beta-rewrite caveat
  preact-table/skills/<slug>/SKILL.md        # mirrors React minus Subscribe-compat
  react-table-devtools/skills/compose-with-tanstack-devtools/SKILL.md
  vue-table-devtools/skills/compose-with-tanstack-devtools/SKILL.md
  solid-table-devtools/skills/compose-with-tanstack-devtools/SKILL.md
  preact-table-devtools/skills/compose-with-tanstack-devtools/SKILL.md
```
