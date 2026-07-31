---
id: table_getRowsInDisplayOrder
title: table_getRowsInDisplayOrder
---

# Function: table\_getRowsInDisplayOrder()

```ts
function table_getRowsInDisplayOrder<TFeatures, TData>(table): Row<TFeatures, TData>[];
```

Defined in: [core/rows/coreRowsFeature.utils.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L33)

Returns the rows in the current display order after assigning their
zero-based display indexes.

When expanded rows bypass pagination, expanded descendants are inserted into
the returned order even though they are absent from the pre-pagination row
model.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>[]
