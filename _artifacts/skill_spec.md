# TanStack Table v9 skill specification

Status: reviewed  
Date: 2026-07-10  
Library target: TanStack Table v9, authored in stable-release voice  
Package metadata target: exact workspace package versions; release automation keeps every shipped skill synchronized

This specification is the generation contract for a deliberately smaller, foot-gun-first TanStack Intent skill set. It is not a documentation outline. The complete evidence and failure-mode inventory is in domain_map.yaml.

## Outcome

Generate 75 short package-local skills across all 17 public packages. A loaded skill should quickly do three things:

1. Correct the user or agent mental model.
2. Show the smallest reliable setup or decision pattern.
3. Route exact API discovery to src shipped in the installed package.

The skills should not enumerate every option or method. That duplicates generated reference docs, ages badly, and encourages agents to recall the wrong major version.

## Maintainer intent

- TanStack Table is headless. It coordinates table state and row processing; the user owns markup, styles, accessibility, and component-library integration.
- V9 optional features are plugins. A feature API, state slice, row model, or function registry exists only when the matching feature is registered through tableFeatures.
- The client/server row-model boundary is a first-order architecture decision. Manual modes bypass Table processing; they do not perform server work.
- Most userland TypeScript should be inferred through helpers, features, options, and app-hook factories. Deep manual generics are a smell.
- createTableHook is important v9 guidance for reusable app-level table infrastructure. It deserves one dedicated skill in every framework package.
- Framework table-state guidance is fundamental and should retain substantially more depth than ordinary feature skills.
- Data and columns are model inputs and must retain stable references between meaningful changes in every adapter and composition example.
- V8-to-v9 migration is a primary route. Deprecated useLegacyTable is not the destination and must not be promoted.
- TanStack Query usually owns data before it reaches Table. TanStack Virtual is intertwined with Table rendering after the final row/column model exists.
- CSS/layout failure modes belong in the relevant pinning, sizing, resizing, and virtualization skills. Component-library-specific skills do not.
- Worker row models are excluded.

## Source-of-truth hierarchy

Use evidence in this order:

1. Installed package src for exact exports, type signatures, feature prerequisites, defaults, and instance APIs.
2. Current v9 guides for intended mental models and supported workflows.
3. Current examples for maintained composition and rendering patterns.
4. Recent and recurring GitHub issues/discussions for silent failures and misconceptions.

Every skill that discusses APIs must tell the consuming agent how to inspect the matching installed source. Preferred routes:

- Adapter API: node_modules/@tanstack/FRAMEWORK-table/src/index.ts, then the exported implementation/type file.
- Core API: node_modules/@tanstack/table-core/src/index.ts.
- Stock feature API: node_modules/@tanstack/table-core/src/features/FEATURE/.
- Devtools API: node_modules/@tanstack/FRAMEWORK-table-devtools/src/index.ts or @tanstack/table-devtools/src/index.ts.
- Fuzzy ranking API: node_modules/@tanstack/match-sorter-utils/src/index.ts.

Do not direct agents to a GitHub main-branch source file when an installed package is available. Installed source keeps guidance aligned with the consumer package version.

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

### Body shape

Prefer 60-180 lines. Table-state, migration, createTableHook, and Virtual skills may be longer when the adapter genuinely differs.

Use this default structure:

1. One-paragraph mental model.
2. Setup: imports and the smallest valid configuration.
3. Two to four decision or implementation patterns.
4. Common mistakes: at least three concrete failures with correction.
5. API discovery: exact installed src route and identifiers to inspect.
6. Cross-skill routing only when another skill owns the next decision.

Do not add a reference folder by default. Add one only when a large migration mapping or framework-specific content cannot stay concise in SKILL.md. Progressive disclosure is a size tool, not permission to recreate all docs as references.

### Migration skill exception

The table-core and seven adapter migrate-v8-to-v9 skills are intentionally comprehensive. They may approach the 500-line limit and must list every breaking change in the maintained migration guide, not merely three common mistakes or a short route to the docs.

Every adapter migration skill must be usable on its own and include:

- its framework-version prerequisite, package change, and construction entrypoint mapping;
- the complete shared architecture changes for tableFeatures, all stock feature imports, row-model slots, function registries, and stockFeatures audit guidance;
- the full logical start/end column-pinning mapping;
- prototype-method binding and enumeration/spread consequences;
- state access, selector/subscription, controlled-state, external-atom, precedence, and onStateChange changes for that adapter;
- createColumnHelper/columns(), rendering, tableOptions, and createTableHook changes;
- pinning-option, sizing/resizing, sorting, removed-internal, row, and row-selection API changes;
- all TypeScript generic, meta, function-registry augmentation, StockFeatures, and RowData changes;
- an exhaustive checkbox audit at the end.

Do not rely on the core migration skill to hide shared changes from an adapter migration. The requires relationship supplies context, but migration users commonly load only the adapter skill and need the full audit surface there. Keep detailed mappings in SKILL.md unless the file would exceed Intent's 500-line limit.

### Table-state skill exception

Every framework table-state skill must preserve substantially more of its guide than an ordinary feature skill because state coordination is the library's foundational behavior. Include:

- internal state as the default and the reasons to hoist only selected slices;
- feature-gated state and typing;
- `baseAtoms`, readonly derived `atoms`, the flat `store`, and any adapter-selected `table.state` surface;
- snapshot reads versus the adapter's tracked/subscribed reads;
- one owner per slice across internal state, `initialState`, external `atoms`, and `state` plus `on[State]Change`;
- precedence, value-or-updater handling, and removal of the v8 global `onStateChange` option;
- preferred feature-method writes, low-level base-atom writes, initial/reset semantics, and externally owned reset limitations;
- feature-specific types and `TableState<typeof features>` inference;
- framework-specific selector, subscription, compiler, signal, rune, ref, controller, or proxy behavior.

Retain concrete wrong-versus-correct examples for the adapter's most likely subscription and controlled-state mistakes. Table-state skills may exceed the normal 180-line target while remaining below Intent's 500-line limit.

### Stable model-input invariant

Treat stable `data` and `columns` references as a correctness and performance invariant, including in client/server and Query examples. Never place `.map()`, `.filter()`, `.slice()`, a column factory, or a fresh `[]` fallback inline in table options that can be reevaluated. Use module/component-lifetime constants, framework memo/computed primitives, stable reactive containers, or stable Query result arrays. “Manual” row processing changes ownership; it does not relax reference stability.

### Custom-feature completeness exception

The custom-features skill must enumerate all 10 public declaration-merge FeatureMaps: table state, table options, table, column definition, column, row, cell, header, row-model functions, and cached row models. Explain that `Plugins` registers the feature key and that declarations add types only; each advertised runtime surface needs matching lifecycle wiring.

Enumerate both API utilities and every installation path: `assignTableAPIs` in `constructTableAPIs`, plus `assignPrototypeAPIs` in `assignColumnPrototype`, `assignRowPrototype`, `assignCellPrototype`, and `assignHeaderPrototype`. Include the static-name prefixes, prototype self argument, optional `memoDeps`, shared-prototype constraint, `initColumnInstanceData`/`initRowInstanceData`, and the fact that per-object `assignColumnAPIs`-style utilities do not exist. Clearly label row-model maps as advanced internal pipeline surfaces requiring explicit runtime/cache wiring.

Use one annotated, authoritative feature example for the complete shape. Do not stack a minimal density example, a second FeatureMap example, a third API-installation example, and then repeat their distinction under Common Mistakes. Keep selection guidance and foot-guns as compact prose around the single example.

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
- `test:skill-content` checks high-risk generated-content invariants, including Markdown table shape, package imports, feature gating, stable empty fallbacks, adapter subscription shapes, and resize input events.
- Add `<!-- skill-snippet:check -->` immediately before a self-contained TypeScript/TSX fence when its exact code is load-bearing. `test:skill-snippets` compiles each marked fence against workspace source. A marker may specify `prelude=path` or `tsconfig=path` when the snippet needs an explicit checked context.
- Virtual composition guidance must be copied from or kept structurally faithful to the maintained adapter guide/example. When evidence is absent, route to the documented supported composition instead of inventing an adapter package or API.

These checks run in `pnpm test:skills`. They supplement review; they do not justify expanding skills into API summaries.

### Release version synchronization

Skill versions ship with package versions. After release tooling calculates package versions, run `pnpm skills:versions:fix` before publishing and `pnpm skills:versions:check` as a guard. The sync updates package-local skill frontmatter and repo-root artifact version overrides together.

## Routing taxonomy

### Foundations and migration — @tanstack/table-core (7)

- core — headless philosophy, core model, stable inputs, renderer ownership.
- table-features — explicit registration, prerequisites, row-model/function slots, tree-shaking.
- client-vs-server — choose ownership for filtering/grouping/sorting/expanding/pagination.
- typescript — columnHelper, meta helpers, tableOptions, inference, avoid manual generics.
- api-not-found — inspect installed src, feature gating, version/adapter mismatch, prototypes.
- custom-features — plugin lifecycle after exhausting built-in APIs and meta.
- migrate-v8-to-v9 — shared breaking changes and adapter migration routing.

### Stock feature plugins — @tanstack/table-core (14)

- column-faceting
- column-filtering
- grouping
- column-ordering
- column-pinning
- column-resizing
- column-sizing
- column-visibility
- global-filtering
- expanding
- pagination
- row-pinning
- row-selection
- sorting

Each feature skill must:

- name the feature import;
- name only row-model and registry slots relevant to that feature;
- state its tableFeatures prerequisites;
- distinguish state from row processing and renderer behavior;
- route exact API discovery to its shipped feature directory;
- include feature-specific edge cases from domain_map.yaml.

Do not combine all column layout features into one summary. Their plugin prerequisites and CSS responsibilities differ enough to route independently.

### Framework adapter set

React, Preact, Solid, Svelte, Vue, and Angular each ship six skills:

- getting-started
- table-state
- migrate-v8-to-v9
- create-table-hook
- with-tanstack-query
- with-tanstack-virtual

Lit ships five:

- getting-started
- table-state
- migrate-v8-to-v9
- create-table-hook
- with-tanstack-virtual

Alpine ships three:

- getting-started
- table-state
- create-table-hook

Ember ships three:

- getting-started
- table-state
- create-table-hook

Do not add Query where no maintained adapter example exists. Do not add Alpine or Ember migration skills because neither has a v8 adapter journey to teach. Do not add Ember Query or Virtual skills until maintained adapter examples exist. Do not invent Preact virtualization examples; its Virtual skill should rely on the maintained adapter guide and installed APIs.

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

| Package                          | Skills |
| -------------------------------- | -----: |
| @tanstack/table-core             |     21 |
| @tanstack/react-table            |      6 |
| @tanstack/preact-table           |      6 |
| @tanstack/solid-table            |      6 |
| @tanstack/svelte-table           |      6 |
| @tanstack/vue-table              |      6 |
| @tanstack/angular-table          |      6 |
| @tanstack/lit-table              |      5 |
| @tanstack/alpine-table           |      3 |
| @tanstack/ember-table            |      3 |
| @tanstack/table-devtools         |      1 |
| @tanstack/react-table-devtools   |      1 |
| @tanstack/preact-table-devtools  |      1 |
| @tanstack/solid-table-devtools   |      1 |
| @tanstack/vue-table-devtools     |      1 |
| @tanstack/angular-table-devtools |      1 |
| @tanstack/match-sorter-utils     |      1 |
| Total                            |     75 |

## Framework distinctions that must survive generation

### React

- useTable returns selected table.state; the default selector selects all registered state.
- table.atoms.get and table.store.state are snapshot reads, not React subscriptions.
- Subscribe is the supported fine-grained boundary and React Compiler escape hatch for builder-method reads hidden in memoized children.
- Do not prescribe fine-grained subscription machinery until render cost or compiler behavior requires it.

### Preact

- Use the native Preact package, not React through preact/compat.
- State selection and Subscribe resemble React but must use Preact adapter/store imports.

### Solid

- createTable atoms are backed by Solid primitives; reads are reactive only inside tracked scopes.
- Prefer native signals for framework-owned state and external TanStack Store atoms for cross-app atom ownership.

### Svelte

- V9 targets Svelte 5 and runes.
- Reactive data and controlled values commonly need getters; avoid passing snapshots.
- createTableHook implementation belongs in a rune-capable module.

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

- Performance: stable inputs in getting-started/core; selectors in table-state; CSS variables in resizing; measurement/overscan in Virtual; row ownership in client-vs-server.
- CSS: pinning, sizing, resizing, and Virtual skills only. Core may state that CSS is user-owned.
- Accessibility: core/getting-started may remind that headless rendering leaves semantics and interaction accessibility with the renderer; do not create a component-library integration skill.
- Query: data source and manual processing boundaries, not Table rendering.
- Virtual: final Table models and renderer geometry, never tableFeatures.
- Context: createTableHook skills; mention context over prop drilling when a registered reusable component needs typed table/cell/header access.
- API lookup: api-not-found establishes the workflow; every other skill includes its direct installed src route.

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
6. Virtual skills teach maintained examples and only identify unsupported combinations as user-owned composition.
7. Devtools guidance is development-only by default; production entrypoints are explained only when explicitly requested.

Domain discovery is reviewed and tree generation may proceed.
