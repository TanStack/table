---
id: table_getStartTotalSize
title: table_getStartTotalSize
---

# Function: table\_getStartTotalSize()

```ts
function table_getStartTotalSize<TFeatures, TData>(table): number;
```

Defined in: [features/column-sizing/columnSizingFeature.utils.ts:395](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-sizing/columnSizingFeature.utils.ts#L395)

Sums the rendered size of the start pinned header region.

An empty start pinning region returns `0`.

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
const width = table_getStartTotalSize(table)
```
