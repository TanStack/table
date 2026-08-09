---
id: table_getStartFlatHeaders
title: table_getStartFlatHeaders
---

# Function: table\_getStartFlatHeaders()

```ts
function table_getStartFlatHeaders<TFeatures, TData>(table): Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:556](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L556)

Flattens every header from the start pinned header groups.

Parent headers and placeholder headers are included.

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
const headers = table_getStartFlatHeaders(table)
```
