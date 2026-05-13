---
id: table_getAllLeafColumnsById
title: table_getAllLeafColumnsById
---

# Function: table\_getAllLeafColumnsById()

```ts
function table_getAllLeafColumnsById<TFeatures, TData>(table): Record<string, Column<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:224](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L224)

Returns all leaf columns by id for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`Record`\<`string`, [`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>\>

## Example

```ts
const value = table_getAllLeafColumnsById(table)
```
