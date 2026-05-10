---
id: cell_renderValue
title: cell_renderValue
---

# Function: cell\_renderValue()

```ts
function cell_renderValue<TFeatures, TData, TValue>(cell): any;
```

Defined in: [core/cells/coreCellsFeature.utils.ts:33](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.utils.ts#L33)

Returns value for a cell.

This is the static implementation behind the matching cell instance API and uses the owning row and column context.

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

`any`

## Example

```ts
const value = cell_renderValue(cell)
```
