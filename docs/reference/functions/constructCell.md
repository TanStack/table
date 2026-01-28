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

Defined in: [packages/table-core/src/core/cells/constructCell.ts:26](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cells/constructCell.ts#L26)

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
