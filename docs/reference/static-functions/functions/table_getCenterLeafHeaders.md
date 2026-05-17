---
id: table_getCenterLeafHeaders
title: table_getCenterLeafHeaders
---

# Function: table\_getCenterLeafHeaders()

```ts
function table_getCenterLeafHeaders<TFeatures, TData>(table): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:671](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L671)

Collects leaf headers for the center, unpinned region.

Parent headers are filtered out from the center flat header list.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

`any`[]

## Example

```ts
const headers = table_getCenterLeafHeaders(table)
```
