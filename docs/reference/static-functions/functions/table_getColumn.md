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

Defined in: [core/columns/coreColumnsFeature.utils.ts:261](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/columns/coreColumnsFeature.utils.ts#L261)

Looks up a column by id from the flat column map.

The lookup can return group columns or leaf columns. In development, a
missing id logs a warning to help catch stale column references.

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
const column = table_getColumn(table, 'firstName')
```
