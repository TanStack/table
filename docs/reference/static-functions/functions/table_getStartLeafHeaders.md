---
id: table_getStartLeafHeaders
title: table_getStartLeafHeaders
---

# Function: table\_getStartLeafHeaders()

```ts
function table_getStartLeafHeaders<TFeatures, TData>(table): Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:645](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L645)

Collects leaf headers for the start pinned region.

Parent headers are filtered out from the start flat header list.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Header`](../../index/type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const headers = table_getStartLeafHeaders(table)
```
