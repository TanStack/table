# Preact adapter migration details

Read when replacing Preact table construction, reactive state, rendering, or reusable app hooks. First complete the shared checklist from `intent load @tanstack/table-core#migrate-v8-to-v9`; its references own shared feature, method, and TypeScript mappings.

## Replace `useReactTable` with `useTable`

```tsx
import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})
const table = useTable({ features, columns, data })
```

V8 did not have a first-party Preact adapter; many Preact apps used `@tanstack/react-table` through `preact/compat`. V9 uses native `@tanstack/preact-table`. Remove compatibility aliases that existed only for Table after replacing the imports. Keep aliases needed by other libraries, such as React Virtual. Prefer explicit features as the end state; `stockFeatures` is only a kitchen-sink migration shortcut.

## State and reactive reads

| v8                          | v9                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `table.getState()`          | Reactive `table.state`, snapshot `table.store.state`, or `table.atoms.<slice>.get()` |
| Top-level `onStateChange`   | Per-slice callbacks or `table.store.subscribe()`                                     |
| Whole-component state reads | Custom second-argument selector, `table.Subscribe`, or atom source                   |

The default `useTable` selector subscribes the component to all registered state. Pass a selector for `table.state`, or `() => null` and subscribe lower:

```tsx
const table = useTable(options, () => null)

<table.Subscribe source={table.atoms.rowSelection}>
  {selection => <span>{Object.keys(selection).length} selected</span>}
</table.Subscribe>
```

Controlled `state` plus per-slice `on[State]Change` remains supported. For app-owned atoms, use `useCreateAtom`/`useSelector` from `@tanstack/preact-store` and pass them through `options.atoms`. An external atom wins over `state` for the same slice; do not mirror both ownership models.

## Rendering and composition

- Replace React-adapter `flexRender(def, context)` with `<table.FlexRender cell={cell} />` or standalone `<FlexRender ... />`; the function remains for advanced cases.
- Use `tableOptions()` for typed reusable option fragments.
- Use `createTableHook({ features, ...defaults })` for repeated app table conventions; it returns native app helpers such as `useAppTable` and `createAppColumnHelper`.

For detailed controlled wiring or tracking failures, read [table state](../../table-state/SKILL.md). For reusable contexts or components, read [app-hook composition](../../getting-started/references/create-table-hook.md).

## API discovery

Inspect `node_modules/@tanstack/preact-table/dist/index.d.ts` and its exported declarations for construction, rendering, and app hooks.

## Sources

- `TanStack/table:docs/framework/preact/guide/migrating.md`
- `TanStack/table:packages/preact-table/src/index.ts`
- `TanStack/table:examples/preact/basic-use-table`
