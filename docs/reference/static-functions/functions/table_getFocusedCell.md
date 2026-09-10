---
id: table_getFocusedCell
title: table_getFocusedCell
---

# Function: table\_getFocusedCell()

```ts
function table_getFocusedCell<TFeatures, TData>(table):
  | Cell<TFeatures, TData, any>
  | undefined;
```

Defined in: [features/cell-selection/cellSelectionFeature.utils.ts:760](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/cell-selection/cellSelectionFeature.utils.ts#L760)

Returns the active cell, i.e. the anchor of the most recent operation.

Focus is derived rather than stored: in spreadsheet semantics, dragging from
A1 to C5 leaves the active cell at A1, so the active range's anchor already
is the active cell.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

  \| [`Cell`](../../index/type-aliases/Cell.md)\<`TFeatures`, `TData`, `any`\>
  \| `undefined`

## Example

```ts
const cell = table_getFocusedCell(table)
```
