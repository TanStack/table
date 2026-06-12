---
id: table_getCoreRowModel
title: table_getCoreRowModel
---

# Function: table\_getCoreRowModel()

```ts
function table_getCoreRowModel<TFeatures, TData>(table): RowModel<TFeatures, TData>;
```

Defined in: [core/row-models/coreRowModelsFeature.utils.ts:18](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts#L18)

Resolves the table's unmodified core row model.

The factory is created once per table, either from the `coreRowModel` slot on the `features` option
or the built-in `createCoreRowModel()`, then reused for later calls.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`RowModel`](../../index/interfaces/RowModel.md)\<`TFeatures`, `TData`\>

## Example

```ts
const coreRows = table_getCoreRowModel(table)
```
