# TypeScript migration mappings

Read for explicit core generics, helpers, meta augmentation, function registries, or primitive row types.

## Update TypeScript feature generics and helpers

Most core types add `TFeatures` before their data/value parameters:

| V8                            | V9                                       |
| ----------------------------- | ---------------------------------------- |
| `Column<TData>`               | `Column<TFeatures, TData, TValue>`       |
| `ColumnDef<TData>`            | `ColumnDef<TFeatures, TData, TValue>`    |
| `Table<TData>`                | `Table<TFeatures, TData>`                |
| `Row<TData>`                  | `Row<TFeatures, TData>`                  |
| `Cell<TData, TValue>`         | `Cell<TFeatures, TData, TValue>`         |
| `createColumnHelper<TData>()` | `createColumnHelper<TFeatures, TData>()` |

Prefer inference. Use `typeof features` only where an explicit type boundary is necessary; use `StockFeatures` when that is genuinely the selected feature set. Wrap column arrays with `columnHelper.columns([...])` to preserve individual and nested `TValue` inference.

`RowData` is now `Record<string, any> | Array<any>`, not `unknown`. Wrap primitive records in an object or array shape.

Global `TableMeta`/`ColumnMeta` declaration merging can remain, but add `TFeatures` as the first generic. Prefer per-table type-only slots where isolation helps:

```ts
const features = tableFeatures({
  columnFilteringFeature,
  tableMeta: metaHelper<MyTableMeta>(),
  columnMeta: metaHelper<MyColumnMeta>(),
  filterMeta: metaHelper<MyFilterMeta>(),
})
```

Replace global `FilterFns`, `SortFns`, and `AggregationFns` augmentation with the matching registry slots; their object keys supply the string-literal names. Replace `FilterMeta` augmentation with the `filterMeta` slot unless global behavior is intentional.

## Installed API discovery

Inspect `node_modules/@tanstack/table-core/dist/types/`, `dist/helpers/`, and exports from `dist/index.d.ts`. For inference repairs beyond the rename audit, read [TypeScript inference](../../core/references/typescript.md).

## Sources

- `TanStack/table:docs/framework/react/guide/migrating.md`
- `TanStack/table:docs/framework/preact/guide/migrating.md`
- `TanStack/table:docs/framework/solid/guide/migrating.md`
- `TanStack/table:docs/framework/svelte/guide/migrating.md`
- `TanStack/table:docs/framework/vue/guide/migrating.md`
- `TanStack/table:docs/framework/angular/guide/migrating.md`
- `TanStack/table:docs/framework/lit/guide/migrating.md`
- `TanStack/table:packages/table-core/src/index.ts`
- `TanStack/table:packages/table-core/src/types/TableFeatures.ts`
- `TanStack/table:packages/table-core/src/features/column-pinning/columnPinningFeature.types.ts`
- `TanStack/table:packages/table-core/src/features/column-resizing/columnResizingFeature.types.ts`
- `TanStack/table:packages/react-table/src/legacy.ts`
