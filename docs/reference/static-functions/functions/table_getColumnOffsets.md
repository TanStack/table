---
id: table_getColumnOffsets
title: table_getColumnOffsets
---

# Function: table\_getColumnOffsets()

```ts
function table_getColumnOffsets<TFeatures, TData>(table): ColumnOffsetsByPosition;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L131)

Builds start and after offset maps for every visible leaf column, computed
once per pinning region plus the full visible list.

A single table-level memo of this result backs all `column.getStart()` and
`column.getAfter()` calls with O(1) lookups.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`ColumnOffsetsByPosition`](../../index/interfaces/ColumnOffsetsByPosition.md)

## Example

```ts
const offsets = table_getColumnOffsets(table)
const startOffset = offsets.start.starts[column.id]
```
