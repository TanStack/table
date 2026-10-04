# Vue adapter migration details

Read when replacing Vue table construction, reactive state, rendering, or reusable app hooks. First complete the shared checklist from `intent load @tanstack/table-core#migrate-v8-to-v9`; its references own shared feature, method, and TypeScript mappings.

## Replace `useVueTable` with `useTable`

Preserve reactive option wrappers while replacing the composable. `data: data.value` captures one array; pass the ref or a getter returning its current value.

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})
const data = ref(makeData())
const table = useTable({ features, columns, data })
```

## Vue state migration

- Pass a `ref` or `computed` as `data`; the adapter unwraps and syncs it. Do not pass `data.value`, which is only a snapshot. A getter returning `data.value` is also supported.
- `table.getState().sorting` becomes the narrow `table.atoms.sorting.get()`. Use `table.store.get()` only for a full snapshot/debug output.
- Wrap atom reads in Vue `computed` when deriving template values.
- In JSX/render functions, `table.Subscribe` provides a fine-grained boundary. Pass the callback as the explicit `children` prop because Vue JSX element children become slots.
- Controlled refs need getter-backed state slices plus per-slice callbacks that resolve value-or-function `Updater`s.
- The top-level `onStateChange` is removed. Use per-slice callbacks, external atoms, or `table.store.subscribe` to observe everything.
- External atoms come from `@tanstack/vue-store` and are supplied through `atoms`. Never provide both `atoms.pagination` and `state.pagination`.
- `table.baseAtoms` is internal writable state; prefer feature APIs or external atoms.

## Rendering and composition

| v8                                                                               | v9 target                                                  |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />` | `<FlexRender :cell="cell" />`                              |
| Manual header/footer render props                                                | `<FlexRender :header="header" />` / `:footer="footer"`     |
| Repeated raw options                                                             | `tableOptions(...)` composition                            |
| Repeated table conventions                                                       | `createTableHook({ features, ... })` and pre-bound helpers |

The old `render`/`props` FlexRender shape still compiles, but shorthand is the migration target. `createTableHook` is optional and intended for application-wide conventions.

For detailed controlled wiring or tracking failures, read [table state](../../table-state/SKILL.md). For reusable contexts or components, read [app-hook composition](../../getting-started/references/create-table-hook.md).

## API discovery

Inspect `node_modules/@tanstack/vue-table/dist/index.d.ts` and its exported declarations for construction, rendering, and app hooks.

## Sources

- `TanStack/table:docs/framework/vue/guide/migrating.md`
- `TanStack/table:packages/vue-table/src/index.ts`
- `TanStack/table:examples/vue/basic-use-table`
