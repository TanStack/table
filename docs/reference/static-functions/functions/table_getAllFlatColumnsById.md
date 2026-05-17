---
id: table_getAllFlatColumnsById
title: table_getAllFlatColumnsById
---

# Function: table\_getAllFlatColumnsById()

```ts
function table_getAllFlatColumnsById<TFeatures, TData>(table): Record<string, Column<TFeatures, TData, unknown>>;
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:182](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L182)

Builds an id lookup for every flat column in the table.

Group columns and leaf columns are included. Later columns with the same id
replace earlier entries.

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
const columnsById = table_getAllFlatColumnsById(table)
```
