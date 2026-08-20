---
id: table_getIsAllRowsExpanded
title: table_getIsAllRowsExpanded
---

# Function: table\_getIsAllRowsExpanded()

```ts
function table_getIsAllRowsExpanded<TFeatures, TData>(table): boolean;
```

Defined in: [features/row-expanding/rowExpandingFeature.utils.ts:207](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-expanding/rowExpandingFeature.utils.ts#L207)

Checks whether every expandable row in the current row model is expanded.

The special expanded-all value `true` returns true immediately. Empty
expanded state returns false. Rows that cannot expand are ignored, so a
materialized expanded-all map (which only contains expandable row ids)
still counts as all rows expanded.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`boolean`

## Example

```ts
const allExpanded = table_getIsAllRowsExpanded(table)
```
