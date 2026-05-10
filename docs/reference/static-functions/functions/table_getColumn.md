---
id: table_getColumn
title: table_getColumn
---

# Function: table\_getColumn()

```ts
function table_getColumn<TFeatures, TData>(table, columnId): 
  | Column<TFeatures, TData, unknown>
  | undefined;
```

Defined in: [core/columns/coreColumnsFeature.utils.ts:226](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L226)

Returns column for the table.

This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../../index/type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### columnId

`string`

## Returns

  \| [`Column`](../../index/type-aliases/Column.md)\<`TFeatures`, `TData`, `unknown`\>
  \| `undefined`

## Example

```ts
const value = table_getColumn(table)
```
