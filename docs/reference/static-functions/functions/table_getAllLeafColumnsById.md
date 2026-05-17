---
id: table_getAllLeafColumnsById
title: table_getAllLeafColumnsById
---

# Function: table\_getAllLeafColumnsById()

```ts
function table_getAllLeafColumnsById<TFeatures, TData>(table): Record<string, Column<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:235](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L235)

Builds an id lookup for terminal leaf columns only.

Parent/group columns are excluded, making this lookup appropriate for row
cells and feature state keyed by data columns.

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
const leavesById = table_getAllLeafColumnsById(table)
```
