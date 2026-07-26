---
id: cell_getIsSelected
title: cell_getIsSelected
---

# Function: cell\_getIsSelected()

```ts
function cell_getIsSelected<TFeatures, TData, TValue>(cell): boolean;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:396](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L396)

Checks whether this cell falls inside any selected range.

Deliberately not memoized. Registering this through `assignPrototypeAPIs`
with `memoDeps` would allocate a memo closure and dependency array per cell,
which costs more than the handful of integer comparisons it would save.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### cell

[`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

`boolean`

## Example

```ts
const isSelected = cell_getIsSelected(cell)
```
