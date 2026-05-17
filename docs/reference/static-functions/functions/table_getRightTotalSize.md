---
id: table_getRightTotalSize
title: table_getRightTotalSize
---

# Function: table\_getRightTotalSize()

```ts
function table_getRightTotalSize<TFeatures, TData>(table): any;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:368](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L368)

Sums the rendered size of the right pinned header region.

An empty right pinning region returns `0`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`any`

## Example

```ts
const width = table_getRightTotalSize(table)
```
