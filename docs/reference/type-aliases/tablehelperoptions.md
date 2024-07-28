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

### TData

```ts
TData: TData;
```

### \_features

```ts
_features: TFeatures;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Defined in

[helpers/tableHelper.ts:12](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/helpers/tableHelper.ts#L12)
