# Svelte adapter migration details

Read when replacing Svelte table construction, reactive state, rendering, or reusable app hooks. First complete the shared checklist from `intent load @tanstack/table-core#migrate-v8-to-v9`; its references own shared feature, method, and TypeScript mappings.

## Replace `createSvelteTable` with `createTable`

Upgrade to Svelte 5 before Table. Replace the old store-based adapter setup with `createTable` and rune-aware getters. `createTable` and `createAppTable` accept only options.

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

## Svelte state migration

- Reactive option inputs must remain live: use getters for rune values such as `data` and controlled state slices.
- `table.getState().sorting` becomes the narrow `table.atoms.sorting.get()` read. Use `table.store.get()` when code intentionally needs the complete state.
- Table atom, store, and API reads become reactive inside templates, `$derived`, `$derived.by`, and `$effect`; use native `$derived` values for projections.
- Remove second-argument selectors from `createTable` and `createAppTable` (if present from an earlier v9 version), replace `table.state`, and remove `subscribeTable` / `SubscribeSource` imports.
- `SvelteTable` now has two generic parameters, `AppSvelteTable` has five, and `useTableContext` no longer accepts a selected-state generic.
- For Svelte-owned controlled slices, use `createTableState` and matching `onSortingChange`, `onPaginationChange`, and other per-slice callbacks.
- For shared ownership, provide atoms created by `@tanstack/svelte-store` through `atoms`. Never provide both `atoms.pagination` and `state.pagination`.
- Subscribe to `table.store` to observe every state change. Do not port the removed top-level `onStateChange`.
- Treat `table.baseAtoms` as internal writable state; prefer feature APIs or external atoms.

## Rendering and composition

| v8                                       | v9                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| `flexRender(...)` / `<svelte:component>` | `<FlexRender {cell} />`, `<FlexRender {header} />`, or `<FlexRender {footer} />` |
| Component returned directly              | `renderComponent(Component, props)`                                              |
| Svelte snippet content                   | `renderSnippet(snippet, props)`                                                  |
| Repeated raw options                     | `tableOptions(...)` composition                                                  |
| Repeated table conventions               | `createTableHook({ features, ... })` and its pre-bound helpers                   |

`createTableHook` returns a feature-bound table creator and column helper; use it for application-wide conventions, not as a required migration step.

For detailed controlled wiring or tracking failures, read [table state](../../table-state/SKILL.md). For reusable contexts or components, read [app-hook composition](../../getting-started/references/create-table-hook.md).

## API discovery

Inspect `node_modules/@tanstack/svelte-table/dist/index.d.ts` and its exported declarations for construction, rendering, and app hooks.

## Sources

- `TanStack/table:docs/framework/svelte/guide/migrating.md`
- `TanStack/table:packages/svelte-table/src/index.ts`
- `TanStack/table:examples/svelte/basic-create-table`
