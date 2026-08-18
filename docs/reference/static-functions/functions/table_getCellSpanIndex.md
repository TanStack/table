---
id: table_getCellSpanIndex
title: table_getCellSpanIndex
---

# Function: table\_getCellSpanIndex()

```ts
function table_getCellSpanIndex<TFeatures, TData>(table): CellSpanIndex<TFeatures, TData>;
```

Defined in: [features/cell-spanning/cellSpanningFeature.utils.ts:150](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-spanning/cellSpanningFeature.utils.ts#L150)

Builds the table's cell span index for the rows that are currently rendered.

Spans are always derived from scratch from the final row model, so sorting,
filtering, pagination, expansion, and row pinning only change adjacency and
the index follows. Nothing is persisted and there is nothing to configure.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`CellSpanIndex`](../../index/interfaces/CellSpanIndex.md)\<`TFeatures`, `TData`\>

## Example

```ts
const spanIndex = table_getCellSpanIndex(table)
```
