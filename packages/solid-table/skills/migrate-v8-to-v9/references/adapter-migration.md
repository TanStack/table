# Solid adapter migration details

Read when replacing Solid table construction, reactive state, rendering, or reusable app hooks. First complete the shared checklist from `intent load @tanstack/table-core#migrate-v8-to-v9`; its references own shared feature, method, and TypeScript mappings.

## Replace `createSolidTable` with `createTable`

```tsx
import {
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/solid-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

Keep static features and columns outside reactive component work. Prefer explicit features as the end state; `stockFeatures` is a kitchen-sink migration shortcut.

## State and reactive reads

| v8                             | v9                                                                          |
| ------------------------------ | --------------------------------------------------------------------------- |
| `table.getState()`             | `table.atoms.<slice>.get()` in tracked scopes, or broad `table.store.get()` |
| Top-level `onStateChange`      | Per-slice callbacks or `table.store.subscribe()`                            |
| Eager signal values in options | Getters for reactive `data` and controlled state slices                     |
| Whole-state rendering          | Narrow atom reads in JSX, `createMemo`, or `createEffect`                   |

```tsx
const [sorting, setSorting] = createSignal<SortingState>([])
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  state: {
    get sorting() {
      return sorting()
    },
  },
  onSortingChange: setSorting,
})
```

`table.Subscribe` is deprecated and adds no subscription or tracking scope. Remove the wrapper and read `table.atoms` directly inside JSX, memos, or effects:

```tsx
<span>Page {table.atoms.pagination.get().pageIndex + 1}</span>
```

Use `createAtom`/`useSelector` from `@tanstack/solid-store` for externally owned slices. An external atom wins over `state` for the same slice; do not combine ownership models accidentally.

## Rendering and composition

- Replace `flexRender(def, context)` with `<FlexRender header={header} />` or `<table.FlexRender cell={cell} />`.
- Use `tableOptions()` for typed reusable option fragments.
- Use `createTableHook({ features, ...defaults })` for repeated conventions; it returns helpers such as `createAppTable` and `createAppColumnHelper`.

For detailed controlled wiring or tracking failures, read [table state](../../table-state/SKILL.md). For reusable contexts or components, read [app-hook composition](../../getting-started/references/create-table-hook.md).

## API discovery

Inspect `node_modules/@tanstack/solid-table/dist/index.d.ts` and its exported declarations for construction, rendering, and app hooks.

## Sources

- `TanStack/table:docs/framework/solid/guide/migrating.md`
- `TanStack/table:packages/solid-table/src/index.tsx`
- `TanStack/table:examples/solid/basic-use-table`
