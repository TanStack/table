---
id: table_getRightFlatHeaders
title: table_getRightFlatHeaders
---

# Function: table\_getRightFlatHeaders()

```ts
function table_getRightFlatHeaders<TFeatures, TData>(table): Header<TFeatures, TData, unknown>[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:569](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L569)

Flattens every header from the right pinned header groups.

Parent headers and placeholder headers are included.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Header`](../../index/type-aliases/Header.md)\<`TFeatures`, `TData`, `unknown`\>[]

## Example

```ts
const headers = table_getRightFlatHeaders(table)
```
