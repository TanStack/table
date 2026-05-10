---
id: cell_getValue
title: cell_getValue
---

# Function: cell\_getValue()

```ts
function cell_getValue<TFeatures, TData, TValue>(cell): TValue;
```

Defined in: [core/cells/coreCellsFeature.utils.ts:15](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.utils.ts#L15)

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

`TValue`

## Example

```ts
const value = cell_getValue(cell)
```
