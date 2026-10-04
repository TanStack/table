# TanStack Table v9 skill specification

Status: reviewed<br>
Date: 2026-10-04<br>
Library target: TanStack Table v9, authored in stable-release voice<br>
Package metadata target: exact workspace package versions; release automation keeps every shipped skill synchronized

This specification is the generation contract for a deliberately smaller, foot-gun-first TanStack Intent skill set. It is not a documentation outline. The complete evidence and failure-mode inventory is in domain_map.yaml.

## Outcome

Generate 39 package-local entry points across all 18 public packages, with the supporting references declared in skill_tree.yaml. A loaded skill should quickly do three things:

1. Correct the user or agent mental model.
2. Show the smallest reliable setup or decision pattern.
3. Route exact API discovery to installed package declarations (`dist/**/*.d.ts`, Ember `declarations/**/*.d.ts`, Angular `dist/types/*.d.ts`).

The skills should not enumerate every option or method. That duplicates generated reference docs, ages badly, and encourages agents to recall the wrong major version.

## Maintainer intent

- TanStack Table is headless. It coordinates table state and row processing; the user owns markup, styles, accessibility, and component-library integration.
- V9 optional features are plugins. A feature API, state slice, row model, or function registry exists only when the matching feature is registered through tableFeatures.
- The client/server row-model boundary is a first-order architecture decision. Manual modes bypass Table processing; they do not perform server work.
- Most userland TypeScript should be inferred through helpers, features, options, and app-hook factories. Deep manual generics are a smell.
- createTableHook is important v9 guidance for reusable app-level table infrastructure. It deserves one dedicated reference linked from every framework getting-started skill.
- Framework table-state guidance is fundamental and should retain substantially more depth than ordinary feature skills.
- Data and columns are model inputs and must retain stable references between meaningful changes in every adapter and composition example.
- V8-to-v9 migration is a primary route. Deprecated useLegacyTable is not the destination and must not be promoted.
- TanStack Query usually owns data before it reaches Table. TanStack Virtual is intertwined with Table rendering after the final row/column model exists.
- CSS/layout failure modes belong in the relevant pinning, sizing, resizing, and virtualization references. Component-library-specific skills do not.
- Worker row models are excluded.

## Source-of-truth hierarchy

Use evidence in this order:

1. Installed package declarations (`.d.ts`) for exact exports, type signatures, feature prerequisites, defaults, and instance APIs.
2. Current v9 guides for intended mental models and supported workflows.
3. Current examples for maintained composition and rendering patterns.
4. Recent and recurring GitHub issues/discussions for silent failures and misconceptions.

Every skill that discusses APIs must tell the consuming agent how to inspect the matching installed declarations. Preferred routes:

- Adapter API: node_modules/@tanstack/FRAMEWORK-table/dist/index.d.ts, then the matching exported `*.d.ts` file.
- Core API: node_modules/@tanstack/table-core/dist/index.d.ts.
- Stock feature API: node_modules/@tanstack/table-core/dist/features/FEATURE/.
- Ember API: node_modules/@tanstack/ember-table/declarations/index.d.ts (and sibling `declarations/*.d.ts`).
- Angular API: node_modules/@tanstack/angular-table/dist/types/\*.d.ts (bundled public API; do not expect `src/helpers/` under the published package).
- Octane API: node_modules/@tanstack/octane-table/src/index.d.ts, the matching `*.tsrx.d.ts` sidecar, and `src/types.ts` (the package intentionally distributes authored source).
- Devtools API: node_modules/@tanstack/FRAMEWORK-table-devtools/dist/index.d.ts or @tanstack/table-devtools/dist/index.d.ts.
- Fuzzy ranking API: node_modules/@tanstack/match-sorter-utils/dist/index.d.ts.

Do not open package `src/` under `node_modules` unless the package intentionally publishes source, as `@tanstack/octane-table` does. Do not direct agents to a GitHub main-branch source file when an installed package is available. Installed declarations and published source keep guidance aligned with the consumer package version.

## Skill writing contract

### Frontmatter

Each generated SKILL.md must satisfy the current TanStack Intent validator:

- name is the leaf directory segment.
- description is a dense routing description no longer than 1024 characters.
- metadata contains type, library, library_version, and framework when applicable.
- sources remains top-level and lists only repo files/directories actually used by that skill.
- framework skills include a top-level requires array.
- no skill exceeds 500 lines.

The metadata version must record the exact package version even though prose treats v9 as stable. Do not call ordinary v9 APIs experimental or advise waiting for stable.

### Artifacts before generated files

Use the installed Intent `tree-generator` and `generate-skill` Mode A workflows. The reviewed domain map contains the knowledge inventory and failure modes. This specification defines placement. Update `skill_tree.yaml` from both before generating any skill or reference.

Each item in `domain_map.yaml#skills` produces one `SKILL.md`. Its nested `references` entries retain their purpose, source evidence, and failure modes, and produce the paths listed in the corresponding tree entry. A moved topic remains covered through that reference. Do not restore its old discovery entry during regeneration.

The maintainer approved the progressive-disclosure proposal and batch implementation on 2026-10-04. Preserve prior reviewed technical decisions while changing their placement. This is generation from existing reviewed artifacts, not a new-library discovery interview.

### Body shape and disclosure

Keep shared purpose, essential constraints, the minimum valid setup, and routing in `SKILL.md`. Prefer 60-120 lines for ordinary entry points; preserve correctness when a framework needs more. The 500-line ceiling is a guard, not a reason to delay references.

- Use the core overview and routing format for `core`, the standard procedure format for setup and state, and Intent's checklist format for migration.
- Split conditional content by the task it serves. Optional features, Query, Virtual, reusable app hooks, advanced reactivity, and detailed migration maps belong in their declared references.
- Give each reference a direct relative Markdown link in the owning `SKILL.md` and an explicit condition for reading it. A list of filenames without read conditions is insufficient.
- Read references for the requested change and relevant existing registrations, including features being added. A feature being installed or registered alone does not require reading its reference.
- Each reference is ordinary Markdown with a descriptive title, purpose, source provenance, and maintained examples. It has no skill frontmatter and inherits its owning package version.
- Keep related feature references separate: row/cell selection, sizing/resizing, and each pinning feature have different behavior and prerequisites.
- Keep shared essential gotchas inline. Retain concrete feature-specific failure modes in the matching reference. Use wrong/correct examples only when they explain a real failure; a router does not need three artificial mistakes.
- Use `requires` only for unconditional skill prerequisites, and state those reads in prose. Intent load returns one entry point; it does not automatically load prerequisites or references.
- Use Markdown links within a package. Resolve cross-package skills with `intent load <package>#<skill>`; do not assume a hoisted sibling package or a repository-only path exists in a consumer install.
- Keep exact API discovery rooted in installed package declarations.

### Migration coverage

Core `migrate-v8-to-v9` owns the complete shared audit checklist. Its architecture, state, feature-apis, and typescript references preserve every shared breaking change from the reviewed domain map. Audit the whole checklist and read detailed mappings for affected code.

Each adapter migration entry point explicitly loads the core migration skill and adds its framework-version, construction, rendering, state, and app-hook checks. Its adapter-migration reference contains framework-specific detail. Shared rename tables and inventories have one authoritative home in core. Preserve complete migration coverage across the entry point and referenced files.

### State coverage

Core `table-state` owns internal/default ownership, feature-gated slices, baseAtoms/atoms/store, controlled-value/updater pairing, external-atom precedence, initialization, resets, and state inference. It routes reactive consumption to the installed adapter.

Each adapter `table-state` requires the core state skill. Keep its essential snapshot-versus-tracked-read distinction, supported subscription APIs, controlled wiring, and adapter-specific correctness warnings inline. Its reactivity reference holds advanced boundaries and extended examples. State repair in an existing table does not require getting-started.

### Stable model-input invariant

Treat stable `data` and `columns` references as a correctness and performance invariant, including in client/server and Query examples. Never place `.map()`, `.filter()`, `.slice()`, a column factory, or a fresh `[]` fallback inline in table options that can be reevaluated. Use module/component-lifetime constants, framework memo/computed primitives, stable reactive containers, or stable Query result arrays. “Manual” row processing changes ownership; it does not relax reference stability.

### Custom-feature completeness exception

The custom-features plugin-example reference must enumerate all 10 public declaration-merge FeatureMaps: table state, table options, table, column definition, column, row, cell, header, row-model functions, and cached row models. Explain that `Plugins` registers the feature key and that declarations add types only; each advertised runtime surface needs matching lifecycle wiring.

Enumerate both API utilities and every installation path: `assignTableAPIs` in `constructTableAPIs`, plus `assignPrototypeAPIs` in `assignColumnPrototype`, `assignRowPrototype`, `assignCellPrototype`, and `assignHeaderPrototype`. Include the static-name prefixes, prototype self argument, optional `memoDeps`, shared-prototype constraint, `initColumnInstanceData`/`initRowInstanceData`, and the fact that per-object `assignColumnAPIs`-style utilities do not exist. Clearly label row-model maps as advanced internal pipeline surfaces requiring explicit runtime/cache wiring.

Use one annotated, authoritative feature example for the complete shape. Do not stack a minimal density example, a second FeatureMap example, a third API-installation example, and then repeat their distinction under Common Mistakes. Keep the custom-features entry point focused on plugin selection and implementation steps, with a direct instruction to read the checked example before implementing lifecycle wiring.

### Code examples

- Use v9 names and shapes only unless a migration skill is explicitly contrasting v8.
- Use the smallest feature set needed by the example.
- Keep features, data, columns, and other static inputs stable. Derive changing data with the adapter's memo/computed primitive and never use fresh inline fallback arrays in repeated option evaluation.
- Show row-model factories as slots in tableFeatures, after their prerequisite feature.
- Keep markup generic and unstyled unless demonstrating a CSS/layout foot-gun.
- Prefer helper inference over explicit Table feature generic plumbing.
- Never show useLegacyTable as the recommended solution.

### Common Mistakes quality bar

A mistake must be plausible, consequential, and grounded in source, docs, examples, or maintainer/community evidence. Prefer failures that compile or render but behave incorrectly:

- missing feature registration;
- manual mode bypasses a row model;
- snapshot read is not a framework subscription;
- controlled callback does not write back the updater;
- unstable data/columns/features redo work;
- hidden columns rendered from non-visibility-aware APIs;
- pinning/sizing state not applied in CSS;
- off-page selected IDs mistaken for loaded Row objects;
- v8 or another adapter API hallucinated from memory.

Avoid padding Common Mistakes with generic advice such as read the docs, handle errors, or add tests.

Use Wrong/Correct only when the Wrong form is demonstrably broken or misleading. Do not place a valid default, canonical adapter pattern, or supported tradeoff in the Wrong slot. Present those cases as decisions with consequences instead.

### Executable validation

- `intent validate` checks structure, frontmatter, sources, requires, and artifacts.
- `skills:versions:check` compares each skill's `metadata.library_version` with its package and verifies artifact overrides.
- `test:skill-tree` checks artifact/file coverage, direct reference links, local link targets, skill dependencies, source provenance, Intent consumer discovery/loading, and packaged references.
- `test:skill-content` checks high-risk generated-content invariants in entry points and references, including Markdown table shape, package imports, feature gating, stable empty fallbacks, adapter subscription shapes, and resize input events.
- Add `<!-- skill-snippet:check -->` immediately before a self-contained TypeScript/TSX fence when its exact code is load-bearing. `test:skill-snippets` compiles each marked fence in entry points and references against workspace source. A marker may specify `prelude=path` or `tsconfig=path` when the snippet needs an explicit checked context.
- Virtual composition guidance must be copied from or kept structurally faithful to the maintained adapter guide/example. When evidence is absent, route to the documented supported composition instead of inventing an adapter package or API.

These checks run in `pnpm test:skills`. They supplement review; they do not justify expanding skills into API summaries.

### Release version synchronization

Skill versions ship with package versions. After release tooling calculates package versions, run `pnpm skills:versions:fix` before publishing and `pnpm skills:versions:check` as a guard. The sync updates package-local skill frontmatter and repo-root artifact version overrides together.

## Routing taxonomy

### Foundations and migration: @tanstack/table-core

Five entry points remain directly discoverable:

- `core`: headless model, stable inputs, minimal typed setup, and routing. References own TypeScript troubleshooting, missing API diagnosis, and row/display-index details.
- `table-features`: feature registration, prerequisites, row-model and function slots. References own client/server boundaries and each of the 17 optional features.
- `table-state`: shared ownership, initialization, updates, reset semantics, and adapter-state routing.
- `custom-features`: plugin authoring workflow and one complete checked plugin example in a reference.
- `migrate-v8-to-v9`: complete shared audit checklist and conditional architecture, state, feature API, and TypeScript mappings.

### Optional feature references

The `table-features` entry point directly links aggregation, cell-selection, cell-spanning, column-faceting, column-filtering, column-ordering, column-pinning, column-resizing, column-sizing, column-visibility, expanding, global-filtering, grouping, pagination, row-pinning, row-selection, and sorting.

Each feature reference names its feature import, relevant row-model/registry slots, prerequisites, state/processing/renderer responsibilities, installed declaration directory, and the feature-specific failure modes retained in the domain map.

### Framework adapter set

All ten adapters have `getting-started` and `table-state` entry points. React, Preact, Solid, Svelte, Vue, Angular, and Lit also retain `migrate-v8-to-v9`. State and migration entry points have their own conditional detailed references.

Every getting-started skill directly links a `references/create-table-hook.md`. React, Preact, Solid, Svelte, Vue, and Angular also link `references/with-tanstack-query.md` and `references/with-tanstack-virtual.md`. Lit also links Virtual. Broaden the getting-started description to route ongoing adapter work and these supported integrations.

Keep framework-specific examples in their package. Do not add Query or Virtual guidance where no maintained adapter guide/example exists. Alpine, Ember, and Octane have no v8 adapter migration journey.

### Devtools set (6)

Each Devtools package ships one skill named devtools:

- @tanstack/table-devtools
- @tanstack/react-table-devtools
- @tanstack/preact-table-devtools
- @tanstack/solid-table-devtools
- @tanstack/vue-table-devtools
- @tanstack/angular-table-devtools

All Devtools skills must emphasize the required non-empty table options.key, lifecycle-aware registration, unique keys, and development/production export behavior. Keep the framework-neutral package focused on target registration and inspection; keep adapters focused on their hook/injection/plugin lifecycle.

### Utility set (1)

@tanstack/match-sorter-utils ships fuzzy-ranking. Teach the three-stage pattern: rank with rankItem, filter with RankingInfo.passed, then sort stored metadata with compareItems. Route Table-specific filter metadata wiring to column-filtering/global-filtering rather than turning this utility skill into a Table feature summary.

## Package coverage

| Package                          | Entry points |
| -------------------------------- | -----------: |
| @tanstack/table-core             |            5 |
| @tanstack/react-table            |            3 |
| @tanstack/preact-table           |            3 |
| @tanstack/octane-table           |            2 |
| @tanstack/solid-table            |            3 |
| @tanstack/svelte-table           |            3 |
| @tanstack/vue-table              |            3 |
| @tanstack/angular-table          |            3 |
| @tanstack/lit-table              |            3 |
| @tanstack/alpine-table           |            2 |
| @tanstack/ember-table            |            2 |
| @tanstack/table-devtools         |            1 |
| @tanstack/react-table-devtools   |            1 |
| @tanstack/preact-table-devtools  |            1 |
| @tanstack/solid-table-devtools   |            1 |
| @tanstack/vue-table-devtools     |            1 |
| @tanstack/angular-table-devtools |            1 |
| @tanstack/match-sorter-utils     |            1 |
| Total                            |           39 |

`pnpm test:skills` verifies the file inventory against the tree. A React consumer with core discovers eight Table entry points. Plain reference files never appear as independent Intent skills.

## Framework distinctions that must survive generation

### React

- useTable returns selected table.state; the default selector selects all registered state.
- table.atoms.get and table.store.state are snapshot reads, not React subscriptions.
- Subscribe is the supported fine-grained boundary and React Compiler escape hatch for builder-method reads hidden in memoized children.
- Do not prescribe fine-grained subscription machinery until render cost or compiler behavior requires it.

### Preact

- Use the native Preact package, not React through preact/compat.
- State selection and Subscribe resemble React but must use Preact adapter/store imports.

### Octane

- The package distributes authored TypeScript and TSRX; consumer tooling compiles it for the current target and mode. Components use TSRX component bodies plus keyed `@for` loops where appropriate.
- `useTable` stages fresh options for same-render reads, selects `table.state`, and publishes controlled state only from an accepted layout commit; abandoned work cannot notify the store.
- Render `table.Subscribe` and the createTableHook App wrappers as components so each has an independent Octane hook/context scope; never invoke them as plain functions.
- Use `@tanstack/octane-store` for external atoms. External atoms are synchronous owners and take precedence over controlled `options.state`.
- Native text inputs update on `onInput`; `onChange` follows native change timing rather than React's input-event alias.

### Solid

- createTable atoms are backed by Solid primitives; reads are reactive only inside tracked scopes.
- Prefer native signals for framework-owned state and external TanStack Store atoms for cross-app atom ownership.

### Svelte

- V9 targets Svelte 5 and runes.
- Read a slice with `table.atoms.<slice>.get()` and the complete state with `table.store.get()` inside templates, `$derived`, `$derived.by`, or `$effect`; reads outside tracked scopes are current snapshots.
- Starting in beta.59, Svelte has no table-creation selector, selected `table.state`, `subscribeTable`, or `SubscribeSource`; use native `$derived` projections instead.
- Prefer `$state` plus getter-backed controlled slices, or `createTableState` for an updater-compatible getter/setter pair. Keep `useSelector` only for raw external atoms consumed outside the table.
- Reactive data and controlled values commonly need getters; avoid passing snapshots.
- The shipped `createTableHook` implementation supplies rune semantics, so an app hook that calls it may live in a normal `.ts` module.

### Vue

- Preserve refs/computed/reactive option shapes rather than destructuring snapshots.
- In JSX, table.Subscribe receives children as an explicit prop.
- The composable component registry may require explicit exported context-hook types to break circular inference.

### Angular

- injectTable, injectAppTable, Devtools injection, and returned context helpers require Angular injection context.
- Signal reads inside the options initializer cause setOptions to run again; keep features/columns and other static values outside it.
- Preserve FlexRender directive and component-vs-function rendering distinctions.

### Lit

- TableController is a stable host field; v9 passes options to controller.table during render.
- Keep selector references stable.
- createTableHook table-level controls may consume context from custom elements rather than a JSX-style tableComponents registry.

### Alpine

- The table proxy automatically makes API reads reactive inside Alpine bindings; there is no table.Subscribe.
- x-html does not initialize nested Alpine directives.
- createTableHook shares features/options/helpers, not a reusable component registry.

### Ember

- `useTable` and `createAppTable` take options thunks; tracked values must be read inside the thunk while features, atoms, and columns remain stable.
- Glimmer tracks table API and Ember atom reads directly. There is no table.Subscribe, `table.store.subscribe` is intentionally a no-op, and v8 `table.getState()` is removed.
- V9 prototype methods need their receiver, so templates use getters or module helpers rather than extracted table/column/row methods.
- FlexRender components receive `@ctx` and optional `@options`.
- Ember createTableHook shares features/defaults and inferred column helpers; it does not provide component or context registries.

## Cross-cutting placement rules

- Performance: stable inputs in getting-started/core; adapter-specific fine-grained state reads or selectors in table-state; CSS variables in resizing; measurement/overscan in Virtual; row ownership in client-vs-server.
- CSS: pinning, sizing, resizing, and Virtual references only. Core may state that CSS is user-owned.
- Accessibility: core/getting-started may remind that headless rendering leaves semantics and interaction accessibility with the renderer; do not create a component-library integration skill.
- Query: data source and manual processing boundaries, not Table rendering.
- Virtual: final Table models and renderer geometry, never tableFeatures.
- Context: createTableHook references; mention context over prop drilling when a registered reusable component needs typed table/cell/header access.
- API lookup: core/references/api-not-found.md establishes the workflow; every other skill includes its direct installed declaration route.

## Anti-patterns forbidden during generation

- A skill that is primarily a list of every exported API.
- One giant all-features or all-frameworks skill.
- Per-component-library skills or shadcn/MUI/Mantine-specific code.
- Worker row-model instructions.
- A dedicated generic performance checklist divorced from the feature causing the work.
- V8 setup in non-migration examples.
- useLegacyTable as a recommended quick start.
- Deep explicit generic signatures copied from internal types when helpers can infer them.
- Claims that pinning, sizing, resizing, expansion, or virtualization render their UI/CSS automatically.
- Claims that a manual flag calls a backend.

## Maintainer review decisions

The maintainer accepted these generation positions on 2026-07-10:

1. Explicit features are the default; stockFeatures is for migration and kitchen-sink convenience.
2. Mixed client/server pipelines are valid only when the skill names the owner and available dataset for every stage.
3. createTableHook is recommended for recurring app conventions; standalone construction remains appropriate for one-offs.
4. Typed context/injection helpers from createTableHook are preferred over prop drilling inside registered components.
5. useLegacyTable is mentioned only when encountered, as a deprecated temporary bridge rather than a migration target.
6. Virtual references teach maintained examples and only identify unsupported combinations as user-owned composition.
7. Devtools guidance is development-only by default; production entrypoints are explained only when explicitly requested.

Domain discovery is reviewed and tree generation may proceed.

## Consumer compatibility and validation

Moved topic IDs are intentionally removed from discovery. Document their owning entry points in docs/agent-skills.md. Consumers using explicit `install --map` mappings must regenerate them. Consumers allowing individual old IDs in `intent.skills` must select the replacement entry points. Preserve a small catalog by avoiding forwarding SKILL.md files.

Verify the pinned Intent 0.4.0 behavior in an isolated consumer install: list/catalog counts, default and mapped guidance, single-file loading, conditional reference links, and prerequisites. Check that package tarballs contain the references. Measure discovery text and task-specific reads separately. Run the content and annotated-snippet checks after all moves, and include a changeset because these files ship inside published packages.
