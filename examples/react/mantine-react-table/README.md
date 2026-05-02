# Mantine React Table — TanStack Table v9 example

This example is a downloadable, self-contained adaptation of [`mantine-react-table`](https://www.mantine-react-table.com/) v2 ported to TanStack Table v9 + Mantine v9.

The full MaRT source lives under `src/mantine-react-table/` — it is a 1:1 mirror of the upstream package's `src/` (components, hooks, utils, fns, locales). The demo entry point in `src/main.tsx` shows how to wire it up.

## Differences from upstream MaRT v2

The upstream package targets TanStack Table v8 + Mantine v7. This example has been migrated:

### TanStack Table v8 → v9

- **`useReactTable` → `useTable`** with `state => state` selector.
- **Row models**: `getCoreRowModel`/`getSortedRowModel`/etc. options replaced with `_features: stockFeatures` and `_rowModels: { sortedRowModel: createSortedRowModel(sortFns), … }`.
- **`createRow` → `constructRow`** (renamed v9 export).
- **`sortingFn` → `sortFn`** on column defs and the `MRT_SortFn` type.
- **`columnSizingInfo` state → `columnResizing`** (and `setColumnSizingInfo` → `setColumnResizing`).
- **`getPrePaginationRowModel` → `getPrePaginatedRowModel`**.
- **`MRT_VisibilityState` → `MRT_ColumnVisibilityState`**.
- **`table.getState()` → `table.state`** across all consumer sites.
- **Type generics**: every `MRT_*` type now binds `TFeatures = StockFeatures` so consumers don't need to specify it.
- **State management**: rebuilt on TanStack Store atoms (`useCreateAtom` + `useSelector`) so MRT-only slices like `density` and `isFullScreen` are properly reactive. TanStack-aware slices (`columnOrder`, `columnResizing`, `grouping`, `pagination`) flow through the v9 `atoms` option.

### Mantine v7 → v9

- **`Collapse` `in` prop → `expanded`** (5 sites).
- **`@mantine/core/styles.css` import** in `main.tsx`.
- **`postcss.config.cjs`** with `postcss-preset-mantine` (required for v9 theme variables).
- **Tabler icons bumped** to `^3.41.1`.

The example uses the v9 escape-hatch `useTable(opts, state => state)` — every state change re-renders the consumer, matching v8 semantics. If you'd prefer fine-grained reactivity, swap the selector for narrower projections or use `table.Subscribe` / per-slice `table.atoms.<slice>`.

## Running

```sh
pnpm install
pnpm dev
```

Then open <http://localhost:5173>.

## Caveats

- `@mantine/dates` is pinned to `^9.1.1` to match `@mantine/core`. If a particular MaRT date-picker filter variant misbehaves visually, the v9 picker API is broadly compatible but a few props may need tweaking — the demo doesn't include date columns, so this isn't exercised end-to-end.
- The demo deliberately avoids date columns so it works even if `@mantine/dates@^9.1.1` resolution becomes a problem in a future bump.

## Credits

Original library by [Kevin Vandy](https://github.com/KevinVandy) — <https://github.com/KevinVandy/mantine-react-table>.
