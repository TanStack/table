# Material React Table — TanStack Table v9 example

This example is a downloadable, self-contained adaptation of [`material-react-table`](https://www.material-react-table.com/) v3 ported to TanStack Table v9 + Material UI v9.

The full MRT source lives under `src/material-react-table/` — it is a 1:1 mirror of the upstream package's `src/` (components, hooks, utils, fns, locales). The demo entry point in `src/main.tsx` shows how to wire it up.

## Differences from upstream MRT v3

The upstream package targets TanStack Table v8 + MUI v6. This example has been migrated:

- **`useReactTable` → `useTable`** (TanStack Table v9 hook).
- **Row models**: `getCoreRowModel`/`getSortedRowModel`/etc. options replaced with `_features: stockFeatures` and `_rowModels: { sortedRowModel: createSortedRowModel(sortFns), … }`.
- **`createRow` → `constructRow`** (renamed v9 export).
- **`sortingFn` → `sortFn`** on column defs and the `MRT_SortFn` type.
- **`columnSizingInfo` state → `columnResizing`** (and `setColumnSizingInfo` → `setColumnResizing`).
- **`table.getState()` → `table.state`** across all ~48 consumer sites.
- **Type generics**: every `MRT_*` type now binds `TFeatures = StockFeatures` so consumers don't need to specify it.
- **MUI v9**: `componentsProps` → `slotProps` (one site).

The example uses the v9 escape-hatch `useTable(opts, state => state)` — every state change re-renders the consumer, matching v8 semantics. If you'd prefer fine-grained re-renders, swap the selector for narrower projections or use `table.Subscribe`/per-slice `table.atoms`.

## Running

```sh
pnpm install
pnpm dev
```

Then open <http://localhost:5173>.

## Caveats

- `@mui/x-date-pickers` is pinned to `^8` in `package.json` because there is no v9 release. The MRT date-picker filter variant is therefore wired up but not exercised by the demo (no date columns). If install fails because of a peer-dep mismatch with `@mui/material@^9`, either add an override in your local `pnpm-workspace.yaml` or remove `@mui/x-date-pickers` from `package.json` and delete the date-picker imports in `src/material-react-table/components/inputs/MRT_FilterTextField.tsx` and `src/material-react-table/types.ts`.

## Credits

Original library by [Kevin Vandy](https://github.com/KevinVandy) — <https://github.com/KevinVandy/material-react-table>.
