---
id: TableHelperOptions
title: TableHelperOptions
---

# Type Alias: TableHelperOptions\<TFeatures\>

```ts
type TableHelperOptions<TFeatures> = Omit<TableOptions<TFeatures, any>, "columns" | "data" | "store" | "state" | "initialState"> & object;
```

Defined in: [packages/table-core/src/helpers/tableHelper.ts:12](https://github.com/TanStack/table/blob/main/packages/table-core/src/helpers/tableHelper.ts#L12)

Options for creating a table helper to share common options across multiple tables
coreColumnsFeature, data, and state are excluded from this type and reserved for only the `useTable`/`createTable` functions

## Type Declaration

### \_features

```ts
_features: TFeatures;
```

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)
