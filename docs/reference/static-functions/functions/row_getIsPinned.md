---
id: row_getIsPinned
title: row_getIsPinned
---

# Function: row\_getIsPinned()

```ts
function row_getIsPinned<TFeatures, TData>(row): RowPinningPosition;
```

Defined in: [features/row-pinning/rowPinningFeature.utils.ts:235](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/row-pinning/rowPinningFeature.utils.ts#L235)

Reads this row's current pinning region.

Rows listed in `state.rowPinning.top` return `'top'`, rows listed in
`bottom` return `'bottom'`, and unpinned rows return `false`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

[`RowPinningPosition`](../../index/type-aliases/RowPinningPosition.md)

## Example

```ts
const position = row_getIsPinned(row)
```
