---
id: table_getRightLeafHeaders
title: table_getRightLeafHeaders
---

# Function: table\_getRightLeafHeaders()

```ts
function table_getRightLeafHeaders<TFeatures, TData>(table): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:650](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L650)

Collects leaf headers for the right pinned region.

Parent headers are filtered out from the right flat header list.

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
const headers = table_getRightLeafHeaders(table)
```
