---
id: constructColumn
title: constructColumn
---

# Function: constructColumn()

```ts
function constructColumn<TFeatures, TData, TValue>(
   table, 
   columnDef, 
   depth, 
parent?): Column<TFeatures, TData, TValue>;
```

Defined in: [core/columns/constructColumn.ts:36](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/constructColumn.ts#L36)

Constructs a column instance from normalized table internals.

This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### columnDef

[`ColumnDef`](../type-aliases/ColumnDef.md)\<`TFeatures`, `TData`, `TValue`\>

### depth

`number`

### parent?

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>

## Returns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>
