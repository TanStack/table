---
id: constructCell
title: constructCell
---

# Function: constructCell()

```ts
function constructCell<TFeatures, TData, TValue>(
   column, 
   row, 
table): Cell<TFeatures, TData, TValue>;
```

Defined in: [core/cells/constructCell.ts:32](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/constructCell.ts#L32)

Constructs a cell instance from normalized table internals.

This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### column

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>

### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

## Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `TValue`\>
