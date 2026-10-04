# React adapter migration details

Read when replacing React table construction, reactive state, rendering, or reusable app hooks. First complete the shared checklist from `intent load @tanstack/table-core#migrate-v8-to-v9`; its references own shared feature, method, and TypeScript mappings.

## Replace `useReactTable` with `useTable`

```tsx
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric },
})

const table = useTable({ features, columns, data })
```

Prefer explicit features as the end state. `stockFeatures` is a useful kitchen-sink migration shortcut, but bundles every stock feature. Do not target `useLegacyTable`: it is deprecated, React-only, exported from `@tanstack/react-table/legacy`, and intended only to keep an existing migration moving temporarily.

## State and reactive reads

| v8                        | v9                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `table.getState()`        | `table.state`, `table.store.state`, or `table.atoms.<slice>.get()`                                                                                     |
| Top-level `onStateChange` | Per-slice `onSortingChange`, `onPaginationChange`, etc., or `table.store.subscribe()` for all changes                                                  |
| Broad component updates   | Default `useTable` selector still subscribes to all registered state; narrow with a selector, `table.Subscribe`, or `useSelector(table.atoms.<slice>)` |
| Framework state only      | Optional writable atoms through `options.atoms`                                                                                                        |

Controlled `state` plus per-slice callbacks remains valid:

```tsx
const [sorting, setSorting] = useState<SortingState>([])
const table = useTable({
  features,
  columns,
  data,
  state: { sorting },
  onSortingChange: setSorting,
})
```

For fine-grained rendering, pass a selector as the second `useTable` argument or select closer to the consumer:

```tsx
const table = useTable(options, () => null)

<table.Subscribe selector={state => state.pagination}>
  {pagination => <span>Page {pagination.pageIndex + 1}</span>}
</table.Subscribe>
```

External atoms override the same slice in `state`; table setters write directly to them, and `table.reset()` does not reset them. Do not supply an atom, controlled value, and callback for the same slice without intentionally applying that precedence.

For React Compiler memoized children hiding builder reads, put `Subscribe` inside the child or pass its selected value as a changing prop. Read [React state](../../table-state/SKILL.md) before adding such a boundary.

## Rendering and composition

- `flexRender(def, context)` still works. Prefer `<table.FlexRender cell={cell} />`, `<table.FlexRender header={header} />`, or the standalone `<FlexRender ... />` for the v9 component form.
- Use `tableOptions()` to type reusable partial option objects.
- Use `createTableHook()` only when several tables share features, row models, defaults, and registered components. It returns app-specific helpers such as `useAppTable`, `createAppColumnHelper`, and table/cell/header context hooks; it is not required for one-off tables.

For detailed controlled wiring or tracking failures, read [table state](../../table-state/SKILL.md). For reusable contexts or components, read [app-hook composition](../../getting-started/references/create-table-hook.md).

## API discovery

Inspect `node_modules/@tanstack/react-table/dist/index.d.ts` and its exported declarations for construction, rendering, and app hooks. Inspect `dist/legacy.d.ts` only to identify deprecated bridge code that still needs removal.

## Sources

- `TanStack/table:docs/framework/react/guide/migrating.md`
- `TanStack/table:packages/react-table/src/index.ts`
- `TanStack/table:packages/react-table/src/legacy.ts`
- `TanStack/table:examples/react/basic-use-table`
