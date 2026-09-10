---
id: cell_renderValue
title: cell_renderValue
---

# Function: cell\_renderValue()

```ts
function cell_renderValue<TFeatures, TData, TValue>(cell): any;
```

Defined in: [core/cells/coreCellsFeature.utils.ts:35](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/coreCellsFeature.utils.ts#L35)

Reads the value that should be rendered for this cell.

Nullish accessor values are replaced with `table.options.renderFallbackValue`,
matching the behavior of `cell.renderValue()`.

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
const rendered = cell_renderValue(cell)
```
