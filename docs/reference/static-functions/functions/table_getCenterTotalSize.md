---
id: table_getCenterTotalSize
title: table_getCenterTotalSize
---

# Function: table\_getCenterTotalSize()

```ts
function table_getCenterTotalSize<TFeatures, TData>(table): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:431](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L431)

Sums the rendered size of the center, unpinned header region.

An empty center region returns `0`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`number`

## Example

```ts
const width = table_getCenterTotalSize(table)
```
