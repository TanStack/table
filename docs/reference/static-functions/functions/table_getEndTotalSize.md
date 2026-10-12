---
id: table_getEndTotalSize
title: table_getEndTotalSize
---

```ts
function table_getEndTotalSize<TFeatures, TData>(table): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:449](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L449)

Sums the sizes of the visible leaf columns pinned to the logical end region.

An empty end pinning region returns `0`.

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
const width = table_getEndTotalSize(table)
```
