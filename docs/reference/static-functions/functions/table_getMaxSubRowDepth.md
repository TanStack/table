---
id: table_getMaxSubRowDepth
title: table_getMaxSubRowDepth
---

# Function: table\_getMaxSubRowDepth()

```ts
function table_getMaxSubRowDepth<TFeatures, TData>(table): number;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:174](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L174)

Returns the deepest structural row depth in the core row model.
Root rows are depth `0`, their direct sub-rows are depth `1`, and so on.

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
