---
id: TableHelperOptions
title: TableHelperOptions
---

# Type Alias: TableHelperOptions\<TFeatures, TData\>

```ts
type TableHelperOptions<TFeatures, TData>: Omit<TableOptions<TFeatures, TData>, "columns" | "data" | "state"> & object;
```

Options for creating a table helper to share common options across multiple tables
Columns, data, and state are excluded from this type and reserved for only the `useTable`/`createTable` functions

## Type declaration

### \_features

```ts
_features: TFeatures;
```

### TData

```ts
TData: TData;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[helpers/tableHelper.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableHelper.ts#L12)
