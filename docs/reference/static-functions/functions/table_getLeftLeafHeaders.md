---
id: table_getLeftLeafHeaders
title: table_getLeftLeafHeaders
---

# Function: table\_getLeftLeafHeaders()

```ts
function table_getLeftLeafHeaders<TFeatures, TData>(table): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:629](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L629)

Collects leaf headers for the left pinned region.

Parent headers are filtered out from the left flat header list.

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
const headers = table_getLeftLeafHeaders(table)
```
