---
id: table_getLeftTotalSize
title: table_getLeftTotalSize
---

# Function: table\_getLeftTotalSize()

```ts
function table_getLeftTotalSize<TFeatures, TData>(table): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:340](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L340)

Sums the rendered size of the left pinned header region.

An empty left pinning region returns `0`.

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
const width = table_getLeftTotalSize(table)
```
