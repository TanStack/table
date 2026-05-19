---
id: table_getRowCount
title: table_getRowCount
---

# Function: table\_getRowCount()

```ts
function table_getRowCount<TFeatures, TData>(table): number;
```

Defined in: [features/row-pagination/rowPaginationFeature.utils.ts:395](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pagination/rowPaginationFeature.utils.ts#L395)

Resolves the total row count used for pagination math.

`options.rowCount` wins for manual pagination. Otherwise the count comes
from the pre-paginated row model so filtering, grouping, sorting, and
expansion are reflected before the page slice is applied.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Example

```ts
const rows = table_getRowCount(table)
```
